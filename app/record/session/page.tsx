"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BlobShape from "@/components/Blob";
import { getPromptById, DEFAULT_PROMPT_ID, type Prompt } from "@/lib/prompts";
import { getSelectedPromptId, saveRecording } from "@/lib/storage";

const MAX_DURATION_SEC = 300; // 5 min hard stop (AC-7)
const PAUSE_THRESHOLD_SEC = 4; // silence window that triggers AI nudge
const SILENCE_RMS = 4; // RMS-from-128 below this = "silent"

const NUDGES = [
  "What do you remember most clearly about that moment?",
  "Who else was there with you?",
  "What were you feeling right then?",
  "What would you want her to know about that?",
  "What's a small detail you've never told anyone?",
];

type RecState = "idle" | "recording" | "paused" | "saving";

function pickNudge(): string {
  return NUDGES[Math.floor(Math.random() * NUDGES.length)];
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export default function RecordingSessionPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | undefined>(() =>
    getPromptById(DEFAULT_PROMPT_ID),
  );

  const promptIdRef = useRef<string>(DEFAULT_PROMPT_ID);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getSelectedPromptId();
        if (cancelled || !id) return;
        const p = getPromptById(id);
        if (p) {
          setPrompt(p);
          promptIdRef.current = p.id;
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [state, setState] = useState<RecState>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [nudge, setNudge] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // refs to keep things stable across re-renders
  const stateRef = useRef<RecState>("idle");
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const silentSinceRef = useRef<number | null>(null);
  const nudgeShownRef = useRef(false);
  const startMsRef = useRef<number>(0);

  const teardown = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {}
    }
    recorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    // RMS amplitude (deviation from 128).
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const dev = data[i] - 128;
      sum += dev * dev;
    }
    const rms = Math.sqrt(sum / data.length);

    // Pause detection — only while recording.
    if (stateRef.current === "recording") {
      const now = performance.now();
      if (rms < SILENCE_RMS) {
        if (silentSinceRef.current == null) silentSinceRef.current = now;
        else if (
          !nudgeShownRef.current &&
          now - silentSinceRef.current >= PAUSE_THRESHOLD_SEC * 1000
        ) {
          nudgeShownRef.current = true;
          setNudge(pickNudge());
        }
      } else {
        silentSinceRef.current = null;
      }
    }

    // Clear with warm bg tint.
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(245, 240, 232, 0.0)";
    ctx.fillRect(0, 0, w, h);

    // Multi-layer waveform: sage-pale, gold-pale, terra-pale, terra (front).
    const layers: Array<{ color: string; scale: number; phase: number }> = [
      { color: "rgba(212, 228, 212, 0.55)", scale: 0.55, phase: 0 },
      { color: "rgba(240, 223, 184, 0.55)", scale: 0.75, phase: 0.6 },
      { color: "rgba(232, 196, 176, 0.65)", scale: 0.9, phase: 1.2 },
      { color: "rgba(198, 123, 92, 0.85)", scale: 1.0, phase: 1.8 },
    ];

    const mid = h / 2;
    const t = performance.now() / 600;
    // Gain: scale visible amplitude up from raw RMS for liveliness while idle.
    const amp = Math.max(rms, 1.5);

    for (const layer of layers) {
      ctx.beginPath();
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const step = 4;
      for (let x = 0; x <= w; x += step) {
        const sample = data[Math.floor((x / w) * data.length)] - 128;
        const noise = sample / 128;
        const wave =
          Math.sin((x / w) * Math.PI * 4 + t + layer.phase) * 0.4 + noise;
        const y = mid + wave * amp * 2.2 * layer.scale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(drawFrame);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices) {
      setError("Microphone unavailable in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      // Audio analysis pipeline.
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder.
      const mimeType = MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus",
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const durationSec = Math.max(
          1,
          Math.round((performance.now() - startMsRef.current) / 1000),
        );
        try {
          await saveRecording(blob, {
            mimeType,
            durationSec,
            promptId: promptIdRef.current,
          });
        } catch (err) {
          console.warn("[record] saveRecording failed:", err);
        } finally {
          teardown();
          router.push("/record/review");
        }
      };
      recorderRef.current = recorder;
      startMsRef.current = performance.now();
      silentSinceRef.current = null;
      nudgeShownRef.current = false;
      setNudge(null);
      setElapsedSec(0);
      recorder.start(250);
      setState("recording");
      rafRef.current = requestAnimationFrame(drawFrame);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Microphone access denied. ${msg}`);
      teardown();
    }
  }, [drawFrame, router, teardown]);

  const togglePause = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setState("paused");
    } else if (recorder.state === "paused") {
      recorder.resume();
      setState("recording");
    }
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) {
      router.push("/record/review");
      return;
    }
    setState("saving");
    try {
      recorder.stop();
    } catch (err) {
      console.warn("[record] stop failed:", err);
      teardown();
      router.push("/record/review");
    }
  }, [router, teardown]);

  // Timer + auto-stop at MAX_DURATION_SEC.
  useEffect(() => {
    if (state !== "recording") return;
    const id = window.setInterval(() => {
      setElapsedSec((s) => {
        const next = s + 1;
        if (next >= MAX_DURATION_SEC) {
          stop();
          return MAX_DURATION_SEC;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state, stop]);

  const recording = state === "recording";
  const paused = state === "paused";
  const saving = state === "saving";
  const showSecondaryControls = recording || paused;

  let primaryHandler: () => void = start;
  if (recording || paused) primaryHandler = stop;

  let helperText =
    "Tap to record. Tap again to stop.";
  if (recording) helperText = "Recording… tap the circle to stop.";
  else if (paused) helperText = "Paused. Tap the circle to stop, or Resume below.";
  else if (saving) helperText = "Saving your story…";

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <BlobShape variant="terra" size={220} style={{ top: -60, left: -60 }} />
      <BlobShape variant="sage" size={160} style={{ bottom: 60, right: -40 }} />
      <BlobShape variant="gold" size={100} style={{ top: 200, right: 30 }} />

      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-10 text-center md:py-14">
        <p className="eyebrow mb-3">Recording Prompt</p>
        <h1
          className="font-display mb-2 text-3xl leading-snug md:text-4xl"
          style={{ color: "var(--ink)" }}
        >
          {prompt?.text}
        </h1>
        <p
          className="mb-10 text-sm"
          style={{ color: "var(--muted)" }}
        >
          Take a breath. Begin when you&apos;re ready. Up to {prompt?.durationMin} min.
        </p>

        <div className="mb-6 flex flex-col items-center gap-6">
          <div
            className="font-mono text-3xl"
            style={{ color: "var(--ink)" }}
          >
            {formatTime(elapsedSec)}
          </div>

          <button
            type="button"
            className={`record-btn ${recording ? "recording" : ""}`}
            aria-label={
              recording ? "Stop recording" : paused ? "Stop recording" : "Start recording"
            }
            onClick={primaryHandler}
            disabled={saving}
            style={{
              opacity: saving ? 0.5 : 1,
            }}
          >
            {recording ? (
              <span
                className="block h-7 w-7 rounded-sm mx-auto"
                style={{ background: "var(--white)" }}
                aria-hidden
              />
            ) : paused ? (
              <span
                className="block h-7 w-7 rounded-sm mx-auto"
                style={{ background: "var(--white)" }}
                aria-hidden
              />
            ) : null}
          </button>

          <p
            className="text-xs"
            style={{ color: "var(--muted)" }}
          >
            {helperText}
          </p>

          {showSecondaryControls && (
            <button
              type="button"
              className="btn-ghost"
              onClick={togglePause}
              disabled={saving}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={640}
          height={128}
          className="mb-8 h-32 w-full max-w-md rounded-3xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,228,212,0.35) 0%, rgba(240,223,184,0.35) 50%, rgba(232,196,176,0.35) 100%)",
          }}
        />

        {nudge && (
          <div
            className="mb-6 w-full max-w-md rounded-3xl p-4 text-left"
            style={{
              background: "var(--white)",
              boxShadow:
                "8px 8px 16px rgba(61, 43, 31, 0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
              border: "1px solid var(--terra-pale)",
            }}
          >
            <div className="mb-1 flex items-center justify-between">
              <span
                className="text-[10px] font-semibold"
                style={{
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                ✦ AI · demo prompt
              </span>
              <button
                type="button"
                onClick={() => setNudge(null)}
                className="text-xs"
                style={{ color: "var(--muted)" }}
                aria-label="Dismiss nudge"
              >
                ✕
              </button>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              {nudge}
            </p>
          </div>
        )}

        {error && (
          <p
            className="mb-4 text-xs"
            style={{ color: "var(--terra-deep)" }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          className="btn-ghost"
          onClick={stop}
          disabled={saving}
          style={{ color: "var(--ink-light)" }}
        >
          {recording || paused ? "I'm done →" : "Skip recording →"}
        </button>
      </div>
    </main>
  );
}

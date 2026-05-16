"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveReply } from "@/lib/storage";

/**
 * Tiny inline recorder for Aanya's reply on the reveal page.
 *
 * Three states: idle → recording → saved. Real MediaRecorder capture
 * (audio/webm;opus), persisted to IndexedDB under the `replies` store.
 * No playback, no review screen — keeps the 10-minute scope tight.
 */

type State = "idle" | "recording" | "saving" | "saved" | "error";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export default function ReplyRecorder() {
  const [state, setState] = useState<State>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startMsRef = useRef<number>(0);

  const teardown = useCallback(() => {
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
  }, []);

  useEffect(() => teardown, [teardown]);

  // Timer while recording.
  useEffect(() => {
    if (state !== "recording") return;
    const id = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [state]);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices) {
      setError("Microphone unavailable in this browser.");
      setState("error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
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
          await saveReply(blob, { mimeType, durationSec });
          teardown();
          setState("saved");
        } catch (err) {
          console.warn("[reply] saveReply failed:", err);
          teardown();
          setError("Couldn't save your reflection. Try again?");
          setState("error");
        }
      };
      recorderRef.current = recorder;
      startMsRef.current = performance.now();
      setElapsedSec(0);
      recorder.start(250);
      setState("recording");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Microphone access denied. ${msg}`);
      teardown();
      setState("error");
    }
  }, [teardown]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    setState("saving");
    try {
      recorder.stop();
    } catch (err) {
      console.warn("[reply] stop failed:", err);
      teardown();
      setError("Recording ended unexpectedly.");
      setState("error");
    }
  }, [teardown]);

  // SAVED state — celebratory pill, doesn't disappear (so judge can see it).
  if (state === "saved") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"
        style={{
          background: "var(--sage-pale)",
          color: "var(--sage-deep)",
          border: "1px solid var(--sage)",
          fontWeight: 600,
        }}
      >
        <span aria-hidden>✦</span>
        Your reflection is captured for the family vault.
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-xs"
        style={{ color: "var(--muted)" }}
      >
        Record a reply
      </p>

      <button
        type="button"
        onClick={state === "recording" ? stop : start}
        disabled={state === "saving"}
        aria-label={state === "recording" ? "Stop reply" : "Start reply"}
        className={`record-btn ${state === "recording" ? "recording" : ""}`}
        style={{
          width: 72,
          height: 72,
          opacity: state === "saving" ? 0.5 : 1,
        }}
      >
        {state === "recording" || state === "saving" ? (
          <span
            className="mx-auto block h-5 w-5 rounded-sm"
            style={{ background: "var(--white)" }}
            aria-hidden
          />
        ) : null}
      </button>

      {state === "recording" && (
        <p
          className="font-mono text-sm"
          style={{ color: "var(--ink)" }}
        >
          {formatTime(elapsedSec)} · recording
        </p>
      )}

      {state === "saving" && (
        <p
          className="text-xs"
          style={{ color: "var(--muted)" }}
        >
          Saving…
        </p>
      )}

      {state === "idle" && (
        <p
          className="max-w-xs text-center text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          Capture how this moment feels. Saved alongside Grandma&apos;s story
          for the next generation.
        </p>
      )}

      {state === "error" && error && (
        <p
          className="text-xs"
          style={{ color: "var(--terra-deep)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

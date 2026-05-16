"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import { getPromptById, DEFAULT_PROMPT_ID } from "@/lib/prompts";
import {
  getRecording,
  saveTitle,
  savePhoto,
  getPhoto,
  sealStory,
} from "@/lib/storage";

type DeliveryOption = "6th" | "18th" | "parent" | "custom";

const DELIVERY_DATES: Record<DeliveryOption, string> = {
  "6th": "2030-06-15",
  "18th": "2042-06-15",
  parent: "2055-06-15",
  custom: "",
};

function formatClock(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export default function ReviewPage() {
  const router = useRouter();
  const prompt = getPromptById(DEFAULT_PROMPT_ID);
  const staticFallbackTitle = "The morning you came into the world";

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioPos, setAudioPos] = useState(0);

  const [title, setTitle] = useState(staticFallbackTitle);
  const [titleSource, setTitleSource] = useState<"loading" | "ai" | "static">(
    "loading",
  );

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<DeliveryOption>("18th");
  const [customDate, setCustomDate] = useState<string>("2042-06-15");
  const [sealing, setSealing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load recording + photo + kick off title generation.
  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;
    let createdPhotoUrl: string | null = null;

    (async () => {
      try {
        const rec = await getRecording();
        if (!cancelled && rec?.blob) {
          createdUrl = URL.createObjectURL(rec.blob);
          setAudioUrl(createdUrl);
          setAudioDuration(rec.durationSec ?? 0);
        }
      } catch (err) {
        console.warn("[review] getRecording failed:", err);
      }

      try {
        const photo = await getPhoto();
        if (!cancelled && photo?.blob) {
          createdPhotoUrl = URL.createObjectURL(photo.blob);
          setPhotoUrl(createdPhotoUrl);
        }
      } catch {
        /* photo is optional */
      }

      // Title generation — non-blocking.
      try {
        const res = await fetch("/api/generate-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promptId: prompt?.id ?? DEFAULT_PROMPT_ID,
            promptText: prompt?.text ?? "",
          }),
        });
        if (cancelled) return;
        const data = (await res.json()) as { title?: string; source?: string };
        if (data.title) {
          setTitle(data.title);
          setTitleSource(data.source === "static" ? "static" : "ai");
        } else {
          setTitleSource("static");
        }
      } catch (err) {
        console.warn("[review] title fetch failed:", err);
        setTitleSource("static");
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      if (createdPhotoUrl) URL.revokeObjectURL(createdPhotoUrl);
    };
  }, [prompt?.id, prompt?.text]);

  const onLoadedMetadata = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (Number.isFinite(a.duration) && a.duration > 0) {
      setAudioDuration(a.duration);
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setAudioPos(a.currentTime);
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    setAudioPos(0);
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing]);

  const onPhotoPick = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        await savePhoto(file);
        const url = URL.createObjectURL(file);
        setPhotoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (err) {
        console.warn("[review] savePhoto failed:", err);
      }
    },
    [],
  );

  const onSeal = useCallback(async () => {
    if (sealing) return;
    setSealing(true);
    const sealedDate =
      delivery === "custom" ? customDate : DELIVERY_DATES[delivery];
    try {
      await saveTitle(title.trim() || staticFallbackTitle);
      await sealStory(sealedDate || DELIVERY_DATES["18th"]);
    } catch (err) {
      console.warn("[review] seal failed:", err);
    } finally {
      router.push("/reveal");
    }
  }, [customDate, delivery, router, sealing, title]);

  const scrubberPct = useMemo(() => {
    if (audioDuration <= 0) return 0;
    return Math.min(100, (audioPos / audioDuration) * 100);
  }, [audioPos, audioDuration]);

  const titleBadge = (() => {
    if (titleSource === "loading") return { text: "✦ Thinking…", color: "var(--muted)" };
    if (titleSource === "ai") return { text: "✦ Suggested by AI", color: "var(--gold)" };
    return { text: "Suggested", color: "var(--muted)" };
  })();

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="sage" size={200} style={{ top: -50, right: -60 }} />
      <Blob variant="gold" size={120} style={{ bottom: 200, left: -40 }} />
      <Blob variant="terra" size={160} style={{ bottom: -40, right: -30 }} />

      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <p className="eyebrow mb-3">Review &amp; Seal</p>
        <h1
          className="font-display mb-2 text-4xl md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          A moment, sealed.
        </h1>
        <p
          className="mb-10 text-base"
          style={{ color: "var(--ink-light)" }}
        >
          Listen back, name it, pick the day Aanya will hear it. We&apos;ll keep
          it safe until then.
        </p>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            className="hidden"
          />
        )}

        <ClayCard className="mb-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Playback</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                disabled={!audioUrl}
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: audioUrl ? "var(--terra)" : "var(--terra-pale)",
                  color: "var(--white)",
                  fontSize: 20,
                  cursor: audioUrl ? "pointer" : "not-allowed",
                  opacity: audioUrl ? 1 : 0.6,
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <div
                className="h-2 flex-1 rounded-full"
                style={{ background: "var(--sage-pale)" }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-100 ease-linear"
                  style={{
                    background: "var(--sage)",
                    width: `${scrubberPct}%`,
                  }}
                />
              </div>
              <span
                className="font-mono text-xs"
                style={{ color: "var(--muted)" }}
              >
                {formatClock(audioPos)} / {formatClock(audioDuration)}
              </span>
            </div>
            {!audioUrl && (
              <p
                className="text-xs"
                style={{ color: "var(--muted)" }}
              >
                No recording found — try recording on the previous screen, or
                use this preview to pick a delivery date.
              </p>
            )}
          </div>
        </ClayCard>

        <ClayCard className="mb-6">
          <label className="flex flex-col gap-2">
            <span className="eyebrow flex items-center gap-2">
              <span>Suggested title</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: titleBadge.color }}
              >
                {titleBadge.text}
              </span>
            </span>
            <input
              className="clay-input"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              In response to: &ldquo;{prompt?.text}&rdquo;
            </span>
          </label>
        </ClayCard>

        <ClayCard className="mb-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Add a photo (optional)</p>
            <label
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed"
              style={{
                borderColor: "var(--terra-pale)",
                color: "var(--muted)",
                position: "relative",
              }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="Selected photo"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <span style={{ fontSize: 22 }}>📷</span>
                  <span className="text-xs">
                    Tap to pick a photo of yourself
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoPick}
              />
            </label>
            <span
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              You can skip this — Aanya will still hear your voice.
            </span>
          </div>
        </ClayCard>

        <ClayCard className="mb-8">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Deliver on</p>
            <div className="flex flex-col gap-2">
              <RadioRow
                label="On her 6th birthday"
                selected={delivery === "6th"}
                onClick={() => setDelivery("6th")}
              />
              <RadioRow
                label="On her 18th birthday — June 15, 2042"
                selected={delivery === "18th"}
                onClick={() => setDelivery("18th")}
              />
              <RadioRow
                label="When she becomes a parent"
                selected={delivery === "parent"}
                onClick={() => setDelivery("parent")}
              />
              <RadioRow
                label="A custom date"
                selected={delivery === "custom"}
                onClick={() => setDelivery("custom")}
              />
              {delivery === "custom" && (
                <input
                  type="date"
                  className="clay-input mt-1"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              )}
            </div>
          </div>
        </ClayCard>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onSeal}
            disabled={sealing}
            className="btn-terra"
            style={{ opacity: sealing ? 0.7 : 1 }}
          >
            {sealing ? "Sealing…" : "Seal this story"}
          </button>
        </div>
      </div>
    </main>
  );
}

function RadioRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
      style={{
        background: selected ? "var(--sage-pale)" : "transparent",
        cursor: "pointer",
        border: "none",
      }}
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${selected ? "var(--sage-deep)" : "var(--muted)"}`,
        }}
      >
        {selected && (
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "var(--sage-deep)" }}
          />
        )}
      </span>
      <span
        className="text-sm"
        style={{
          color: selected ? "var(--ink)" : "var(--ink-light)",
          fontWeight: selected ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

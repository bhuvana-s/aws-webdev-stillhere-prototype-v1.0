"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlobShape from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import PressGallery from "@/components/PressGallery";
import WaxSeal from "@/components/WaxSeal";
import WaxSealReveal from "@/components/WaxSealReveal";
import {
  getBuyerInfo,
  getMeta,
  getPhoto,
  getRecording,
  setRevealed,
} from "@/lib/storage";

type Phase = "sealed" | "breaking" | "revealed";

function formatClock(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "June 15, 2042";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function RevealPage() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("The morning you came into the world");
  const [sealedDateLabel, setSealedDateLabel] = useState("June 15, 2042");
  const [childName, setChildName] = useState("Aanya");
  const [parentName, setParentName] = useState("Grandma");

  const [audioDuration, setAudioDuration] = useState(0);
  const [audioPos, setAudioPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [toast, setToast] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load story data + decide initial phase from status.
  useEffect(() => {
    let cancelled = false;
    let createdAudio: string | null = null;
    let createdPhoto: string | null = null;

    (async () => {
      try {
        const rec = await getRecording();
        if (!cancelled && rec?.blob) {
          createdAudio = URL.createObjectURL(rec.blob);
          setAudioUrl(createdAudio);
          setAudioDuration(rec.durationSec ?? 0);
        }
      } catch (err) {
        console.warn("[reveal] getRecording failed:", err);
      }

      try {
        const photo = await getPhoto();
        if (!cancelled && photo?.blob) {
          createdPhoto = URL.createObjectURL(photo.blob);
          setPhotoUrl(createdPhoto);
        }
      } catch {
        /* photo is optional */
      }

      try {
        const meta = await getMeta();
        if (!cancelled && meta) {
          if (meta.title) setTitle(meta.title);
          if (meta.sealedDate) setSealedDateLabel(formatDate(meta.sealedDate));
          // Cold-load on an already-revealed story skips the break animation.
          if (meta.status === "revealed") setPhase("revealed");
        }
      } catch {
        /* meta optional */
      }

      try {
        const buyer = await getBuyerInfo();
        if (!cancelled && buyer) {
          if (buyer.childName) setChildName(buyer.childName);
          if (buyer.parentName) setParentName(buyer.parentName);
        }
      } catch {
        /* optional */
      }
    })();

    return () => {
      cancelled = true;
      if (createdAudio) URL.revokeObjectURL(createdAudio);
      if (createdPhoto) URL.revokeObjectURL(createdPhoto);
    };
  }, []);

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

  const scrubberPct = useMemo(() => {
    if (audioDuration <= 0) return 0;
    return Math.min(100, (audioPos / audioDuration) * 100);
  }, [audioPos, audioDuration]);

  const onOpenMessage = useCallback(async () => {
    if (phase !== "sealed") return;
    setPhase("breaking");
    setRevealed().catch(() => {
      /* status flip is best-effort */
    });
  }, [phase]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const onSaveForever = useCallback(() => {
    showToast("Saved to your library.");
  }, [showToast]);

  const revealedVisible = phase === "revealed";

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <BlobShape variant="gold" size={220} style={{ top: -40, left: -40 }} />
      <BlobShape variant="terra" size={180} style={{ top: 240, right: -40 }} />
      <BlobShape variant="sage" size={160} style={{ bottom: 80, left: -40 }} />
      <BlobShape variant="gold" size={120} style={{ bottom: 160, right: 40 }} />

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

      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center md:py-16">
        {/* --- Sealed phase ------------------------------------------- */}
        {phase === "sealed" && (
          <SealedView
            parentName={parentName}
            childName={childName}
            sealedDateLabel={sealedDateLabel}
            onOpen={onOpenMessage}
          />
        )}

        {/* --- Breaking phase ----------------------------------------- */}
        {phase === "breaking" && (
          <div className="mb-8">
            <WaxSealReveal
              size={220}
              onBreakComplete={() => setPhase("revealed")}
            />
          </div>
        )}

        {/* --- Revealed content (headlines + player) ------------------- */}
        {phase !== "sealed" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                revealedVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <p className="eyebrow mb-3">From {parentName}</p>
              <h1
                className="font-display mb-2 text-4xl leading-tight md:text-5xl"
                style={{ color: "var(--ink)" }}
              >
                For {childName}.
              </h1>
              <p
                className="mb-10 text-base"
                style={{ color: "var(--ink-light)" }}
              >
                {sealedDateLabel}.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={
                revealedVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 16 }
              }
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.15,
              }}
              className="w-full"
            >
              <ClayCard className="mb-8 w-full">
                <div className="flex flex-col items-center gap-5">
                  <div
                    className="relative h-32 w-32 overflow-hidden rounded-full"
                    style={{
                      boxShadow:
                        "6px 6px 18px rgba(61, 43, 31, 0.18), inset 0 1px 0 rgba(255,255,255,0.5)",
                      border: "3px solid var(--bg-light)",
                    }}
                  >
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt={`${parentName}'s photo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/assets/player-avatar-default.png"
                        alt={`${parentName}'s avatar`}
                        fill
                        sizes="128px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>

                  <div>
                    <h2
                      className="font-display text-2xl"
                      style={{ color: "var(--sage-deep)" }}
                    >
                      {title}
                    </h2>
                    <p
                      className="text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      A story from {parentName} · Treasured Album
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={togglePlay}
                    disabled={!audioUrl}
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      background: audioUrl ? "var(--terra)" : "var(--terra-pale)",
                      color: "var(--white)",
                      fontSize: 28,
                      cursor: audioUrl ? "pointer" : "not-allowed",
                      opacity: audioUrl ? 1 : 0.5,
                      boxShadow: "6px 6px 16px rgba(198, 123, 92, 0.35)",
                      border: "none",
                    }}
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? "❚❚" : "▶"}
                  </button>

                  <div className="w-full">
                    <div
                      className="h-1.5 w-full rounded-full"
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
                    <div
                      className="mt-2 flex justify-between font-mono text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      <span>{formatClock(audioPos)}</span>
                      <span>{formatClock(audioDuration)}</span>
                    </div>
                  </div>

                  {!audioUrl && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      No recording stored yet — record one on the previous
                      screens first.
                    </p>
                  )}
                </div>
              </ClayCard>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={onSaveForever}
                >
                  ♥ Save forever
                </button>
              </div>

              <div className="mt-16 w-full">
                <PressGallery
                  heading="Why this matters"
                  subheading="What you just felt — we measured the demand for it."
                />
              </div>

              <Link
                href="/"
                className="mt-10 block text-xs"
                style={{ color: "var(--muted)" }}
              >
                ← Back to start
              </Link>
            </motion.div>
          </>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-sm rounded-full px-5 py-3 text-sm"
            style={{
              background: "var(--ink)",
              color: "var(--bg-light)",
              boxShadow: "0 12px 32px rgba(61, 43, 31, 0.25)",
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ============================================================
   Sealed phase view
   ============================================================ */

function SealedView({
  parentName,
  childName,
  sealedDateLabel,
  onOpen,
}: {
  parentName: string;
  childName: string;
  sealedDateLabel: string;
  onOpen: () => void;
}) {
  return (
    <motion.div
      key="sealed-view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col items-center"
    >
      <div className="mb-8">
        {/* Gentle float on the intact seal */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <WaxSeal size={220} />
        </motion.div>
      </div>

      <p className="eyebrow mb-3">A message has been kept for you</p>
      <h1
        className="font-display mb-3 text-4xl leading-tight md:text-5xl"
        style={{ color: "var(--ink)" }}
      >
        For {childName}.
      </h1>
      <p
        className="mb-2 text-base"
        style={{ color: "var(--ink-light)" }}
      >
        From {parentName} · Sealed until {sealedDateLabel}.
      </p>
      <p
        className="mb-10 max-w-md text-sm"
        style={{ color: "var(--muted)" }}
      >
        When the day arrives, this will open by itself.
      </p>

      <button type="button" onClick={onOpen} className="btn-terra">
        Open the message
      </button>

      <p
        className="mt-4 text-[11px]"
        style={{ color: "var(--muted)", letterSpacing: "0.1em" }}
      >
        DEMO · skip the wait
      </p>
    </motion.div>
  );
}

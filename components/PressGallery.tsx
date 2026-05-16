"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Tile {
  label: string;
  caption: string;
  src: string;
  alt: string;
}

const TILES: Tile[] = [
  {
    label: "The demand",
    caption: "Real posts from real parents",
    src: "/assets/DemandonX.png",
    alt: "Viral tweets about giving letters to a future child",
  },
  {
    label: "Validation",
    caption: "243 signups · zero ads",
    src: "/assets/Validation.png",
    alt: "Validation dashboard showing 243 signups from organic traffic",
  },
  {
    label: "Social — Keisha",
    caption: "Workshop → Will",
    src: "/assets/social-media1.png",
    alt: "Keisha M's StillHere thread on Twitter",
  },
  {
    label: "Social — Johnsons",
    caption: "Three generations, one legacy",
    src: "/assets/social-media2.png",
    alt: "Facebook post from the Johnson family — three generations leaving a legacy gift to StillHere SF 415",
  },
];

interface PressGalleryProps {
  /** Title above the row of tiles. Optional. */
  heading?: string;
  /** Caption under the heading. Optional. */
  subheading?: string;
}

export default function PressGallery({
  heading = "Why this matters",
  subheading = "The demand showed up before we did. See the proof.",
}: PressGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Close on Escape.
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx]);

  return (
    <section className="w-full">
      {heading && (
        <div className="mb-5 text-center">
          <p className="eyebrow mb-2">{heading}</p>
          {subheading && (
            <p
              className="text-sm"
              style={{ color: "var(--ink-light)" }}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {TILES.map((tile, i) => (
          <button
            key={tile.src}
            type="button"
            onClick={() => setLightboxIdx(i)}
            className="group flex flex-col gap-2 text-left"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
              style={{
                background: "var(--bg-light)",
                boxShadow:
                  "4px 4px 12px rgba(61, 43, 31, 0.10), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                style={{ objectFit: "cover", objectPosition: "top left" }}
                className="transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t py-2 text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(61, 43, 31, 0.7), transparent)",
                  color: "var(--bg-light)",
                }}
              >
                Tap to view
              </div>
            </div>
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--ink)" }}
              >
                {tile.label}
              </p>
              <p
                className="text-[11px] leading-tight"
                style={{ color: "var(--muted)" }}
              >
                {tile.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
            style={{
              background: "rgba(61, 43, 31, 0.85)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setLightboxIdx(null)}
            role="dialog"
            aria-modal="true"
            aria-label={TILES[lightboxIdx].label}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-lg"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "var(--bg-light)",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "var(--gold-pale)" }}
                  >
                    {TILES[lightboxIdx].label}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--bg-light)" }}
                  >
                    {TILES[lightboxIdx].caption}
                  </p>
                </div>
                <div
                  className="hidden gap-3 md:flex"
                  style={{ color: "var(--bg-light)" }}
                >
                  {lightboxIdx > 0 && (
                    <button
                      type="button"
                      onClick={() => setLightboxIdx(lightboxIdx - 1)}
                      className="text-sm underline underline-offset-4"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      ← Prev
                    </button>
                  )}
                  {lightboxIdx < TILES.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setLightboxIdx(lightboxIdx + 1)}
                      className="text-sm underline underline-offset-4"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  background: "var(--bg-light)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src={TILES[lightboxIdx].src}
                  alt={TILES[lightboxIdx].alt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 95vw, 1024px"
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

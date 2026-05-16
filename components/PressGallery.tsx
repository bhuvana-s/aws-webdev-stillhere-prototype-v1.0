"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import Endorsement from "./Endorsement";
import Founders from "./Founders";
import Partners from "./Partners";
import Pricing from "./Pricing";

/**
 * Value-prop gallery. Each tile is either an image (opens in a lightbox)
 * or an HTML card (opens with React content in the same shell). Future
 * tiles for Partners and Founders slot in with the same shape.
 *
 * Tiles auto-wrap: 2-up on mobile, 3-up on tablet, 5-up on desktop.
 */

type Tone = "terra" | "sage" | "gold" | "pink";

interface BaseTile {
  label: string;   // small heading under the thumbnail
  caption: string; // small caption under the label
}

interface ImageTile extends BaseTile {
  type: "image";
  src: string;
  alt: string;
}

interface HtmlTile extends BaseTile {
  type: "html";
  stat: string;       // big number on the thumbnail (e.g. "$99")
  statLabel: string;  // text under the stat (e.g. "Legacy Gift")
  tone: Tone;
  content: ReactNode; // rendered inside the modal body
}

type Tile = ImageTile | HtmlTile;

const TONE_STYLES: Record<Tone, { bg: string; fg: string; statBg: string }> = {
  terra: {
    bg: "var(--terra)",
    fg: "var(--white)",
    statBg: "rgba(245, 240, 232, 0.15)",
  },
  sage: {
    bg: "var(--sage)",
    fg: "var(--white)",
    statBg: "rgba(245, 240, 232, 0.15)",
  },
  gold: {
    bg: "var(--gold)",
    fg: "var(--ink)",
    statBg: "rgba(255, 255, 255, 0.3)",
  },
  pink: {
    bg: "var(--pink-muted)",
    fg: "var(--white)",
    statBg: "rgba(245, 240, 232, 0.18)",
  },
};

const TILES: Tile[] = [
  {
    type: "image",
    label: "The demand",
    caption: "Real posts from real parents",
    src: "/assets/DemandonX.png",
    alt: "Viral tweets about giving letters to a future child",
  },
  {
    type: "image",
    label: "Validation",
    caption: "243 signups · zero ads",
    src: "/assets/Validation.png",
    alt: "Validation dashboard showing 243 signups from organic traffic",
  },
  {
    type: "html",
    label: "Founders",
    caption: "Team Siddhi · 46 yrs in tech",
    stat: "46",
    statLabel: "Years in tech",
    tone: "gold",
    content: <Founders />,
  },
  {
    type: "html",
    label: "Pricing",
    caption: "$99 today · B2C + B2B tomorrow",
    stat: "$99",
    statLabel: "Legacy Gift",
    tone: "terra",
    content: <Pricing />,
  },
  {
    type: "html",
    label: "Partners",
    caption: "FNP · NativeSpecial · Photographers",
    stat: "3",
    statLabel: "Gift Partners",
    tone: "sage",
    content: <Partners />,
  },
  {
    type: "html",
    label: "Endorsement",
    caption: "RightDots · Vidhya Bhojan",
    stat: "4+",
    statLabel: "Elder Networks",
    tone: "pink",
    content: <Endorsement />,
  },
];

interface PressGalleryProps {
  heading?: string;
  subheading?: string;
}

export default function PressGallery({
  heading = "Why this matters",
  subheading = "The demand showed up before we did. See the proof.",
}: PressGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx]);

  const activeTile = activeIdx === null ? null : TILES[activeIdx];

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

      {/* 2-up mobile / 3-up tablet / 5-up desktop via flex-wrap with
          percentage widths. Auto-balances regardless of tile count. */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {TILES.map((tile, i) => (
          <button
            key={`${tile.type}-${tile.label}`}
            type="button"
            onClick={() => setActiveIdx(i)}
            className="group flex flex-col gap-2 text-left"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              width: "calc(50% - 0.375rem)",
              maxWidth: "240px",
            }}
            data-tile-width
          >
            <Thumbnail tile={tile} />
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

      <style jsx>{`
        @media (min-width: 768px) {
          [data-tile-width] {
            width: calc(33.333% - 0.667rem) !important;
          }
        }
        @media (min-width: 1024px) {
          [data-tile-width] {
            width: calc(20% - 0.8rem) !important;
          }
        }
      `}</style>

      <AnimatePresence>
        {activeTile !== null && activeIdx !== null && (
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
            onClick={() => setActiveIdx(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeTile.label}
          >
            <button
              type="button"
              onClick={() => setActiveIdx(null)}
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
                    {activeTile.label}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--bg-light)" }}
                  >
                    {activeTile.caption}
                  </p>
                </div>
                <div
                  className="hidden gap-3 md:flex"
                  style={{ color: "var(--bg-light)" }}
                >
                  {activeIdx > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveIdx(activeIdx - 1)}
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
                  {activeIdx < TILES.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveIdx(activeIdx + 1)}
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

              {/* Modal body — image or HTML */}
              <div
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  background: "var(--bg-light)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                  maxHeight: "85vh",
                  overflowY: activeTile.type === "html" ? "auto" : "hidden",
                }}
              >
                {activeTile.type === "image" ? (
                  <Image
                    src={activeTile.src}
                    alt={activeTile.alt}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 1024px) 95vw, 1024px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                    priority
                  />
                ) : (
                  <div className="px-5 py-6 md:px-8 md:py-8">
                    {activeTile.content}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Thumbnail({ tile }: { tile: Tile }) {
  const baseShadow =
    "4px 4px 12px rgba(61, 43, 31, 0.10), inset 0 1px 0 rgba(255,255,255,0.5)";

  if (tile.type === "image") {
    return (
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
        style={{ background: "var(--bg-light)", boxShadow: baseShadow }}
      >
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
          style={{ objectFit: "cover", objectPosition: "top left" }}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center py-2 text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(61, 43, 31, 0.7), transparent)",
            color: "var(--bg-light)",
          }}
        >
          Tap to view
        </div>
      </div>
    );
  }

  const tone = TONE_STYLES[tile.tone];
  return (
    <div
      className="relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-2xl px-3 text-center transition-transform duration-300 group-hover:scale-[1.03]"
      style={{
        background: tone.bg,
        color: tone.fg,
        boxShadow: baseShadow,
      }}
    >
      <span
        className="font-display text-3xl font-bold leading-none md:text-4xl"
        style={{ color: tone.fg }}
      >
        {tile.stat}
      </span>
      <span
        className="mt-1 text-[10px] font-semibold uppercase"
        style={{ letterSpacing: "0.16em", color: tone.fg, opacity: 0.9 }}
      >
        {tile.statLabel}
      </span>
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 py-2 text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: "rgba(0, 0, 0, 0.18)",
          color: tone.fg,
        }}
      >
        Tap to view
      </span>
    </div>
  );
}

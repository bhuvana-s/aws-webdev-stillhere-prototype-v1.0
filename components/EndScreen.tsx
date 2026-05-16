"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Blob from "./Blob";
import Logo from "./Logo";

/**
 * Curtain-call end screen. Full-viewport cream overlay with the
 * StillHere logo, product tagline, and the team line. Triggered from
 * the "StillHere" button under the captured-reflection pill on
 * /reveal. Dismissed via the ✕ button or backdrop tap.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

interface EndScreenProps {
  show: boolean;
  onClose: () => void;
}

export default function EndScreen({ show, onClose }: EndScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="end-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
          style={{ background: "var(--bg)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="StillHere — closing message"
        >
          {/* decorative blobs (same vocabulary as page bodies) */}
          <Blob variant="gold" size={260} style={{ top: -60, left: -60 }} />
          <Blob variant="terra" size={200} style={{ bottom: -60, right: -40 }} />
          <Blob variant="sage" size={180} style={{ top: 240, right: 60 }} />

          {/* close X */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-lg"
            style={{
              background: "rgba(245, 240, 232, 0.9)",
              color: "var(--ink-light)",
              border: "1px solid var(--terra-pale)",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            ✕
          </button>

          {/* content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="relative z-10 flex max-w-2xl flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* golden halo behind the logo */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.45 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="pointer-events-none absolute top-0 h-64 w-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--gold-pale) 0%, transparent 65%)",
                filter: "blur(12px)",
                transform: "translateY(-20%)",
              }}
              aria-hidden
            />

            <div className="relative z-10 mb-10">
              <Logo width={260} asLink={false} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
              className="font-display text-2xl leading-relaxed md:text-3xl"
              style={{ color: "var(--ink)" }}
            >
              <span style={{ color: "var(--terra)" }}>StillHere</span> —
              delivers your family love and wisdom,{" "}
              <span style={{ color: "var(--sage-deep)" }}>on time</span>,
              as text, voice and video.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="mt-10 text-base md:text-lg"
              style={{ color: "var(--ink-light)" }}
            >
              Team <strong style={{ color: "var(--terra-deep)" }}>Siddhi</strong>
              <span style={{ color: "var(--terra-deep)" }}>&nbsp;!!</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-12 flex items-center gap-4"
            >
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
                style={{ color: "var(--muted)" }}
              >
                ← Back to reveal
              </button>
              <span style={{ color: "var(--muted)" }} aria-hidden>
                ·
              </span>
              <Link
                href="/"
                className="btn-ghost"
                style={{ color: "var(--muted)" }}
              >
                ← Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

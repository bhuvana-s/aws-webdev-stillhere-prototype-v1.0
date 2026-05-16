"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen interstitial shown after "Seal this story" is tapped.
 * Plays a ~2s lock-closing animation with the "Sealed until ..." line.
 * Caller controls timing via the `show` prop and triggers navigation on
 * its own schedule.
 */

interface SealLockAnimationProps {
  show: boolean;
  sealedDateLabel: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function SealLockAnimation({
  show,
  sealedDateLabel,
}: SealLockAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="seal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: "var(--bg)" }}
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative"
            style={{ width: 220, height: 220 }}
          >
            {/* Golden glow halo */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.15, 1], opacity: [0, 0.55, 0.35] }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--gold-pale) 0%, transparent 65%)",
                filter: "blur(8px)",
              }}
              aria-hidden
            />

            {/* The lock */}
            <motion.svg
              viewBox="0 0 120 140"
              className="relative h-full w-full"
              style={{ filter: "drop-shadow(8px 12px 24px rgba(166, 94, 66, 0.35))" }}
              aria-hidden
            >
              {/* Shackle — closes downward */}
              <motion.path
                d="M 35 70 L 35 45 A 25 25 0 0 1 85 45 L 85 70"
                fill="none"
                stroke="var(--terra-deep)"
                strokeWidth="11"
                strokeLinecap="round"
                initial={{ y: -22 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              />
              {/* Body */}
              <motion.rect
                x="20"
                y="65"
                width="80"
                height="60"
                rx="14"
                fill="var(--terra)"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              {/* Keyhole */}
              <motion.circle
                cx="60"
                cy="92"
                r="6"
                fill="var(--ink)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
              <motion.rect
                x="57.5"
                y="92"
                width="5"
                height="14"
                rx="2"
                fill="var(--ink)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
            </motion.svg>

            {/* Sparkle ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              style={{
                border: "1px solid var(--gold)",
                boxShadow: "0 0 24px 4px rgba(212, 168, 83, 0.45)",
              }}
              aria-hidden
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
            className="mt-10 max-w-md text-center"
          >
            <p className="eyebrow mb-2">Sealed</p>
            <h2
              className="font-display mb-3 text-3xl md:text-4xl"
              style={{ color: "var(--ink)" }}
            >
              Sealed until {sealedDateLabel}.
            </h2>
            <p
              className="mb-4 text-sm"
              style={{ color: "var(--ink-light)" }}
            >
              Even we cannot open this before then.
            </p>
            <div
              className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold"
              style={{
                background: "var(--bg-light)",
                color: "var(--terra-deep)",
                border: "1px solid var(--terra-pale)",
                letterSpacing: "0.08em",
              }}
            >
              <span aria-hidden>🔐</span>
              <span>AES-256 · AWS KMS · Encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

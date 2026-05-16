"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

/**
 * Reveal-page wax seal break animation.
 *
 * Renders the same seal asset as <WaxSeal /> (single `imageSrc` swap
 * point per Spec Section 5.1), but choreographed for the recipient
 * moment: the seal hovers for ~700ms, a golden burst flares, then
 * two clip-pathed halves rotate and fly outward.
 *
 * The container keeps its size after the seal is gone, so the page
 * layout doesn't shift.
 */

interface WaxSealRevealProps {
  imageSrc?: string;
  size?: number;
  onBreakComplete?: () => void;
}

const TOTAL_MS = 1500;

export default function WaxSealReveal({
  imageSrc = "/assets/wax-seal-default.png",
  size = 220,
  onBreakComplete,
}: WaxSealRevealProps) {
  useEffect(() => {
    if (!onBreakComplete) return;
    const id = window.setTimeout(onBreakComplete, TOTAL_MS);
    return () => window.clearTimeout(id);
  }, [onBreakComplete]);

  const halfWidth = size / 2;

  return (
    <div
      className="relative"
      style={{ width: size, height: size, marginInline: "auto" }}
    >
      {/* Golden burst behind */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.4, 1.8], opacity: [0, 0.55, 0] }}
        transition={{
          duration: 1.2,
          times: [0, 0.55, 1],
          delay: 0.55,
          ease: "easeOut",
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--gold) 0%, var(--gold-pale) 35%, transparent 70%)",
          filter: "blur(10px)",
        }}
        aria-hidden
      />

      {/* Left half */}
      <motion.div
        initial={{ x: 0, rotate: 0, opacity: 1 }}
        animate={{
          x: [0, -4, -halfWidth - 30],
          rotate: [0, -2, -14],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: TOTAL_MS / 1000,
          times: [0, 0.45, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0"
        style={{
          clipPath: "inset(0 50% 0 0)",
          WebkitClipPath: "inset(0 50% 0 0)",
          filter: "drop-shadow(6px 10px 18px rgba(166, 94, 66, 0.35))",
          transformOrigin: "right center",
        }}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes={`${size}px`}
          priority
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Right half */}
      <motion.div
        initial={{ x: 0, rotate: 0, opacity: 1 }}
        animate={{
          x: [0, 4, halfWidth + 30],
          rotate: [0, 2, 14],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: TOTAL_MS / 1000,
          times: [0, 0.45, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
        className="absolute inset-0"
        style={{
          clipPath: "inset(0 0 0 50%)",
          WebkitClipPath: "inset(0 0 0 50%)",
          filter: "drop-shadow(-6px 10px 18px rgba(166, 94, 66, 0.35))",
          transformOrigin: "left center",
        }}
      >
        <Image
          src={imageSrc}
          alt="Wax seal"
          fill
          sizes={`${size}px`}
          priority
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Sparkle dots */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, delay: 0.6 }}
        aria-hidden
      >
        {[
          { top: "12%", left: "18%" },
          { top: "22%", left: "78%" },
          { top: "55%", left: "8%" },
          { top: "68%", left: "82%" },
          { top: "84%", left: "30%" },
          { top: "40%", left: "92%" },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ ...p, background: "var(--gold)" }}
            animate={{ scale: [0, 1.3, 0] }}
            transition={{ duration: 0.9, delay: 0.6 + i * 0.05 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

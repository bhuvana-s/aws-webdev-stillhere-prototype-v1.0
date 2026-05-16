"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Fake Stripe Checkout modal. Card details are prefilled and the only
 * action is a single "Pay" tap — no validation, no real network call.
 * On Pay: ~1s spinner → green checkmark → onSuccess.
 */

interface StripeModalProps {
  open: boolean;
  amountUsd: number;
  onSuccess: () => void;
  onCancel: () => void;
}

type Phase = "idle" | "processing" | "done";

export default function StripeModal({
  open,
  amountUsd,
  onSuccess,
  onCancel,
}: StripeModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");

  // Reset phase whenever the modal is opened freshly.
  useEffect(() => {
    if (open) setPhase("idle");
  }, [open]);

  const onPay = () => {
    if (phase !== "idle") return;
    setPhase("processing");
    window.setTimeout(() => {
      setPhase("done");
      window.setTimeout(() => onSuccess(), 700);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(61, 43, 31, 0.45)", backdropFilter: "blur(2px)" }}
          onClick={() => phase === "idle" && onCancel()}
          role="dialog"
          aria-modal="true"
          aria-label="Payment"
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-3xl p-6"
            style={{
              background: "var(--bg-light)",
              boxShadow:
                "0 24px 60px rgba(61, 43, 31, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="font-display text-lg font-bold tracking-tight"
                  style={{ color: "var(--ink)" }}
                >
                  stripe
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  · test mode
                </span>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={phase !== "idle"}
                aria-label="Close"
                className="text-sm"
                style={{
                  color: "var(--muted)",
                  cursor: phase === "idle" ? "pointer" : "not-allowed",
                  background: "transparent",
                  border: "none",
                }}
              >
                ✕
              </button>
            </div>

            {/* Order */}
            <div className="mb-5 flex items-baseline justify-between">
              <div>
                <p
                  className="eyebrow"
                  style={{ color: "var(--muted)", letterSpacing: "0.18em" }}
                >
                  StillHere Legacy Gift
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--ink-light)" }}
                >
                  One sealed recording, delivered on the day you choose.
                </p>
              </div>
              <div
                className="font-display text-3xl font-bold"
                style={{ color: "var(--ink)" }}
              >
                ${amountUsd}
              </div>
            </div>

            {/* Card visual */}
            <div
              className="mb-5 flex h-44 flex-col justify-between rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--terra) 0%, var(--pink-muted) 60%, var(--terra-deep) 100%)",
                color: "var(--white)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.25), 8px 8px 24px rgba(166, 94, 66, 0.25)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-12 items-center justify-center rounded-md text-[10px] font-bold"
                  style={{ background: "var(--gold)", color: "var(--ink)" }}
                >
                  CHIP
                </div>
                <span
                  className="text-[10px] uppercase tracking-widest opacity-80"
                >
                  Visa · test
                </span>
              </div>
              <div className="font-mono text-lg tracking-widest">
                4242 4242 4242 4242
              </div>
              <div className="flex items-end justify-between text-[10px] uppercase tracking-widest opacity-90">
                <div>
                  <p className="opacity-60">Cardholder</p>
                  <p className="font-mono text-xs normal-case">Bhuvana S.</p>
                </div>
                <div>
                  <p className="opacity-60">Exp</p>
                  <p className="font-mono text-xs">12/30</p>
                </div>
                <div>
                  <p className="opacity-60">CVC</p>
                  <p className="font-mono text-xs">123</p>
                </div>
              </div>
            </div>

            <p
              className="mb-4 text-center text-xs"
              style={{ color: "var(--muted)" }}
            >
              Test card prefilled. No real charge — this is a demo prototype.
            </p>

            {/* Pay button + state */}
            <button
              type="button"
              onClick={onPay}
              disabled={phase !== "idle"}
              className="btn-terra"
              style={{
                width: "100%",
                minHeight: 52,
                opacity: phase === "idle" ? 1 : 0.85,
              }}
            >
              {phase === "idle" && <>Pay ${amountUsd}</>}
              {phase === "processing" && <Spinner />}
              {phase === "done" && (
                <span className="flex items-center gap-2">
                  <Check /> Payment confirmed
                </span>
              )}
            </button>

            <p
              className="mt-4 text-center text-[10px]"
              style={{ color: "var(--muted)" }}
            >
              Powered by Stripe · Secured by 256-bit TLS · Test mode
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full"
      style={{
        border: "2.5px solid rgba(255,255,255,0.35)",
        borderTopColor: "var(--white)",
      }}
      aria-label="Processing"
    />
  );
}

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

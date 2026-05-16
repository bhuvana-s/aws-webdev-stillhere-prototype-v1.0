import Image from "next/image";
import Link from "next/link";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import WaxSeal from "@/components/WaxSeal";

export default function RevealPage() {
  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="gold" size={220} style={{ top: -40, left: -40 }} />
      <Blob variant="terra" size={180} style={{ top: 240, right: -40 }} />
      <Blob variant="sage" size={160} style={{ bottom: 80, left: -40 }} />
      <Blob variant="gold" size={120} style={{ bottom: 160, right: 40 }} />

      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center md:py-16">
        <div className="mb-8">
          <WaxSeal size={220} />
        </div>

        <p className="eyebrow mb-3">From Grandma</p>
        <h1
          className="font-display mb-2 text-4xl leading-tight md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          For Aanya.
        </h1>
        <p
          className="mb-10 text-base"
          style={{ color: "var(--ink-light)" }}
        >
          June 15, 2042 — your 18th birthday.
        </p>

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
              <Image
                src="/assets/player-avatar-default.png"
                alt="Grandma's avatar"
                fill
                sizes="128px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div>
              <h2
                className="font-display text-2xl"
                style={{ color: "var(--sage-deep)" }}
              >
                The morning you came into the world
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--muted)" }}
              >
                A story from Grandma · Treasured Album
              </p>
            </div>

            <button
              type="button"
              disabled
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: "var(--terra)",
                color: "var(--white)",
                fontSize: 28,
                boxShadow: "6px 6px 16px rgba(198, 123, 92, 0.35)",
              }}
              aria-label="Play story"
            >
              ▶
            </button>

            <div className="w-full">
              <div
                className="h-1.5 w-full rounded-full"
                style={{ background: "var(--sage-pale)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ background: "var(--sage)", width: "0%" }}
                />
              </div>
              <div
                className="mt-2 flex justify-between font-mono text-xs"
                style={{ color: "var(--muted)" }}
              >
                <span>00:00</span>
                <span>03:00</span>
              </div>
            </div>
          </div>
        </ClayCard>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn-ghost"
            disabled
          >
            Save forever
          </button>
          <button
            type="button"
            className="btn-ghost"
            disabled
          >
            Record a reply
          </button>
        </div>

        <Link
          href="/"
          className="mt-10 text-xs"
          style={{ color: "var(--muted)" }}
        >
          ← Back to start
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import Blob from "@/components/Blob";
import { getPromptById, DEFAULT_PROMPT_ID } from "@/lib/prompts";

export default function RecordingSessionPage() {
  const prompt = getPromptById(DEFAULT_PROMPT_ID);

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="terra" size={220} style={{ top: -60, left: -60 }} />
      <Blob variant="sage" size={160} style={{ bottom: 60, right: -40 }} />
      <Blob variant="gold" size={100} style={{ top: 200, right: 30 }} />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center md:py-16">
        <p className="eyebrow mb-3">Recording Prompt</p>
        <h1
          className="font-display mb-2 text-3xl leading-snug md:text-4xl"
          style={{ color: "var(--ink)" }}
        >
          {prompt?.text}
        </h1>
        <p
          className="mb-10 text-sm"
          style={{ color: "var(--muted)" }}
        >
          Take a breath. Begin when you&apos;re ready. Up to {prompt?.durationMin} min.
        </p>

        <div className="mb-6 flex flex-col items-center gap-6">
          <div
            className="font-mono text-3xl"
            style={{ color: "var(--ink)" }}
          >
            00:00
          </div>

          <button
            type="button"
            className="record-btn"
            aria-label="Start recording"
            disabled
            title="Recording lands Day 2"
          />

          <p
            className="text-xs"
            style={{ color: "var(--muted)" }}
          >
            Tap to record. Tap again to pause. Tap a third time to stop.
          </p>
        </div>

        <div
          className="mb-8 h-32 w-full max-w-md rounded-3xl"
          style={{
            background:
              "linear-gradient(90deg, var(--sage-pale) 0%, var(--gold-pale) 25%, var(--terra-pale) 50%, var(--gold-pale) 75%, var(--sage-pale) 100%)",
            opacity: 0.55,
          }}
          aria-hidden
        />

        <Link
          href="/record/review"
          className="btn-ghost"
          style={{ color: "var(--ink-light)" }}
        >
          I&apos;m done →
        </Link>
      </div>
    </main>
  );
}

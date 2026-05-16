import Link from "next/link";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import { getPromptById, DEFAULT_PROMPT_ID } from "@/lib/prompts";

export default function ReviewPage() {
  const prompt = getPromptById(DEFAULT_PROMPT_ID);
  const defaultTitle = "The morning you came into the world";

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

        <ClayCard className="mb-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Playback</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "var(--terra)",
                  color: "var(--white)",
                  fontSize: 20,
                }}
                aria-label="Play preview"
              >
                ▶
              </button>
              <div
                className="h-2 flex-1 rounded-full"
                style={{ background: "var(--sage-pale)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ background: "var(--sage)", width: "32%" }}
                />
              </div>
              <span
                className="font-mono text-xs"
                style={{ color: "var(--muted)" }}
              >
                00:47 / 03:00
              </span>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="mb-6">
          <label className="flex flex-col gap-2">
            <span className="eyebrow flex items-center gap-2">
              <span>Suggested title</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: "var(--gold)" }}
              >
                ✦ AI demo
              </span>
            </span>
            <input
              className="clay-input"
              type="text"
              name="title"
              defaultValue={defaultTitle}
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
            <div
              className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed"
              style={{
                borderColor: "var(--terra-pale)",
                color: "var(--muted)",
              }}
            >
              <span style={{ fontSize: 22 }}>📷</span>
              <span className="text-xs">Tap to pick a photo of yourself</span>
            </div>
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
              <RadioRow label="On her 6th birthday" />
              <RadioRow
                label="On her 18th birthday — June 15, 2042"
                selected
              />
              <RadioRow label="When she becomes a parent" />
              <RadioRow label="A custom date" />
            </div>
          </div>
        </ClayCard>

        <div className="flex justify-center">
          <Link href="/reveal" className="btn-terra">
            Seal this story
          </Link>
        </div>
      </div>
    </main>
  );
}

function RadioRow({
  label,
  selected,
}: {
  label: string;
  selected?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{
        background: selected ? "var(--sage-pale)" : "transparent",
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
    </div>
  );
}

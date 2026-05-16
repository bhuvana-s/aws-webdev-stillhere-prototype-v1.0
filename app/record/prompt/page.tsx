"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import { PROMPTS, DEFAULT_PROMPT_ID, type Prompt } from "@/lib/prompts";
import { getSelectedPromptId, saveSelectedPromptId } from "@/lib/storage";

export default function PromptSelectionPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_PROMPT_ID);
  const [continuing, setContinuing] = useState(false);

  // Pick up an earlier selection if the user navigated back.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await getSelectedPromptId();
        if (!cancelled && saved) setSelectedId(saved);
      } catch {
        /* default stands */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onContinue() {
    if (continuing) return;
    setContinuing(true);
    try {
      await saveSelectedPromptId(selectedId);
    } catch {
      /* navigation still proceeds; session will fall back to default */
    }
    router.push("/record/session");
  }

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="terra" size={180} style={{ top: -40, right: -40 }} />
      <Blob variant="sage" size={160} style={{ bottom: 100, left: -40 }} />
      <Blob variant="gold" size={100} style={{ top: 320, right: 20 }} />

      <div className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">For your story</p>
          <h1
            className="font-display mb-3 text-4xl md:text-5xl"
            style={{ color: "var(--ink)" }}
          >
            What would you like to share?
          </h1>
          <p
            className="mx-auto max-w-lg text-base"
            style={{ color: "var(--ink-light)" }}
          >
            Pick one. There&apos;s no right answer — just the one that feels
            closest to your heart today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PROMPTS.map((prompt) => (
            <PromptOption
              key={prompt.id}
              prompt={prompt}
              selected={prompt.id === selectedId}
              onSelect={() => setSelectedId(prompt.id)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onContinue}
            disabled={continuing}
            className="btn-terra"
            style={{ opacity: continuing ? 0.7 : 1 }}
          >
            {continuing ? "Loading…" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}

function PromptOption({
  prompt,
  selected,
  onSelect,
}: {
  prompt: Prompt;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      aria-pressed={selected}
    >
      <ClayCard selected={selected}>
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--bg-light)" }}
          >
            <Image
              src={prompt.iconPath}
              alt=""
              width={64}
              height={64}
              className="h-14 w-14"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p
              className="text-base font-medium leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {prompt.text}
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--muted)" }}
              >
                Suggested {prompt.durationMin} min
              </span>
              {selected && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--sage-deep)" }}
                >
                  ✦ Selected
                </span>
              )}
            </div>
          </div>
        </div>
      </ClayCard>
    </button>
  );
}

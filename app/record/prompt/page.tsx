import Image from "next/image";
import Link from "next/link";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import { PROMPTS, DEFAULT_PROMPT_ID } from "@/lib/prompts";

export default function PromptSelectionPage() {
  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="terra" size={180} style={{ top: -40, right: -40 }} />
      <Blob variant="sage" size={160} style={{ bottom: 100, left: -40 }} />
      <Blob variant="gold" size={100} style={{ top: 320, right: 20 }} />

      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">For Aanya</p>
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
            Pick one. There's no right answer — just the one that feels closest
            to your heart today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PROMPTS.map((prompt) => {
            const isDefault = prompt.id === DEFAULT_PROMPT_ID;
            return (
              <ClayCard key={prompt.id} selected={isDefault}>
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
                      {isDefault && (
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
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/record/session" className="btn-terra">
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * Founders / Team Siddhi card.
 *
 * Two founder profiles side-by-side with a closing italic quote. The
 * visual structure mirrors /Users/bsubramani/Downloads/ref.png:
 *  - hero headline "46 years in tech. Built for this problem."
 *  - two clay cards with a top-edge accent stripe (sage / gold)
 *  - bottom-pinned italic quote on a sage-pale band
 *
 * Photos live at /public/assets/Harry.png and /public/assets/Bhuvana.png.
 */

import Image from "next/image";

type Accent = "sage" | "gold";

const ACCENT: Record<Accent, { line: string; role: string; ring: string }> = {
  sage: {
    line: "var(--sage)",
    role: "var(--sage-deep)",
    ring: "var(--sage)",
  },
  gold: {
    line: "var(--gold)",
    role: "var(--gold)",
    ring: "var(--gold)",
  },
};

interface FounderProps {
  name: string;
  role: string;
  accent: Accent;
  tenure: string;
  contribution: string;
  imageSrc: string;
  initials: string;
}

function FounderCard({
  name,
  role,
  accent,
  tenure,
  contribution,
  imageSrc,
  initials,
}: FounderProps) {
  const a = ACCENT[accent];
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--white)",
        boxShadow:
          "8px 8px 16px rgba(61, 43, 31, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
      }}
    >
      <div style={{ height: 4, background: a.line }} aria-hidden />
      <div className="px-5 py-4">
        <div className="mb-3 flex items-center gap-4">
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full"
            style={{
              background: "var(--bg-light)",
              border: `2px solid ${a.ring}`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold"
                style={{ color: a.role }}
              >
                {initials}
              </span>
            )}
          </div>
          <div>
            <p
              className="font-display text-lg font-bold leading-tight"
              style={{ color: "var(--ink)" }}
            >
              {name}
            </p>
            <p
              className="text-xs font-semibold"
              style={{ color: a.role }}
            >
              {role}
            </p>
          </div>
        </div>

        <p
          className="text-xs font-medium"
          style={{ color: "var(--ink-light)" }}
        >
          {tenure}
        </p>
        <p
          className="mt-2 text-xs leading-relaxed"
          style={{ color: "var(--ink-light)" }}
        >
          {contribution}
        </p>
      </div>
    </div>
  );
}

export default function Founders() {
  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Team Siddhi</p>
        <h2
          className="font-display text-2xl leading-tight md:text-3xl"
          style={{ color: "var(--ink)" }}
        >
          46 years in tech. Built for this problem.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FounderCard
          name="Harpreet Siddhu"
          role="Co-Founder · Tech Lead"
          accent="sage"
          tenure="20 years · AWS Certified SA"
          contribution="Built the vault engine — KMS, Step Functions, CloudFront."
          imageSrc="/assets/Harry.png"
          initials="HS"
        />
        <FounderCard
          name="Bhuvana S"
          role="Co-Founder · Domain Lead"
          accent="gold"
          tenure="26 years · AWS Hero"
          contribution="Founded trust in late sister's name · 5 yrs in senior citizen homes."
          imageSrc="/assets/Bhuvana.png"
          initials="BS"
        />
      </div>

      <div
        className="mt-5 rounded-2xl px-5 py-4 text-center"
        style={{
          background: "var(--sage-pale)",
          color: "var(--ink)",
        }}
      >
        <p
          className="text-sm italic md:text-base"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          &ldquo;Harry brings the architecture. I bring the lived experience.
          Together, that&apos;s StillHere.&rdquo;
        </p>
      </div>
    </section>
  );
}

/**
 * Independent endorsement — Vidhya Bhojan, RightDots.
 *
 * Source: email dated May 14 2026 from Vidhya Bhojan (Founder &
 * Principal Consultant, RightDots) to Bhuvana & Harpreet, endorsing
 * StillHere as a powerful and emotionally meaningful solution.
 *
 * Section anatomy (mirrors the Founders modal pattern):
 *   1. Eyebrow + hero pull-quote in serif italic.
 *   2. Profile card with VB avatar + role + credentials + RightDots
 *      wordmark.
 *   3. The four elder-care networks she cited.
 *   4. Closing line.
 */

interface NetworkChip {
  name: string;
  region: string;
}

const NETWORKS: NetworkChip[] = [
  { name: "Akshaya Trust", region: "Chennai" },
  { name: "Eeranenjam Trust", region: "Tamil Nadu" },
  { name: "Helping Hearts Foundation", region: "" },
  { name: "Naana Naani Homes", region: "Coimbatore" },
];

function RightDotsWordmark() {
  return (
    <div
      className="flex h-14 items-center gap-1.5 rounded-2xl px-4"
      style={{
        background: "var(--bg-light)",
        border: "1px solid var(--pink-muted)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      aria-label="RightDots"
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: "var(--terra)" }}
        aria-hidden
      />
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: "var(--sage)" }}
        aria-hidden
      />
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: "var(--gold)" }}
        aria-hidden
      />
      <span
        className="ml-2 font-display text-base font-bold"
        style={{ color: "var(--ink)" }}
      >
        RightDots
      </span>
    </div>
  );
}

export default function Endorsement() {
  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Independent Endorsement</p>
        <h2
          className="font-display text-2xl leading-tight md:text-3xl"
          style={{ color: "var(--ink)" }}
        >
          Validated by a credentialed social-impact assessor.
        </h2>
      </div>

      {/* Hero pull-quote */}
      <div
        className="mb-5 rounded-2xl px-5 py-5 md:px-7 md:py-6"
        style={{
          background: "var(--pink-muted)",
          color: "var(--white)",
          boxShadow:
            "8px 8px 16px rgba(61, 43, 31, 0.08), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <p
          className="text-base leading-relaxed italic md:text-lg"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          &ldquo;StillHere addresses this need in a powerful and emotionally
          meaningful way. It offers elders a simple and dignified platform to
          preserve their voice and personal stories, ensuring that their
          thoughts and blessings can be passed on to future generations at
          significant moments in their loved ones&apos; lives.&rdquo;
        </p>
      </div>

      {/* Profile + wordmark */}
      <div
        className="mb-5 flex flex-col gap-4 rounded-2xl px-5 py-4 md:flex-row md:items-center md:justify-between"
        style={{
          background: "var(--white)",
          boxShadow:
            "6px 6px 14px rgba(61, 43, 31, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-display text-lg font-bold"
            style={{
              background: "var(--pink-muted)",
              color: "var(--white)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
              border: "2px solid var(--bg-light)",
            }}
            aria-hidden
          >
            VB
          </div>
          <div>
            <p
              className="font-display text-lg font-bold leading-tight"
              style={{ color: "var(--ink)" }}
            >
              Vidhya Bhojan
            </p>
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--terra-deep)" }}
            >
              Founder &amp; Principal Consultant · RightDots
            </p>
            <p
              className="mt-1 text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              NISM (SEBI) Certified Social Impact Assessor · Member, Institute
              of Social Auditors of India
            </p>
          </div>
        </div>

        <a
          href="https://www.rightdots.org"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-auto"
          style={{ textDecoration: "none" }}
        >
          <RightDotsWordmark />
        </a>
      </div>

      {/* Elder-care networks */}
      <div className="mb-5">
        <p
          className="eyebrow mb-2"
          style={{ letterSpacing: "0.18em" }}
        >
          Networks She Works With
        </p>
        <div className="flex flex-wrap gap-2">
          {NETWORKS.map((n) => (
            <span
              key={n.name}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--sage-pale)",
                color: "var(--sage-deep)",
                border: "1px solid var(--sage)",
              }}
            >
              {n.name}
              {n.region && (
                <span
                  className="text-[10px] font-normal"
                  style={{ color: "var(--muted)" }}
                >
                  · {n.region}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Body excerpts */}
      <div
        className="rounded-2xl px-5 py-4 text-sm leading-relaxed"
        style={{
          background: "var(--bg-light)",
          color: "var(--ink-light)",
        }}
      >
        <p className="mb-3">
          &ldquo;Through our social impact studies and community needs
          assessments, one recurring theme has consistently emerged:{" "}
          <strong style={{ color: "var(--ink)" }}>
            older adults have a wealth of stories, experiences, blessings, and
            life lessons they wish to share with their children and
            grandchildren.
          </strong>{" "}
          In many cases, the desire to communicate is strong, but the right
          time, platform, or opportunity is often missing.&rdquo;
        </p>
        <p className="mb-3">
          &ldquo;In today&apos;s world, where many young people are looking
          for guidance, emotional connection, and a sense of belonging,{" "}
          <strong style={{ color: "var(--ink)" }}>
            the voices of grandparents can serve as a lasting source of
            comfort and wisdom.
          </strong>{" "}
          Even when they are no longer physically present, their words can
          continue to inspire, support, and strengthen family bonds.&rdquo;
        </p>
        <p>
          &ldquo;From our perspective, this has the potential to be a{" "}
          <strong style={{ color: "var(--ink)" }}>
            truly impactful solution, both emotionally and socially.
          </strong>
          &rdquo;
        </p>
      </div>

      <p
        className="mt-4 text-center text-[11px]"
        style={{ color: "var(--muted)" }}
      >
        Source: email dated May 14, 2026 · shared with permission
      </p>
    </section>
  );
}

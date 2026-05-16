/**
 * Pricing & value-prop section.
 *
 * Three blocks:
 *   1. $99 Legacy Gift hero - occasion chips (Father's Day, Mother's
 *      Day, Christmas, Birthday). The wedge that lives "NOW" per
 *      Section 6.3 of StillHere_B2C_B2B_Flows.docx.
 *   2. For Families (B2C subscription tiers — Starter / Plus / Family).
 *   3. For Institutions (B2B channels — Insurance / Employer / Senior
 *      Living / Healthcare).
 *
 * Pure HTML/Tailwind/brand tokens — no AWS calls, no images.
 */

import ClayCard from "./ClayCard";

type Stage = "NOW" | "SOON" | "LATER";

const STAGE_COLORS: Record<Stage, { bg: string; fg: string }> = {
  NOW: { bg: "var(--terra-pale)", fg: "var(--terra-deep)" },
  SOON: { bg: "var(--sage-pale)", fg: "var(--sage-deep)" },
  LATER: { bg: "var(--gold-pale)", fg: "var(--ink)" },
};

interface B2CTier {
  name: string;
  price: string;
  cadence: string;
  includes: string[];
  highlight?: boolean;
}

const B2C_TIERS: B2CTier[] = [
  {
    name: "Starter",
    price: "$1",
    cadence: "/month",
    includes: [
      "3 sealed letters",
      "1 voice message",
      "1 beneficiary",
      "500 MB storage",
    ],
  },
  {
    name: "Plus",
    price: "$4.99",
    cadence: "/month",
    includes: [
      "Unlimited letters",
      "10 voice messages / mo",
      "3 beneficiaries",
      "5 GB storage",
    ],
    highlight: true,
  },
  {
    name: "Family",
    price: "$9.99",
    cadence: "/month",
    includes: [
      "Unlimited everything",
      "Unlimited video",
      "Unlimited beneficiaries",
      "50 GB + 1 Legacy Session / yr",
    ],
  },
];

interface B2BChannel {
  name: string;
  price: string;
  unit: string;
  minimum: string;
}

const B2B_CHANNELS: B2BChannel[] = [
  {
    name: "Insurance",
    price: "$1–2",
    unit: "per policyholder / month",
    minimum: "Min 1,000 policyholders",
  },
  {
    name: "Employer Benefits",
    price: "$3–5",
    unit: "per employee / month",
    minimum: "Min 100 employees",
  },
  {
    name: "Senior Living",
    price: "$500–1K",
    unit: "per facility / month",
    minimum: "Per facility",
  },
  {
    name: "Healthcare",
    price: "$10–25",
    unit: "per referral",
    minimum: "No minimum",
  },
];

const OCCASIONS = [
  "Father's Day",
  "Mother's Day",
  "Christmas",
  "Birthday",
];

function StageChip({ stage }: { stage: Stage }) {
  const c = STAGE_COLORS[stage];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold"
      style={{
        background: c.bg,
        color: c.fg,
        letterSpacing: "0.12em",
      }}
    >
      {stage}
    </span>
  );
}

export default function Pricing() {
  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Pricing</p>
        <p
          className="text-sm"
          style={{ color: "var(--ink-light)" }}
        >
          The first dollar today. The right model for tomorrow.
        </p>
      </div>

      {/* ===== Hero: $99 Legacy Gift wedge ===== */}
      <ClayCard className="mb-8" style={{ background: "var(--terra)" }}>
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:gap-8 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <StageChip stage="NOW" />
            <div
              className="font-display mt-2 text-6xl font-bold leading-none md:text-7xl"
              style={{ color: "var(--white)" }}
            >
              $99
            </div>
            <p
              className="mt-1 text-xs font-semibold uppercase"
              style={{ color: "var(--gold-pale)", letterSpacing: "0.16em" }}
            >
              one-time
            </p>
          </div>

          <div className="flex-1">
            <h3
              className="font-display text-2xl md:text-3xl"
              style={{ color: "var(--white)" }}
            >
              Legacy Session Gift
            </h3>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: "var(--bg-light)" }}
            >
              One guided recording, sealed cryptographically, unlimited
              storage until unlock, delivery on the day that matters. The
              first dollar of revenue and the wedge into every channel below.
            </p>

            <p
              className="mt-4 text-[10px] font-semibold uppercase"
              style={{ color: "var(--gold-pale)", letterSpacing: "0.16em" }}
            >
              Year-round gift moments
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {OCCASIONS.map((o) => (
                <span
                  key={o}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(245, 240, 232, 0.18)",
                    color: "var(--bg-light)",
                    border: "1px solid rgba(245, 240, 232, 0.35)",
                  }}
                >
                  {o}
                </span>
              ))}
            </div>

            <ul
              className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs"
              style={{ color: "var(--bg-light)" }}
            >
              <li>✓ 1 guided recording session</li>
              <li>✓ AES-256 sealed delivery</li>
              <li>✓ Unlimited storage until unlock</li>
              <li>✓ Stripe checkout — instant</li>
            </ul>
          </div>
        </div>
      </ClayCard>

      {/* ===== Two columns: For Families + For Institutions ===== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ----- B2C ----- */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <StageChip stage="SOON" />
            <h3
              className="font-display text-xl"
              style={{ color: "var(--ink)" }}
            >
              For Families · B2C
            </h3>
          </div>
          <p
            className="mb-4 text-xs"
            style={{ color: "var(--muted)" }}
          >
            Subscriptions for families who want ongoing access.
          </p>
          <div className="flex flex-col gap-3">
            {B2C_TIERS.map((tier) => (
              <ClayCard
                key={tier.name}
                style={
                  tier.highlight
                    ? {
                        background: "var(--bg-light)",
                        borderColor: "var(--sage)",
                        borderWidth: 2,
                      }
                    : { background: "var(--bg-light)" }
                }
              >
                <div className="flex items-baseline justify-between">
                  <p
                    className="font-display text-lg"
                    style={{ color: "var(--ink)" }}
                  >
                    {tier.name}
                    {tier.highlight && (
                      <span
                        className="ml-2 text-[10px] font-bold"
                        style={{ color: "var(--sage-deep)" }}
                      >
                        ✦ POPULAR
                      </span>
                    )}
                  </p>
                  <p style={{ color: "var(--ink)" }}>
                    <span className="font-display text-xl font-bold">
                      {tier.price}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {tier.cadence}
                    </span>
                  </p>
                </div>
                <ul
                  className="mt-2 text-xs"
                  style={{ color: "var(--ink-light)" }}
                >
                  {tier.includes.map((line) => (
                    <li key={line} className="leading-relaxed">
                      · {line}
                    </li>
                  ))}
                </ul>
              </ClayCard>
            ))}
          </div>
        </div>

        {/* ----- B2B ----- */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <StageChip stage="LATER" />
            <h3
              className="font-display text-xl"
              style={{ color: "var(--ink)" }}
            >
              For Institutions · B2B
            </h3>
          </div>
          <p
            className="mb-4 text-xs"
            style={{ color: "var(--muted)" }}
          >
            Same product, different door. Partners pay; families don&apos;t.
          </p>
          <div className="flex flex-col gap-3">
            {B2B_CHANNELS.map((ch) => (
              <ClayCard key={ch.name} style={{ background: "var(--bg-light)" }}>
                <div className="flex items-baseline justify-between">
                  <p
                    className="font-display text-lg"
                    style={{ color: "var(--ink)" }}
                  >
                    {ch.name}
                  </p>
                  <p
                    className="font-display text-xl font-bold"
                    style={{ color: "var(--terra-deep)" }}
                  >
                    {ch.price}
                  </p>
                </div>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--ink-light)" }}
                >
                  {ch.unit}
                </p>
                <p
                  className="mt-0.5 text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  {ch.minimum}
                </p>
              </ClayCard>
            ))}
          </div>
        </div>
      </div>

      <p
        className="mt-6 text-center text-[11px]"
        style={{ color: "var(--muted)" }}
      >
        NOW = pre-launch revenue today · SOON = subscriptions next quarter ·
        LATER = institutional contracts
      </p>
    </section>
  );
}

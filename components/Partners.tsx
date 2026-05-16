/**
 * Gift Delivery partner card — Section 5.1 of StillHere_B2C_B2B_Flows.docx.
 *
 * Three partners (Ferns N Petals, NativeSpecial, Professional
 * Photographers). Each row shows a styled wordmark, partner name,
 * what they deliver, the integration point, and the revenue split.
 *
 * To swap a wordmark for a real logo file:
 *   - drop a PNG/SVG into /public/assets/partners/<slug>.png
 *   - change the partner's `wordmark` to <Image src=... /> in the data
 *     map below
 */

import Image from "next/image";
import type { ReactNode } from "react";

interface Partner {
  name: string;
  wordmark: ReactNode;       // styled text placeholder OR future <Image />
  delivers: string;
  integrationPoint: string;
  revenue: string;
}

/* ------- Wordmark placeholders --------------------------------------
   Each is a small clay-card "logo" with brand-distinct typography
   inside the addendum palette. Replace with a real image any time. */

function FnpWordmark() {
  return (
    <div
      className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl"
      style={{
        background: "var(--sage-pale)",
        border: "1px solid var(--sage)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      aria-label="Ferns N Petals"
    >
      <span
        className="font-display text-lg font-bold leading-none"
        style={{ color: "var(--sage-deep)" }}
      >
        FNP
      </span>
      <span
        className="mt-0.5 text-[7px] uppercase"
        style={{
          color: "var(--sage-deep)",
          letterSpacing: "0.12em",
          opacity: 0.8,
        }}
      >
        Ferns
      </span>
    </div>
  );
}

function NativeSpecialWordmark() {
  return (
    <div
      className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl"
      style={{
        background: "var(--gold-pale)",
        border: "1px solid var(--gold)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      aria-label="NativeSpecial"
    >
      <span
        className="font-display text-base font-bold leading-none"
        style={{ color: "var(--terra-deep)" }}
      >
        N.S
      </span>
      <span
        className="mt-0.5 text-[7px] uppercase"
        style={{
          color: "var(--terra-deep)",
          letterSpacing: "0.12em",
          opacity: 0.8,
        }}
      >
        Native
      </span>
    </div>
  );
}

function PhotographerWordmark() {
  return (
    <div
      className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl"
      style={{
        background: "var(--terra-pale)",
        border: "1px solid var(--terra)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
      aria-label="Professional Photographers"
    >
      <span className="text-2xl leading-none" aria-hidden>
        📷
      </span>
    </div>
  );
}

const PARTNERS: Partner[] = [
  {
    name: "Ferns N Petals",
    wordmark: <FnpWordmark />,
    delivers: "Flowers, cakes, hampers",
    integrationPoint: "On unlock day: API call → delivery scheduled",
    revenue: "Commission per order",
  },
  {
    name: "NativeSpecial",
    wordmark: <NativeSpecialWordmark />,
    delivers: "Regional sweets (Mysore Pak, …)",
    integrationPoint: "On unlock day: API call → sweets delivered",
    revenue: "Commission per order",
  },
  {
    name: "Professional Photographers",
    wordmark: <PhotographerWordmark />,
    delivers: "Guided Legacy Session recording",
    integrationPoint: "Pre-recording: photographer facilitates the session",
    revenue: "70% photographer · 30% StillHere",
  },
];

function PartnerRow({ p }: { p: Partner }) {
  return (
    <div
      className="flex items-start gap-4 rounded-2xl px-4 py-4"
      style={{
        background: "var(--white)",
        boxShadow:
          "6px 6px 14px rgba(61, 43, 31, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
      }}
    >
      {p.wordmark}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className="font-display text-base font-bold"
            style={{ color: "var(--ink)" }}
          >
            {p.name}
          </p>
          <p
            className="text-[10px] font-semibold uppercase"
            style={{ color: "var(--sage-deep)", letterSpacing: "0.14em" }}
          >
            {p.revenue}
          </p>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--ink-light)" }}
        >
          {p.delivers}
        </p>
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {p.integrationPoint}
        </p>
      </div>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="w-full">
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Gift Delivery Partners</p>
        <h2
          className="font-display text-2xl leading-tight md:text-3xl"
          style={{ color: "var(--ink)" }}
        >
          Digital love + physical love, delivered together.
        </h2>
        <p
          className="mx-auto mt-2 max-w-lg text-sm"
          style={{ color: "var(--ink-light)" }}
        >
          When the story unlocks, a real-world gift arrives at the same
          moment. Peak emotional state, peak conversion.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PARTNERS.map((p) => (
          <PartnerRow key={p.name} p={p} />
        ))}
      </div>

      <p
        className="mt-5 text-center text-[11px]"
        style={{ color: "var(--muted)" }}
      >
        Logos shown are styled placeholders · drop a PNG into{" "}
        <code style={{ background: "var(--bg-light)", padding: "0 4px" }}>
          /public/assets/partners/
        </code>{" "}
        to swap.
      </p>
    </section>
  );
}

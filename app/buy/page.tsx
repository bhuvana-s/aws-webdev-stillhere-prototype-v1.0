import Image from "next/image";
import Link from "next/link";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";

export default function BuyPage() {
  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="sage" size={200} style={{ top: -40, left: -60 }} />
      <Blob variant="gold" size={120} style={{ top: 200, right: 40 }} />
      <Blob variant="terra" size={180} style={{ bottom: -40, right: -40 }} />

      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-6 inline-block text-sm"
          style={{ color: "var(--muted)" }}
        >
          ← Back
        </Link>

        <p className="eyebrow mb-3">Gift Purchase</p>
        <h1
          className="font-display mb-3 text-4xl md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          Send the gift of a voice.
        </h1>
        <p
          className="mb-10 text-base"
          style={{ color: "var(--ink-light)" }}
        >
          Tell us who's giving, who's recording, and who will one day hear it.
        </p>

        <ClayCard className="mb-6">
          <form
            action="/sent"
            className="flex flex-col gap-5"
          >
            <Section title="Buyer">
              <Field label="Your name" name="buyerName" placeholder="Bhuvana" />
            </Section>

            <Section title="Storyteller">
              <Field
                label="Your parent's name"
                name="parentName"
                placeholder="Mom"
              />
              <Field
                label="Your parent's phone"
                name="parentPhone"
                placeholder="+1 (555) 010-7724"
                type="tel"
              />
            </Section>

            <Section title="Recipient">
              <Field
                label="Your child's name"
                name="childName"
                placeholder="Aanya"
              />
              <Field
                label="Your child's birthdate"
                name="childBirthdate"
                type="date"
              />
            </Section>

            <div
              className="mt-2 flex items-center justify-between gap-4 rounded-3xl px-5 py-4"
              style={{ background: "var(--pink-muted)", color: "var(--white)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-12 items-center justify-center rounded-md font-mono text-xs font-bold"
                  style={{ background: "var(--gold)", color: "var(--ink)" }}
                >
                  CHIP
                </div>
                <div className="font-mono text-sm">4242 4242 4242 4242</div>
              </div>
              <div className="text-xs opacity-90">12/30 · 123</div>
            </div>

            <p
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              Prefilled test card. No real charge — this is a demo prototype.
            </p>

            <button
              type="submit"
              className="btn-sage mt-2"
              style={{ alignSelf: "center", minWidth: 220 }}
            >
              Send the gift — $99
            </button>
          </form>
        </ClayCard>

        <div className="flex items-center justify-center gap-3 opacity-80">
          <Image
            src="/assets/hero-gift-box.png"
            alt=""
            width={80}
            height={80}
            className="h-16 w-16"
          />
          <p
            className="text-sm"
            style={{ color: "var(--ink-light)" }}
          >
            Your gift includes one recording session, sealed delivery, and
            unlimited replays once unsealed.
          </p>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-xs font-medium"
        style={{ color: "var(--ink-light)" }}
      >
        {label}
      </span>
      <input
        className="clay-input"
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
      />
    </label>
  );
}

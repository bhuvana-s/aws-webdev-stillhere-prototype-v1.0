import Image from "next/image";
import Link from "next/link";
import Blob from "@/components/Blob";
import ClayCard from "@/components/ClayCard";

export default function SentPage() {
  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="terra" size={220} style={{ top: -50, right: -50 }} />
      <Blob variant="sage" size={180} style={{ bottom: 80, left: -40 }} />
      <Blob variant="gold" size={100} style={{ top: 200, left: 80 }} />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center md:py-24">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "var(--sage-pale)",
            color: "var(--sage-deep)",
            fontSize: 28,
          }}
        >
          ✓
        </div>

        <p className="eyebrow mb-3">Purchase Confirmed</p>
        <h1
          className="font-display mb-4 text-4xl md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          Your gift was sent to Mom.
        </h1>
        <p
          className="mb-10 max-w-lg text-base md:text-lg"
          style={{ color: "var(--ink-light)" }}
        >
          We just texted her a single tap link. No app to download, no password
          to remember — just her voice, when she's ready.
        </p>

        <ClayCard className="mb-10 w-full max-w-md">
          <div className="flex items-center gap-4 text-left">
            <Image
              src="/assets/hands-gift-sms.png"
              alt="Clay hands passing a gift box with an SMS bubble"
              width={120}
              height={120}
              className="h-24 w-24 flex-shrink-0"
            />
            <div>
              <p
                className="mb-1 text-sm font-semibold"
                style={{ color: "var(--ink)" }}
              >
                SMS sent to Mom
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                &ldquo;Aanya's family wants to hear your stories. Tap here when
                you have a moment.&rdquo;
              </p>
            </div>
          </div>
        </ClayCard>

        <Link href="/record" className="btn-sage mb-4">
          See Mom's experience →
        </Link>

        <Link href="/reveal" className="btn-ghost">
          Demo: skip to 2042
        </Link>
      </div>
    </main>
  );
}

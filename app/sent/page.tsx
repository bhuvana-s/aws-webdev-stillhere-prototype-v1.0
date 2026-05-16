"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BlobShape from "@/components/Blob";
import ClayCard from "@/components/ClayCard";
import {
  getBuyerInfo,
  getMeta,
  setRevealed,
  type SealStatus,
} from "@/lib/storage";

function formatDate(iso?: string): string {
  if (!iso) return "January 29, 2029";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function SentPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SealStatus>("draft");
  const [parentName, setParentName] = useState("Saro");
  const [childName, setChildName] = useState("Aanya");
  const [sealedDateLabel, setSealedDateLabel] = useState("January 29, 2029");
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meta, buyer] = await Promise.all([getMeta(), getBuyerInfo()]);
        if (cancelled) return;
        if (meta?.status) setStatus(meta.status);
        if (meta?.sealedDate) setSealedDateLabel(formatDate(meta.sealedDate));
        if (buyer?.parentName) setParentName(buyer.parentName);
        if (buyer?.childName) setChildName(buyer.childName);
      } catch {
        /* fall back to defaults */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSkipTo2042() {
    try {
      await setRevealed();
    } catch {
      /* best effort */
    }
    router.push("/reveal");
  }

  function onTryPlay() {
    setToast(`Sealed. Cannot decrypt until ${sealedDateLabel}.`);
    window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <BlobShape variant="terra" size={220} style={{ top: -50, right: -50 }} />
      <BlobShape variant="sage" size={180} style={{ bottom: 80, left: -40 }} />
      <BlobShape variant="gold" size={100} style={{ top: 200, left: 80 }} />

      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center md:py-16">
        {!loaded ? (
          <div className="h-32" aria-hidden />
        ) : status === "draft" ? (
          <DraftView parentName={parentName} childName={childName} />
        ) : status === "sealed" ? (
          <SealedView
            parentName={parentName}
            childName={childName}
            sealedDateLabel={sealedDateLabel}
            onTryPlay={onTryPlay}
          />
        ) : (
          <RevealedView
            parentName={parentName}
            childName={childName}
            sealedDateLabel={sealedDateLabel}
          />
        )}

        {/* Demo skip is available unless already revealed */}
        {loaded && status !== "revealed" && (
          <Link
            href="/record"
            className="btn-sage mb-4"
            style={{ display: status === "draft" ? "inline-flex" : "none" }}
          >
            See {parentName}&apos;s experience →
          </Link>
        )}

        {loaded && status !== "revealed" && (
          <button
            type="button"
            onClick={onSkipTo2042}
            className="btn-ghost"
          >
            Demo: skip to {sealedDateLabel.split(",")[1]?.trim() || "2029"}
          </button>
        )}

        {loaded && status === "revealed" && (
          <Link href="/reveal" className="btn-terra">
            View the reveal →
          </Link>
        )}
      </div>

      {/* Toast for sealed play attempt */}
      {toast && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-sm rounded-full px-5 py-3 text-sm"
          style={{
            background: "var(--ink)",
            color: "var(--bg-light)",
            boxShadow: "0 12px 32px rgba(61, 43, 31, 0.25)",
          }}
        >
          🔒 {toast}
        </div>
      )}
    </main>
  );
}

function DraftView({
  parentName,
  childName,
}: {
  parentName: string;
  childName: string;
}) {
  return (
    <>
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
        Your gift was sent to {parentName}.
      </h1>
      <p
        className="mb-10 max-w-lg text-base md:text-lg"
        style={{ color: "var(--ink-light)" }}
      >
        We just texted {parentName.toLowerCase() === "mom" ? "her" : parentName} a
        single tap link. No app to download, no password to remember — just{" "}
        {parentName.toLowerCase() === "mom" ? "her" : parentName + "'s"} voice,
        when {parentName.toLowerCase() === "mom" ? "she" : parentName} is ready.
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
              SMS sent to {parentName}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              &ldquo;{childName} wants to hear your stories. Tap
              here when you have a moment.&rdquo;
            </p>
          </div>
        </div>
      </ClayCard>
    </>
  );
}

function SealedView({
  parentName,
  childName,
  sealedDateLabel,
  onTryPlay,
}: {
  parentName: string;
  childName: string;
  sealedDateLabel: string;
  onTryPlay: () => void;
}) {
  return (
    <>
      <p className="eyebrow mb-3">Vault sealed</p>
      <h1
        className="font-display mb-4 text-4xl md:text-5xl"
        style={{ color: "var(--ink)" }}
      >
        {parentName}&apos;s story is locked.
      </h1>
      <p
        className="mb-10 max-w-lg text-base md:text-lg"
        style={{ color: "var(--ink-light)" }}
      >
        Sealed until <strong>{sealedDateLabel}</strong>. Even we cannot open
        this before then. {childName} will hear it the moment it&apos;s time.
      </p>

      <ClayCard className="mb-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--terra-pale) 0%, var(--terra) 75%)",
              boxShadow:
                "6px 6px 18px rgba(61, 43, 31, 0.18), inset 0 1px 0 rgba(255,255,255,0.4)",
              border: "3px solid var(--bg-light)",
            }}
          >
            <span style={{ fontSize: 44 }} aria-hidden>
              🔒
            </span>
          </div>

          <div>
            <p
              className="font-display text-xl"
              style={{ color: "var(--ink)" }}
            >
              For {childName}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              From {parentName} · Delivery {sealedDateLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onTryPlay}
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: "var(--terra-pale)",
              color: "var(--terra-deep)",
              fontSize: 22,
              cursor: "not-allowed",
              border: "none",
              boxShadow: "inset 4px 4px 8px rgba(166, 94, 66, 0.18)",
            }}
            aria-label="Try to play (sealed)"
          >
            ▶
          </button>

          <p
            className="text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            Tap play to see what happens before the date.
          </p>
        </div>
      </ClayCard>
    </>
  );
}

function RevealedView({
  parentName,
  childName,
  sealedDateLabel,
}: {
  parentName: string;
  childName: string;
  sealedDateLabel: string;
}) {
  return (
    <>
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "var(--gold-pale)",
          color: "var(--terra-deep)",
          fontSize: 28,
        }}
      >
        ✦
      </div>
      <p className="eyebrow mb-3">Delivered</p>
      <h1
        className="font-display mb-4 text-4xl md:text-5xl"
        style={{ color: "var(--ink)" }}
      >
        {childName} has heard {parentName.toLowerCase() === "mom" ? "her" : parentName + "'s"} story.
      </h1>
      <p
        className="mb-10 max-w-lg text-base md:text-lg"
        style={{ color: "var(--ink-light)" }}
      >
        Opened on {sealedDateLabel}. The recording is now playable anytime.
      </p>
    </>
  );
}

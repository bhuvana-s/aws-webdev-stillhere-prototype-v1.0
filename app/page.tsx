"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Blob from "@/components/Blob";
import { clearStory } from "@/lib/storage";

export default function LandingPage() {
  // Every visit to / wipes the prior recording, photo, title, sealedDate,
  // and prompt selection so the demo always walks through a fresh story.
  // Buyer info is preserved so we don't re-ask for Mom/Aanya every run.
  useEffect(() => {
    clearStory().catch(() => {
      /* best effort — fresh installs have nothing to clear */
    });
  }, []);

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="terra" size={260} style={{ top: -60, left: -80 }} />
      <Blob variant="sage" size={220} style={{ top: 120, right: -60 }} />
      <Blob variant="gold" size={140} style={{ bottom: 120, left: 60 }} />

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 pt-16 pb-24 text-center md:pt-24">
        <p className="eyebrow mb-6">A StillHere Legacy Gift</p>

        <h1
          className="font-display mb-6 text-5xl leading-[1.05] tracking-tight md:text-7xl"
          style={{ color: "var(--ink)" }}
        >
          Your love,{" "}
          <span style={{ color: "var(--terra)" }}>always on time.</span>
          <br />
          Your voice,{" "}
          <span style={{ color: "var(--sage-deep)" }}>forever present.</span>
        </h1>

        <p
          className="mb-10 max-w-2xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--ink-light)" }}
        >
          Give your parent a way to record stories that reach your child at the
          moments that matter most. Sealed today. Delivered when those moments
          arrive.
        </p>

        <div className="mb-14 flex items-center justify-center">
          <Image
            src="/assets/hero-gift-box.png"
            alt="A claymorphic gift box wrapped in a sage green ribbon"
            width={520}
            height={520}
            priority
            className="h-auto w-[320px] md:w-[440px]"
          />
        </div>

        <Link href="/buy" className="btn-terra">
          Give a Legacy Gift — $99
        </Link>

        <p
          className="mt-6 text-sm"
          style={{ color: "var(--muted)" }}
        >
          Sealed by you today. Opened by them, one day.
        </p>
      </div>
    </main>
  );
}

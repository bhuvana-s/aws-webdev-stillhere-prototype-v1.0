"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Blob from "@/components/Blob";
import { getBuyerInfo } from "@/lib/storage";

export default function StorytellerWelcomePage() {
  const [parentName, setParentName] = useState("Saro");
  const [childName, setChildName] = useState("Aanya");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const buyer = await getBuyerInfo();
        if (cancelled || !buyer) return;
        if (buyer.parentName) setParentName(buyer.parentName);
        if (buyer.childName) setChildName(buyer.childName);
      } catch {
        /* fall back to defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page-shell relative min-h-screen overflow-hidden">
      <Blob variant="sage" size={240} style={{ top: -60, left: -60 }} />
      <Blob variant="gold" size={120} style={{ top: 100, right: 40 }} />
      <Blob variant="terra" size={180} style={{ bottom: 60, right: -40 }} />
      <Blob variant="sage" size={100} style={{ bottom: 200, left: 30 }} />

      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-12 text-center md:py-20">
        <div className="mb-8">
          <Image
            src="/assets/grandma-character.png"
            alt="A warm clay grandmother in a peach cardigan"
            width={320}
            height={320}
            priority
            className="h-auto w-[240px] md:w-[280px]"
          />
        </div>

        <p className="eyebrow mb-3">Hi {parentName}</p>
        <h1
          className="font-display mb-5 text-4xl leading-tight md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          {childName} wants to hear your stories.
        </h1>
        <p
          className="mb-10 max-w-sm text-base md:text-lg"
          style={{ color: "var(--ink-light)" }}
        >
          Take your time. There&apos;s nothing to download, nothing to log in
          to. Just one tap when you&apos;re ready.
        </p>

        <Link href="/record/prompt" className="btn-terra">
          Let&apos;s begin
        </Link>

        <p
          className="mt-6 text-xs"
          style={{ color: "var(--muted)" }}
        >
          Your voice. Your pace. Whenever feels right.
        </p>
      </div>
    </main>
  );
}

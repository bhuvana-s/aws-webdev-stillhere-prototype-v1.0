import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Mono } from "next/font/google";
import Logo from "@/components/Logo";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "StillHere — Your love, always on time.",
  description:
    "A time-locked vault for a parent's voice and stories. Sealed today. Delivered at the moments that matter most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <header className="relative z-20 flex items-center px-6 pt-4 md:px-10">
          <Logo width={110} />
        </header>
        {children}
        <footer
          className="pointer-events-none fixed bottom-4 right-4 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold"
          style={{
            background: "rgba(245, 240, 232, 0.85)",
            color: "var(--ink-light)",
            border: "1px solid var(--terra-pale)",
            backdropFilter: "blur(4px)",
            letterSpacing: "0.08em",
            boxShadow: "0 4px 12px rgba(61, 43, 31, 0.08)",
          }}
        >
          <span aria-hidden>☁️</span>
          <span>
            Built on{" "}
            <span style={{ color: "var(--terra-deep)" }}>AWS</span>
          </span>
        </footer>
      </body>
    </html>
  );
}

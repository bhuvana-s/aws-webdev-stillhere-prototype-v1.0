import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** Pixel width of the rendered logo. Default 120 (header size). */
  width?: number;
  /** When true, wraps the logo in a Link back to /. Default true. */
  asLink?: boolean;
  className?: string;
}

/**
 * StillHere wordmark + envelope-with-heart mark. Single source of truth
 * for the brand logo across the site. Asset lives at
 * /public/assets/Stillhere.png and the natural aspect ratio is ~3:1
 * (620x210), so height is computed from width.
 */
export default function Logo({
  width = 120,
  asLink = true,
  className,
}: LogoProps) {
  const height = Math.round((width * 210) / 620);
  const img = (
    <Image
      src="/assets/Stillhere.png"
      alt="StillHere"
      width={width}
      height={height}
      priority
      style={{ height: "auto", width }}
      className={className}
    />
  );
  if (!asLink) return img;
  return (
    <Link href="/" aria-label="StillHere home" className="inline-block">
      {img}
    </Link>
  );
}

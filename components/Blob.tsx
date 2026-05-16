import clsx from "clsx";
import type { CSSProperties } from "react";

type Variant = "terra" | "sage" | "gold";

interface BlobProps {
  variant: Variant;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export default function Blob({ variant, size = 140, style, className }: BlobProps) {
  return (
    <div
      aria-hidden
      className={clsx("blob", `blob-${variant}`, className)}
      style={{
        width: size,
        height: size * 0.8,
        ...style,
      }}
    />
  );
}

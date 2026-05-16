"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface WaxSealProps {
  imageSrc?: string;
  size?: number;
  alt?: string;
}

/**
 * Modular wax-seal component. Animation logic is independent of the image
 * asset — drop a designer-produced PNG into /public/assets/wax-seal-default.png
 * (or pass a custom imageSrc) and the enter animation stays identical.
 */
export default function WaxSeal({
  imageSrc = "/assets/wax-seal-default.png",
  size = 220,
  alt = "Wax seal",
}: WaxSealProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        filter: "drop-shadow(8px 12px 24px rgba(166, 94, 66, 0.35))",
      }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        priority
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  );
}

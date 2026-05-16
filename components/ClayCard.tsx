import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

interface ClayCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  selected?: boolean;
}

export default function ClayCard({ children, className, style, selected }: ClayCardProps) {
  return (
    <div
      className={clsx("clay-card", className)}
      style={{
        ...(selected
          ? {
              borderColor: "var(--sage)",
              borderWidth: 2,
              boxShadow:
                "8px 8px 20px rgba(61, 43, 31, 0.10), 0 0 0 3px rgba(139, 174, 139, 0.25)",
            }
          : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

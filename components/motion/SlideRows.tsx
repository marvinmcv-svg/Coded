"use client";

import { useRef, type ReactNode } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Each direct child slides in from alternating sides, scrubbed to scroll (lite + full). Static: still. */
export function SlideRows({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      if (tier === "static") return;
      Array.from(ref.current!.children).forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: (i % 2 ? -1 : 1) * 18 },
          { xPercent: 0, ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 55%", scrub: 0.5 } },
        );
      });
    },
    ref,
    [tier],
  );

  return <ul ref={ref} className={className}>{children}</ul>;
}

"use client";

import { useRef } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Decorative accent line that draws left→right with scroll (lite + full). Static tier: not rendered. */
export function ScrubLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      if (tier === "static") return;
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 35%", scrub: true } },
      );
    },
    ref,
    [tier],
  );

  if (tier === "static") return null;
  return <div ref={ref} aria-hidden className={`h-0.5 origin-left scale-x-0 bg-accent-soft ${className ?? ""}`} />;
}

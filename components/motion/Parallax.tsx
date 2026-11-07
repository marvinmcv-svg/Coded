"use client";

import { useRef, type ReactNode } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Full tier only: the child (an image) drifts inside its clipped frame while the frame crosses the viewport. */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      if (tier !== "full") return;
      gsap.fromTo(
        ref.current!.firstElementChild,
        { scale: 1.15, yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    ref,
    [tier],
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/**
 * Full tier only: as the hero scrolls away, the copy drifts up and the photo eases back (scrub).
 * Starts from the rendered state, so nothing is hidden before GSAP arrives. Transforms/opacity only.
 */
export function HeroScrub({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap, ScrollTrigger }) => {
      if (tier !== "full") return;
      const scrollTrigger = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-copy]", { yPercent: -18, opacity: 0.25, ease: "none", scrollTrigger });
      gsap.to("[data-hero-media]", { scale: 0.9, yPercent: 8, ease: "none", scrollTrigger });
      gsap.to("[data-hero-float]", { yPercent: -60, rotate: -14, ease: "none", scrollTrigger });
      const img = ref.current?.querySelector("img");
      img?.decode().then(() => ScrollTrigger.refresh(), () => {});
    },
    ref,
    [tier],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

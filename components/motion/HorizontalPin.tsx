"use client";

import { useRef, type ReactNode } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/**
 * Full tier: pins the section and scrubs the track sideways so each panel passes through the viewport.
 * Lite/static: the same panels stack vertically (the DOM order is the reading order in every tier).
 */
export function HorizontalPin({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const full = tier === "full";

  useLazyGSAP(
    ({ gsap }) => {
      if (!full) return;
      const track = ref.current!.firstElementChild as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    },
    ref,
    [full],
  );

  return (
    <div ref={ref} className={`${full ? "overflow-hidden" : ""} ${className ?? ""}`} data-pin={full ? "on" : "off"}>
      <div className={full ? "flex h-svh w-max items-center gap-8 px-[6vw]" : "mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2"}>{children}</div>
    </div>
  );
}

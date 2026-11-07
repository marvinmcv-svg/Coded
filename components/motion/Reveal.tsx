"use client";

import { useRef, type ReactNode } from "react";
import { dur } from "@/lib/motion/tokens";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Fades content in on scroll. Static tier: opacity only. Content is visible without JS. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      gsap.from(ref.current, {
        opacity: 0,
        y: tier === "static" ? 0 : 32,
        duration: dur[4],
        ease: tier === "static" ? "none" : "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
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

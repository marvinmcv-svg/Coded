"use client";

import { useRef, type ReactNode } from "react";
import { dur } from "@/lib/motion/tokens";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Fades content in on scroll. Static tier or `calm` (trust/safety sections): opacity only. Visible without JS. */
export function Reveal({ children, className, calm = false }: { children: ReactNode; className?: string; calm?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const fadeOnly = calm || tier === "static";

  useLazyGSAP(
    ({ gsap }) => {
      gsap.from(ref.current, {
        opacity: 0,
        y: fadeOnly ? 0 : 32,
        duration: dur[4],
        ease: fadeOnly ? "none" : "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    ref,
    [fadeOnly],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { dur } from "@/lib/motion/tokens";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Masked word reveal on scroll for any child containing <SplitWords>. Lite + full; static keeps words still. */
export function TextReveal({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "span" }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      if (tier === "static") return;
      gsap.from(ref.current!.querySelectorAll("[data-word]"), {
        yPercent: 110,
        rotate: 4,
        duration: dur[4],
        ease: "expo.out",
        stagger: 0.045,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    ref,
    [tier],
  );

  return <Tag ref={ref} className={className}>{children}</Tag>;
}

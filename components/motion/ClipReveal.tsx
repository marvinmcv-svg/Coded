"use client";

import { useRef, type ReactNode } from "react";
import { dur } from "@/lib/motion/tokens";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/**
 * Media reveal: the frame wipes open (clip-path) while the image settles from a slight zoom. Lite + full.
 * `from` picks the wipe direction. Static: no motion. Visible without JS (GSAP sets the start state on load,
 * and only for frames below the fold, so nothing on screen blinks).
 */
export function ClipReveal({ children, className, from = "bottom", delay = 0 }: { children: ReactNode; className?: string; from?: "bottom" | "left" | "right"; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  const inset = { bottom: "inset(100% 0% 0% 0%)", left: "inset(0% 100% 0% 0%)", right: "inset(0% 0% 0% 100%)" }[from];

  useLazyGSAP(
    ({ gsap }) => {
      if (tier === "static") return;
      const el = ref.current!;
      if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true }, delay });
      tl.fromTo(el, { clipPath: inset }, { clipPath: "inset(0% 0% 0% 0%)", duration: dur[5], ease: "expo.out" }, 0);
      if (el.firstElementChild) tl.fromTo(el.firstElementChild, { scale: 1.25 }, { scale: 1, duration: dur[5] * 1.3, ease: "expo.out" }, 0);
    },
    ref,
    [tier],
  );

  return <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>{children}</div>;
}

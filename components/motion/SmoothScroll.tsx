"use client";

import { useEffect } from "react";
import { useMotionTier } from "./useMotionTier";

/**
 * Lenis synced to GSAP's ticker. Disabled entirely on the static tier.
 * Loaded after idle via dynamic import so the motion stack never sits on the LCP path.
 */
export function SmoothScroll() {
  const tier = useMotionTier();

  useEffect(() => {
    if (tier === "static") return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), import("./gsap")]);
      if (cancelled) return;
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = idle(() => void start());

    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      cleanup?.();
    };
  }, [tier]);

  return null;
}

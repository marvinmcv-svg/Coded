"use client";

import { useEffect, useRef } from "react";
import { useMotionTier } from "./useMotionTier";

/**
 * Full tier + fine pointer only: a soft ring that trails the native cursor (which stays visible) and grows over
 * anything marked [data-cursor]; its label shows the attribute's text ("Ver", "Play"). Decorative: aria-hidden.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();
  const on = tier === "full";

  useEffect(() => {
    if (!on || !window.matchMedia("(pointer: fine)").matches) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("./gsap").then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const el = ref.current;
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
        const text = target?.dataset.cursor ?? "";
        if (label.current && label.current.textContent !== text) label.current.textContent = text;
        gsap.to(el, { scale: target ? (text ? 3.2 : 2) : 1, opacity: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      };
      const out = () => gsap.to(el, { opacity: 0, duration: 0.3 });
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", out);
      cleanup = () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", out);
      };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed top-0 left-0 z-50 -mt-4 -ml-4 flex size-8 items-center justify-center rounded-full border border-accent-soft/80 bg-accent/10 opacity-0 backdrop-blur-[2px]">
      <span ref={label} className="text-[5px] font-semibold tracking-wide text-paper uppercase" />
    </div>
  );
}

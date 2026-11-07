"use client";

import { useRef, useState, type ReactNode } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

type Tween = { play(): void; pause(): void; timeScale(v?: number): number };

/**
 * Infinite horizontal loop. The track holds two copies (the second aria-hidden); GSAP slides it -50 %.
 * Full tier: speed and direction follow scroll velocity. Lite: constant drift. Static: no motion, wraps.
 * Pauses off screen, on hover and on keyboard focus; `controls` adds a visible pause button (WCAG 2.2.2).
 */
export function Marquee({
  children,
  className,
  seconds = 40,
  reverse = false,
  controls,
}: {
  children: ReactNode;
  className?: string;
  seconds?: number;
  reverse?: boolean;
  controls?: { pause: string; play: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<Tween | null>(null);
  const [paused, setPaused] = useState(false);
  const tier = useMotionTier();
  const moving = tier !== "static";

  useLazyGSAP(
    ({ gsap, ScrollTrigger }) => {
      if (!moving) return;
      const root = ref.current!;
      const track = root.querySelector<HTMLElement>("[data-track]")!;
      const tw = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: seconds, ease: "none", repeat: -1 });
      tween.current = tw;
      let held = false;
      const hold = () => { held = true; tw.pause(); };
      const release = () => { held = false; if (root.dataset.paused !== "true") tw.play(); };
      root.addEventListener("pointerenter", hold);
      root.addEventListener("pointerleave", release);
      root.addEventListener("focusin", hold);
      root.addEventListener("focusout", release);
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive && !held && root.dataset.paused !== "true" ? tw.play() : tw.pause()),
        onUpdate: (self) => {
          if (tier !== "full" || held || root.dataset.paused === "true") return;
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300 || 1);
          gsap.to(tw, { timeScale: v, duration: 0.2, overwrite: true });
          gsap.to(tw, { timeScale: Math.sign(v) || 1, duration: 1.2, delay: 0.25, ease: "power3.inOut" });
        },
      });
      return () => {
        root.removeEventListener("pointerenter", hold);
        root.removeEventListener("pointerleave", release);
        root.removeEventListener("focusin", hold);
        root.removeEventListener("focusout", release);
      };
    },
    ref,
    [moving, tier],
  );

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    if (next) tween.current?.pause();
    else tween.current?.play();
  };

  return (
    <div ref={ref} data-paused={paused} className={`relative overflow-hidden ${className ?? ""}`}>
      <div data-track className={`flex w-max ${moving ? "" : "flex-wrap"}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        {moving ? <div aria-hidden className="flex shrink-0 items-center">{children}</div> : null}
      </div>
      {controls && moving ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className="absolute right-4 bottom-4 z-10 rounded-[var(--radius-pill)] bg-ink/80 px-4 py-2 font-mono text-xs tracking-wide text-paper uppercase backdrop-blur"
        >
          {paused ? controls.play : controls.pause}
        </button>
      ) : null}
    </div>
  );
}

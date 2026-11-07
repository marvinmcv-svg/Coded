"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionTier } from "./useMotionTier";

/**
 * Muted looping clip that only downloads and plays while on screen (lite + full). The poster <img> is always
 * rendered underneath (or, with showPoster=false, whatever the parent puts there — the hero's LCP <img>). Decorative.
 */
export function VideoLoop({ src, poster, className, eager = false, showPoster = true }: { src: string; poster: string; className?: string; eager?: boolean; showPoster?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const tier = useMotionTier();
  const [ready, setReady] = useState(false);
  const enabled = tier !== "static";

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          if (!v.src) v.src = src;
          void v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: eager ? "50% 0px" : "10% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [enabled, src, eager]);

  return (
    <div aria-hidden className={`relative overflow-hidden ${className ?? ""}`}>
      {showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster still from scripts/build-media.py
        <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : null}
      {enabled ? (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setReady(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </div>
  );
}

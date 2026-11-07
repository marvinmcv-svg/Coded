"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { request3D } from "@/components/three/ThreeMount";
import type { Stop } from "@/components/three/Globe";

const GlobeView = dynamic(() => import("@/components/three/Globe"), { ssr: false });

const hasWebGL2 = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

/**
 * Sticky globe (full tier + WebGL2 only) beside the list of stops; the stop crossing mid-viewport becomes active
 * and the globe turns to it. Other tiers keep the art-directed poster. The stop list is the DOM equivalent.
 */
export function GlobeRouteClient({ stops, children }: { stops: Stop[]; children: ReactNode }) {
  const tier = useMotionTier();
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(0);
  const enabled = tier === "full" && near;

  // Load 3D only when the section is within a viewport of the screen.
  useEffect(() => {
    if (tier !== "full" || !hasWebGL2() || !root.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        request3D();
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "100% 0px" });
    io.observe(root.current);
    return () => io.disconnect();
  }, [tier]);

  // Active stop = the one crossing the middle band of the viewport.
  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>("[data-stop]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.stop))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="grid gap-12 md:grid-cols-2" data-active-stop={active}>
      <div aria-hidden className="relative hidden md:block">
        <div className="sticky top-[15svh] h-[70svh] w-full">
          <div className={`absolute top-1/2 left-1/2 aspect-square h-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(197_187_253/.35),rgb(118_0_231/.25)_45%,rgb(26_30_39)_75%)] transition-opacity duration-700 ${enabled ? "opacity-0" : "opacity-100"}`} />
          {enabled ? <GlobeView stops={stops} active={active} className="absolute inset-0" /> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

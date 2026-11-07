"use client";

import { useSyncExternalStore } from "react";

export type MotionTier = "static" | "lite" | "full";

const REDUCED = "(prefers-reduced-motion: reduce)";
const NARROW = "(max-width: 767px)";

function readTier(): MotionTier {
  if (window.matchMedia(REDUCED).matches) return "static";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  // GPU tier (detect-gpu) joins this check when 3D lands in P2.
  if (window.matchMedia(NARROW).matches || lowEnd) return "lite";
  return "full";
}

function subscribe(onChange: () => void) {
  const queries = [REDUCED, NARROW].map((q) => window.matchMedia(q));
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

/** `static` on the server and first paint, so SSR output is the designed reduced-motion state. */
export function useMotionTier(): MotionTier {
  return useSyncExternalStore(subscribe, readTier, () => "static");
}

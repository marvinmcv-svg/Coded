"use client";

import { useMotionTier } from "./useMotionTier";

/** `label` is pre-translated on the server and contains the literal `{tier}` placeholder. */
export function MotionTierLabel({ label }: { label: string }) {
  return (
    <p className="font-mono text-sm text-mist" data-testid="motion-tier">
      {label.replace("{tier}", useMotionTier())}
    </p>
  );
}

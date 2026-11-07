"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

type Gsap = typeof import("./gsap");

/**
 * Like useGSAP, but GSAP (+ ScrollTrigger, ~48 KB gz) is fetched via dynamic import so it never counts
 * toward a route's initial JS budget. Everything created in `setup` runs inside gsap.context(scope) and is
 * reverted on unmount / deps change — the same auto-revert guarantee useGSAP gives.
 */
export function useLazyGSAP(setup: (g: Gsap) => void, scope: RefObject<Element | null>, deps: DependencyList) {
  useEffect(() => {
    let ctx: { revert(): void } | undefined;
    let cancelled = false;
    import("./gsap").then((g) => {
      if (cancelled || !scope.current) return;
      ctx = g.gsap.context(() => setup(g), scope.current);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls re-runs via deps, like useGSAP
  }, deps);
}

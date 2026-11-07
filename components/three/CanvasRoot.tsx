"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { View } from "@react-three/drei";

/** Views are scissored to their DOM rect, so a scroll must trigger a redraw in demand mode. */
function InvalidateOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [invalidate]);
  return null;
}

/**
 * The ONE persistent WebGL canvas (CLAUDE.md): fixed, transparent, click-through. Scenes render into it
 * through drei <View> elements placed in the DOM. frameloop="demand": idle unless something invalidates.
 */
export default function CanvasRoot() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}
      aria-hidden
    >
      <InvalidateOnScroll />
      <View.Port />
    </Canvas>
  );
}

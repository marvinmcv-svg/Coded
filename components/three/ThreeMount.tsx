"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CanvasRoot = dynamic(() => import("./CanvasRoot"), { ssr: false });

const EVENT = "coded:3d";
let requested = false;

/** Called by a section that wants 3D (full tier, near the viewport). Loads the shared canvas once. */
export function request3D() {
  requested = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Lives in the marketing layout so the canvas persists across routes. Renders nothing until requested. */
export function ThreeMount() {
  const [on, setOn] = useState(() => requested);
  useEffect(() => {
    const handler = () => setOn(true);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);
  return on ? <CanvasRoot /> : null;
}

"use client";

import { useRef } from "react";
import { useLazyGSAP } from "./useLazyGSAP";
import { useMotionTier } from "./useMotionTier";

/** Giant decorative wordmark; letters rise from a mask one by one when it enters view (lite + full). */
export function Wordmark({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const tier = useMotionTier();

  useLazyGSAP(
    ({ gsap }) => {
      if (tier === "static") return;
      gsap.from(ref.current!.querySelectorAll("[data-char]"), {
        yPercent: 105,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
      });
    },
    ref,
    [tier],
  );

  return (
    <p ref={ref} aria-hidden className={`flex overflow-hidden ${className ?? ""}`}>
      {[...text].map((c, i) => <span key={i} data-char className="inline-block">{c}</span>)}
    </p>
  );
}

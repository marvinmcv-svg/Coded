"use client";

import { useEffect, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/ui/Button";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // OPEN_QUESTIONS Q26 — unset ⇒ no analytics and no banner.
const KEY = "coded_consent";
const EVENT = "coded-consent";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function loadAnalytics(id: string) {
  if (document.getElementById("ga")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag requires the arguments object
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id);
  const s = document.createElement("script");
  s.id = "ga";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Analytics load only after an explicit "Accept"; the choice is kept in localStorage. Calm: no motion. */
export function ConsentBanner({ labels }: { labels: { text: string; accept: string; decline: string } }) {
  // "ssr" on the server and during hydration, so the banner never flashes for someone who already chose.
  const choice = useSyncExternalStore(subscribe, () => localStorage.getItem(KEY), () => "ssr");
  useEffect(() => {
    if (GA_ID && choice === "granted") loadAnalytics(GA_ID);
  }, [choice]);

  if (!GA_ID || choice !== null) return null;
  const decide = (c: "granted" | "denied") => {
    localStorage.setItem(KEY, c);
    window.dispatchEvent(new Event(EVENT));
  };
  return (
    <div role="region" aria-label={labels.text} className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-[var(--radius-card)] bg-paper p-6 text-ink shadow-2xl sm:flex-row sm:items-center">
      <p className="flex-1 text-sm">{labels.text}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => decide("denied")} className={`${buttonClass("ghost")} border-ink/30 text-ink`}>{labels.decline}</button>
        <button type="button" onClick={() => decide("granted")} className={buttonClass("primary")}>{labels.accept}</button>
      </div>
    </div>
  );
}

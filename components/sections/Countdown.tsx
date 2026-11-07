"use client";

import { useEffect, useState } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";

type Labels = { days: string; hours: string; minutes: string; seconds: string; sr: string };

const left = (target: number) => Math.max(0, target - Date.now());

/**
 * Countdown to an event start (ISO date, midnight Tokyo time). Server HTML and the static tier show whole days only;
 * lite/full tick every second. Ticking digits are aria-hidden; screen readers get one sentence (`labels.sr`).
 */
export function Countdown({ date, labels }: { date: string; labels: Labels }) {
  const tier = useMotionTier();
  const target = Date.parse(`${date}T00:00:00+09:00`);
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    if (tier === "static") return;
    const tick = () => setMs(left(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [tier, target]);

  const days = Math.floor((ms ?? left(target)) / 864e5);
  const parts: [number, string][] = [[days, labels.days]];
  if (ms !== null) {
    parts.push([Math.floor(ms / 36e5) % 24, labels.hours], [Math.floor(ms / 6e4) % 60, labels.minutes], [Math.floor(ms / 1e3) % 60, labels.seconds]);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="sr-only" suppressHydrationWarning>{labels.sr.replace("{days}", String(days))}</p>
      <ul aria-hidden className="flex gap-3 font-mono" suppressHydrationWarning>
        {parts.map(([n, label]) => (
          <li key={label} className="flex min-w-16 flex-col items-center rounded-2xl bg-ink-2 px-3 py-3">
            <span className="font-display text-3xl font-semibold tabular-nums md:text-4xl" suppressHydrationWarning>
              {String(n).padStart(2, "0")}
            </span>
            <span className="text-xs text-mist">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

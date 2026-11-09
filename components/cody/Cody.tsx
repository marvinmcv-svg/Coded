"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { CodyFace } from "./CodyFace";
import type { CodyLabels } from "./types";

// The chat panel (and its logic) loads on first intent — hover, focus or tap — so first load only carries the launcher.
const loadPanel = () => import("./CodyPanel");
const CodyPanel = dynamic(loadPanel, { ssr: false });

export function Cody({ locale, labels }: { locale: "es" | "en"; labels: CodyLabels }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    button.current?.focus();
  }, []);

  return (
    <>
      {mounted && <CodyPanel open={open} onClose={close} locale={locale} labels={labels} />}
      <button
        ref={button}
        type="button"
        aria-label={open ? labels.close : labels.open}
        aria-expanded={open}
        aria-controls="cody-panel"
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        onClick={() => {
          setMounted(true);
          setOpen((o) => !o);
        }}
        className="cody-launcher group fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full p-1 transition-transform duration-[var(--dur-2)] ease-[var(--ease-expo-out)] hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
      >
        <span
          aria-hidden={open || undefined}
          className={`hidden rounded-full border border-white/10 bg-ink/70 px-4 py-2 text-sm text-paper backdrop-blur-xl transition duration-[var(--dur-3)] ease-[var(--ease-expo-out)] lg:block ${open ? "translate-x-3 opacity-0" : "opacity-100"}`}
        >
          {labels.label}
        </span>
        <CodyFace size={56} />
      </button>
    </>
  );
}

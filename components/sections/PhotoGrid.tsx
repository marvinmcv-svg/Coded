"use client";

import { useEffect, useRef, useState } from "react";

export type GridPhoto = { key: string; tag: string; src: string; srcSet: string; width?: number; height?: number; alt: string };
type Labels = { filter: string; open: string; close: string; prev: string; next: string; position: string; count: string };

/**
 * /gallery: filter chips (first one is "all"; synced to the URL hash, e.g. #europe-steam-league), a masonry grid and a lightbox on the
 * native <dialog> (focus trap, Esc and the backdrop come with it; ←/→ and swipe step through). Without JS the full grid
 * still renders.
 */
export function PhotoGrid({ photos, filters, labels }: { photos: GridPhoto[]; filters: { tag: string; label: string }[]; labels: Labels }) {
  const [tag, setTag] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const shown = tag === "all" ? photos : photos.filter((p) => p.tag === tag);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      setTag(h && filters.some((f) => f.tag === h) ? h : "all");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [filters]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const pick = (t: string) => {
    setTag(t);
    history.replaceState(null, "", t === "all" ? window.location.pathname : `#${t}`);
  };
  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length));
  const current = open === null ? null : shown[open];
  const count = (n: number) => labels.count.replace("{count}", String(n));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24">
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const n = f.tag === "all" ? photos.length : photos.filter((p) => p.tag === f.tag).length;
          return (
            <button
              key={f.tag}
              type="button"
              aria-pressed={tag === f.tag}
              onClick={() => pick(f.tag)}
              className="flex min-h-11 items-center gap-2 rounded-full border border-mist/25 px-4 text-sm transition-colors hover:border-accent-soft aria-pressed:border-accent-soft aria-pressed:bg-accent aria-pressed:text-paper"
            >
              {f.label}
              <span className="font-mono text-xs">{n}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{count(shown.length)}</p>

      <ul key={tag} className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
        {shown.map((p, i) => (
          <li key={p.key} className="photo-in mb-3 break-inside-avoid md:mb-5" style={{ "--d": `${Math.min(i, 12) * 40}ms` } as React.CSSProperties}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-2xl bg-ink-2" data-cursor="">
              <span className="sr-only">{labels.open}: </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp + srcset (content/media.ts) */}
              <img
                src={p.src}
                srcSet={p.srcSet}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 46vw"
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current?.alt}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const x = e.changedTouches[0]?.clientX;
          if (touchX.current !== null && x !== undefined && Math.abs(x - touchX.current) > 50) step(x < touchX.current ? 1 : -1);
          touchX.current = null;
        }}
        className="lightbox m-auto max-h-none max-w-none bg-transparent p-0 text-paper"
      >
        {current ? (
          <div className="flex h-svh w-screen flex-col items-center justify-center gap-4 p-4 md:p-10">
            <figure key={current.key} className="flex min-h-0 flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- largest pre-built width */}
              <img src={current.src} width={current.width} height={current.height} alt={current.alt} className="max-h-[78svh] h-auto w-auto rounded-2xl object-contain" />
              <figcaption className="max-w-2xl text-center text-sm text-mist">
                {current.alt}
                <span className="ml-3 font-mono text-xs">{labels.position.replace("{n}", String(open! + 1)).replace("{total}", String(shown.length))}</span>
              </figcaption>
            </figure>
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} className="min-h-11 rounded-full border border-mist/30 px-5 hover:border-accent-soft" aria-label={labels.prev}>←</button>
              <button type="button" onClick={() => setOpen(null)} className="min-h-11 rounded-full border border-mist/30 px-5 hover:border-accent-soft" autoFocus>{labels.close}</button>
              <button type="button" onClick={() => step(1)} className="min-h-11 rounded-full border border-mist/30 px-5 hover:border-accent-soft" aria-label={labels.next}>→</button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

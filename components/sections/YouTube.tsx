"use client";

import { useState } from "react";

/**
 * Click-to-play YouTube: a self-hosted cover + play button. The youtube-nocookie iframe (and every request to YouTube)
 * only happens after the visitor presses play, so pages stay fast and cookie-free until then.
 */
export function YouTube({ id, title, playLabel, cover }: { id: string; title: string; playLabel: string; cover: { src: string; srcSet: string } }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="group relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink-2">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`} className="absolute inset-0 size-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted webp cover + srcset */}
          <img {...cover} sizes="(min-width: 768px) 45vw, 92vw" alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo-out)] group-hover:scale-105" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <span aria-hidden className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-[0_10px_40px_-6px_rgb(118_0_231/.9)] transition-transform duration-[var(--dur-2)] ease-[var(--ease-expo-out)] group-hover:scale-110 md:size-20">
            <svg viewBox="0 0 24 24" className="ml-1 size-7 md:size-8" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
          <span className="absolute inset-x-5 bottom-4 text-left font-display text-lg font-semibold text-paper md:text-xl">{title}</span>
        </button>
      )}
    </div>
  );
}

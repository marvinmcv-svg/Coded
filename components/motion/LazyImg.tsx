"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/**
 * <img> whose src/srcSet are only set once it is within one viewport of the screen. Native loading="lazy" fetches
 * far earlier (Chrome: up to ~2500 px ahead on slow networks), which competes with the hero image for bandwidth.
 * No-JS: the <noscript> copy loads normally.
 */
export function LazyImg({ src, srcSet, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- alt passed through rest */}
      <img ref={ref} {...rest} src={on ? src : undefined} srcSet={on ? srcSet : undefined} decoding="async" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- alt passed through rest */}
        <img {...rest} src={src} srcSet={srcSet} loading="lazy" decoding="async" />
      </noscript>
    </>
  );
}

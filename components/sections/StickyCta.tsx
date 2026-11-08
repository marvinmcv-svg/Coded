"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";

/**
 * Phones only (the header button covers sm+): a "Book a call" pill that rises in once the hero is scrolled past.
 * Hidden on /consultation itself. Transform/opacity only.
 */
export function StickyCta({ label }: { label: string }) {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  if (pathname.startsWith("/consultation")) return null;
  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center transition duration-500 ease-[var(--ease-expo-out)] sm:hidden ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"}`}
      inert={!shown}
    >
      <Link prefetch={false} href="/consultation" className={`${buttonClass("primary")} shadow-[0_10px_40px_-6px_rgb(118_0_231/.9)]`}>{label}</Link>
    </div>
  );
}

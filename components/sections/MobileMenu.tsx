"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "@/lib/i18n/navigation";

/** Below `xl`: the header nav as a native disclosure (works without JS); closes itself after a route change. */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="group xl:hidden">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-mist/25 px-4 text-sm [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden className="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute inset-x-0 top-full border-b border-white/10 bg-ink/95 backdrop-blur-xl">{children}</div>
    </details>
  );
}

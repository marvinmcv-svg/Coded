import type { ReactNode } from "react";

export type CohortStatus = "open" | "few" | "closed";

const tone: Record<CohortStatus, string> = {
  open: "bg-ok/15 text-[#7ee2a8] border-ok/40",
  few: "bg-warn/15 text-[#f6c768] border-warn/40",
  closed: "bg-off/15 text-mist border-off/40",
};

export function Chip({ status, children }: { status: CohortStatus; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1 text-sm ${tone[status]}`}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {children}
    </span>
  );
}

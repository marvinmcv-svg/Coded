import type { ComponentProps } from "react";
import { Link } from "@/lib/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-pill)] px-6 font-medium " +
  "transition-transform duration-[var(--dur-1)] ease-[var(--ease-coded)] hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-paper text-ink",
  ghost: "border border-mist/40 text-paper",
};

export function buttonClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}

export function Button({ variant, className = "", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export function ButtonLink({ variant, className = "", ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${buttonClass(variant)} ${className}`} {...props} />;
}

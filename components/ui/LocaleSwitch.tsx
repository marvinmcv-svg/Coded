"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

/** Labels come pre-translated from the server so the client bundle needs no message formatter. */
export function LocaleSwitch({ label, title }: { label: string; title: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link href={pathname} locale={other} lang={other} hrefLang={other} title={title} className="font-mono text-sm underline underline-offset-4">
      {label}
    </Link>
  );
}

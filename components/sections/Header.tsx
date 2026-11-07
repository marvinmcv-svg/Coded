import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { Link } from "@/lib/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";
import { CONSULTATION_URL } from "@/lib/links";

const anchors = ["programs", "method", "championship", "safety", "contact"] as const;

export async function Header() {
  const t = await getTranslations("home.nav");
  const tc = await getTranslations("common");
  const th = await getTranslations("home.hero");

  return (
    <header className="sticky top-0 z-40 border-b border-mist/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">coded</Link>
        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex gap-6 text-sm text-mist">
            {anchors.map((a) => (
              <li key={a}><Link href={a === "programs" ? "/programs" : a === "safety" ? "/safety" : a === "contact" ? "/contact" : a === "method" ? "/method" : `/#${a}`} className="hover:text-paper">{t(a)}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitch label={tc("otherLocaleName")} title={tc("switchLocale")} />
          <a href={CONSULTATION_URL} target="_blank" rel="noopener" className={`${buttonClass("primary")} hidden min-h-10 px-4 text-sm sm:inline-flex`}>
            {th("ctaPrimary")}
          </a>
        </div>
      </div>
    </header>
  );
}

import { getTranslations } from "next-intl/server";
import { Marquee } from "@/components/motion/Marquee";

const dots = ["bg-steam-s", "bg-steam-t", "bg-steam-e", "bg-steam-a", "bg-steam-m"];

/** Decorative kinetic band (aria-hidden: the same words are real text elsewhere). Pauses on hover. */
export async function Ticker() {
  const t = await getTranslations("home");
  const words = t.raw("ticker") as string[];
  return (
    <div aria-hidden className="border-y border-mist/10 py-6 md:py-8">
      <Marquee seconds={36}>
        {words.map((w, i) => (
          <span key={w} className="flex items-center gap-8 pr-8 font-display text-5xl font-semibold tracking-tight md:gap-12 md:pr-12 md:text-8xl">
            <span className={i % 2 ? "text-outline" : "text-paper"}>{w}</span>
            <span aria-hidden className={`size-3 rounded-full md:size-4 ${dots[i % dots.length]}`} />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

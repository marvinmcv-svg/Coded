import { getTranslations } from "next-intl/server";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { LazyImg } from "@/components/motion/LazyImg";
import { Reveal } from "@/components/motion/Reveal";
import { photo, type BuiltImage } from "@/content/media";
import type { Stop } from "@/components/three/Globe";
import { programs, type Program } from "@/content/programs";
import { Link } from "@/lib/i18n/navigation";
import { GlobeRouteClient } from "./GlobeRouteClient";
import { SectionHeading } from "./SectionHeading";

// Map positions only (decorative). LATAM is a regional centroid, not a claim about a city.
const stops: (Stop & { programs: Program["slug"][]; img: BuiltImage })[] = [
  { key: "latam", lat: -12, lng: -62, programs: [], img: "worksheet" },
  { key: "orlando", lat: 28.54, lng: -81.38, programs: ["orlando-steam-league"], img: "tablets" },
  { key: "uk", lat: 51.51, lng: -0.13, programs: ["europe-steam-league", "steam-league-ai"], img: "london-steps" },
  { key: "tokyo", lat: 35.68, lng: 139.69, programs: ["tokyo-steam-championship"], img: "tokyo-temple" },
];

/** Home §2 "the world is the classroom": stops LATAM → Orlando → UK → Tokyo, globe beside them on full tier. */
export async function GlobeRoute() {
  const t = await getTranslations("home.route");
  const tp = await getTranslations("programs");
  const tm = await getTranslations("media");

  return (
    <section aria-labelledby="route-title" className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24">
      <SectionHeading id="route-title" eyebrow={t("eyebrow")} title={t("title")} />
      <GlobeRouteClient stops={stops.map(({ key, lat, lng }) => ({ key, lat, lng }))}>
        <ol className="flex flex-col">
          {stops.map((s, i) => (
            <li key={s.key} data-stop={i} className="flex min-h-[60vh] flex-col justify-center border-t border-mist/20 py-10 md:min-h-[70vh]">
              <Reveal className="flex flex-col gap-4">
                <span aria-hidden className="font-mono text-sm text-accent-soft">0{i + 1}</span>
                <h3 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">{t(`stops.${s.key}.title`)}</h3>
                <ClipReveal className="aspect-[16/10] max-w-lg rounded-3xl" from={i % 2 ? "left" : "right"}>
                  <LazyImg {...photo(s.img)} sizes="(min-width: 768px) 32rem, 90vw" alt={tm(s.img)} className="size-full object-cover" />
                </ClipReveal>
                {s.programs.length === 0 ? <p className="text-lg text-mist">{t("stops.latam.body")}</p> : null}
                <ul className="flex flex-col gap-3">
                  {s.programs.map((slug) => {
                    const p = programs.find((x) => x.slug === slug)!;
                    return (
                      <li key={slug} className="flex flex-col gap-1">
                        <Link href={`/programs/${slug}`} className="text-lg font-semibold underline-offset-4 hover:underline">{p.name}</Link>
                        <span className="text-mist">{tp(`${slug}.location`)} · {tp(`${slug}.tagline`)}</span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </GlobeRouteClient>
    </section>
  );
}

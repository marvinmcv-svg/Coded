import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { photo } from "@/content/media";
import { videos, type VideoKey } from "@/content/videos";
import { YouTube } from "./YouTube";

/** A heading + grid of Coded's YouTube videos (click to play). One video spans the full width. */
export async function Videos({ keys, id = "videos-title", all = false }: { keys: VideoKey[]; id?: string; all?: boolean }) {
  if (!keys.length) return null;
  const t = await getTranslations("videos");
  return (
    <section aria-labelledby={id} className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-24">
      <SectionHeading id={id} eyebrow={t(all ? "allEyebrow" : "eyebrow")} title={t(all ? "allTitle" : "title")} />
      <ul className={`grid gap-6 ${keys.length > 1 ? "md:grid-cols-2" : ""}`}>
        {keys.map((k) => {
          const v = videos[k];
          const cover = "cover" in v && v.cover ? photo(v.cover) : photo(`yt-${k}` as Parameters<typeof photo>[0]);
          return (
            <li key={k}>
              <Reveal>
                <YouTube id={v.id} title={t(`items.${k}`)} playLabel={t("play")} cover={cover} />
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

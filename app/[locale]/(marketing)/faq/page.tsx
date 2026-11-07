import { setRequestLocale } from "next-intl/server";
import { ContentPage, contentMetadata } from "@/components/sections/ContentPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return contentMetadata((await params).locale, "faq");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return <ContentPage pageKey="faq" />;
}

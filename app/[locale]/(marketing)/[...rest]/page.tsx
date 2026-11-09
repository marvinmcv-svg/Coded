import { notFound } from "next/navigation";

/** Any unknown path under a locale renders the localized not-found page (with header/footer) and a 404 status. */
export default function CatchAll() {
  notFound();
}

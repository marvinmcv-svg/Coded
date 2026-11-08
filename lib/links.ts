// Funnel destinations (CONTENT_FACTS §2 🟡). Enroll URL stays out until Q0 picks the app domain.
export const CONSULTATION_URL = "https://meetings.hubspot.com/genesis25";
export const PHONE = "+1 954 868 2367";
export const PHONE_HREF = "tel:+19548682367";
export const EMAIL = "info@coding-education.org";

export const AUDIENCES = ["school", "parent", "student"] as const;
export type Audience = (typeof AUDIENCES)[number];

/** Every "Book a call" goes through the qualifier (PLAN §3), carrying who is asking and about which program. */
export function consultationHref({ audience, program }: { audience?: Audience; program?: string } = {}) {
  const q = new URLSearchParams();
  if (audience) q.set("audience", audience);
  if (program) q.set("program", program);
  const s = q.toString();
  return s ? `/consultation?${s}` : "/consultation";
}

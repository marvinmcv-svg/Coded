"use server";

import { programs } from "@/content/programs";
import { AUDIENCES, type Audience } from "@/lib/links";

export type LeadField = "audience" | "name" | "email" | "country" | "program";
export type LeadState =
  | { status: "idle" }
  | { status: "error"; errors: LeadField[]; values: Record<string, string> }
  | { status: "ok"; firstName: string; lastName: string; email: string };

const PROGRAMS = [...programs.map((p) => p.slug), "unsure"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Qualifier → lead. Always lets the visitor book (the HubSpot meeting itself also creates the contact).
 * When HUBSPOT_PORTAL_ID + HUBSPOT_FORM_ID are set (OPEN_QUESTIONS Q24) the lead is also sent to the HubSpot
 * Forms API: standard contact fields only; audience/program go in `message`, and the first landing URL (with its
 * utm_* params) is the pageUri, which HubSpot uses for source attribution.
 */
export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const v = (k: string) => String(form.get(k) ?? "").trim();
  const values = { audience: v("audience"), name: v("name"), email: v("email"), country: v("country"), program: v("program") };

  // Honeypot: bots fill every field; people never see this one. Pretend success, send nothing.
  if (v("website")) return { status: "ok", firstName: "", lastName: "", email: "" };

  const errors: LeadField[] = [];
  if (!AUDIENCES.includes(values.audience as Audience)) errors.push("audience");
  if (values.name.length < 2 || values.name.length > 100) errors.push("name");
  if (!EMAIL_RE.test(values.email) || values.email.length > 200) errors.push("email");
  if (values.country.length < 2 || values.country.length > 60) errors.push("country");
  if (!PROGRAMS.includes(values.program)) errors.push("program");
  if (errors.length) return { status: "error", errors, values };

  const [firstName = "", ...rest] = values.name.split(/\s+/);
  const lastName = rest.join(" ");

  const portal = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  if (portal && formId) {
    const landing = v("landing");
    const pageUri = /^https?:\/\//.test(landing) ? landing.slice(0, 1000) : undefined;
    try {
      const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: firstName },
            { name: "lastname", value: lastName },
            { name: "email", value: values.email },
            { name: "country", value: values.country },
            { name: "message", value: `audience=${values.audience}; program=${values.program}; referrer=${v("referrer").slice(0, 300)}` },
          ],
          context: { pageUri, pageName: "Consultation" },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) console.error("HubSpot form submit failed", res.status, await res.text());
    } catch (e) {
      console.error("HubSpot form submit failed", e);
    }
  }

  return { status: "ok", firstName, lastName, email: values.email };
}

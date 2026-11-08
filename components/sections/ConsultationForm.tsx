"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead, type LeadField, type LeadState } from "@/app/[locale]/(marketing)/consultation/actions";
import { buttonClass } from "@/components/ui/Button";
import { AUDIENCES, CONSULTATION_URL } from "@/lib/links";

export type FormLabels = {
  audienceLegend: string;
  audience: Record<(typeof AUDIENCES)[number], string>;
  name: string;
  email: string;
  country: string;
  program: string;
  programs: { value: string; label: string }[];
  submit: string;
  sending: string;
  privacy: string;
  errorSummary: string;
  errors: Record<LeadField, string>;
  bookTitle: string;
  bookBody: string;
  bookFrame: string;
  bookFallback: string;
};

const input =
  "min-h-12 w-full rounded-2xl border border-mist/30 bg-ink-2 px-4 text-paper placeholder:text-mist/60 aria-[invalid=true]:border-steam-a";

/** Step 1: qualifier (5 fields). Step 2: the HubSpot meeting booker, prefilled with what they typed. */
export function ConsultationForm({ labels, defaults }: { labels: FormLabels; defaults: { audience?: string; program?: string } }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const landing = useRef<HTMLInputElement>(null);
  const referrer = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const booking = useRef<HTMLHeadingElement>(null);

  // First landing URL + referrer of this visit (UtmCapture) ride along for source attribution.
  useEffect(() => {
    if (landing.current) landing.current.value = sessionStorage.getItem("coded_landing") ?? location.href;
    if (referrer.current) referrer.current.value = sessionStorage.getItem("coded_referrer") ?? document.referrer;
  }, [state.status]);

  useEffect(() => {
    if (state.status === "error") summary.current?.focus();
    if (state.status === "ok") booking.current?.focus();
  }, [state]);

  if (state.status === "ok") {
    const q = new URLSearchParams({ embed: "true", firstName: state.firstName, lastName: state.lastName, email: state.email });
    return (
      <section aria-labelledby="book-title" className="flex flex-col gap-5">
        <h2 id="book-title" ref={booking} tabIndex={-1} className="font-display text-3xl font-semibold outline-none">{labels.bookTitle}</h2>
        <p className="text-lg text-mist">{labels.bookBody}</p>
        <iframe src={`${CONSULTATION_URL}?${q}`} title={labels.bookFrame} className="h-[720px] w-full rounded-[var(--radius-card)] bg-paper" />
        <a href={CONSULTATION_URL} target="_blank" rel="noopener" className="w-fit text-mist underline underline-offset-4 hover:text-paper">{labels.bookFallback}</a>
      </section>
    );
  }

  const err = state.status === "error" ? state.errors : [];
  const val = state.status === "error" ? state.values : { audience: defaults.audience ?? "", program: defaults.program ?? "" };
  const invalid = (f: LeadField) => err.includes(f) || undefined;
  const describe = (f: LeadField) => (err.includes(f) ? `${f}-error` : undefined);
  const errText = (f: LeadField) => (err.includes(f) ? <p id={`${f}-error`} className="text-sm text-steam-a">{labels.errors[f]}</p> : null);

  return (
    <form action={action} noValidate className="flex flex-col gap-7">
      {err.length ? (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-2xl border border-steam-a/60 p-4 outline-none">
          <p className="font-semibold">{labels.errorSummary}</p>
          <ul className="mt-2 list-disc pl-5 text-mist">{err.map((f) => <li key={f}>{labels.errors[f]}</li>)}</ul>
        </div>
      ) : null}

      <fieldset aria-describedby={describe("audience")} className="flex flex-col gap-3">
        <legend className="mb-3 font-display text-lg font-semibold">{labels.audienceLegend}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <label key={a} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-mist/30 px-4 has-[:checked]:border-accent-soft has-[:checked]:bg-accent/20">
              <input type="radio" name="audience" value={a} defaultChecked={val.audience === a} required className="accent-[var(--color-accent-soft)]" />
              {labels.audience[a]}
            </label>
          ))}
        </div>
        {errText("audience")}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        {(["name", "email", "country"] as const).map((f) => (
          <div key={f} className={`flex flex-col gap-2 ${f === "name" ? "sm:col-span-2" : ""}`}>
            <label htmlFor={f} className="font-semibold">{labels[f]}</label>
            <input
              id={f}
              name={f}
              type={f === "email" ? "email" : "text"}
              autoComplete={f === "name" ? "name" : f === "email" ? "email" : "country-name"}
              required
              defaultValue={state.status === "error" ? state.values[f] : undefined}
              aria-invalid={invalid(f)}
              aria-describedby={describe(f)}
              className={input}
            />
            {errText(f)}
          </div>
        ))}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="program" className="font-semibold">{labels.program}</label>
          <select id="program" name="program" defaultValue={val.program || "unsure"} aria-invalid={invalid("program")} aria-describedby={describe("program")} className={input}>
            {labels.programs.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {errText("program")}
        </div>
      </div>

      {/* Honeypot (hidden from people and assistive tech) + attribution fields filled on the client */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <input type="hidden" name="landing" ref={landing} />
      <input type="hidden" name="referrer" ref={referrer} />

      <p className="text-sm text-mist">{labels.privacy}</p>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} w-fit disabled:opacity-60`}>{pending ? labels.sending : labels.submit}</button>
    </form>
  );
}

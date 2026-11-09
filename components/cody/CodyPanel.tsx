"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { CodyFace } from "./CodyFace";
import type { CodyLabels } from "./types";

type Msg = { role: "user" | "assistant"; content: string };

const STORE = "coded_cody"; // session-only memory, so the chat survives navigating between pages
const LINKS = /(\/(?:es|en)(?:\/[\w\-/]*)?|[\w.+-]+@[\w-]+\.[\w.]+|\+\d[\d ]{7,}\d)/g;

/** Turns site paths, the email and phone numbers in Cody's replies into links. Everything else stays plain text. */
function linkify(text: string): ReactNode[] {
  return text.split(LINKS).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const href = part.startsWith("/") ? part.replace(/[/.,]+$/, "") : part.includes("@") ? `mailto:${part}` : `tel:${part.replace(/\s/g, "")}`;
    return (
      <a key={i} href={href} className="text-accent-soft underline underline-offset-4 hover:text-paper">
        {part}
      </a>
    );
  });
}

export default function CodyPanel({ open, onClose, locale, labels }: { open: boolean; onClose: () => void; locale: "es" | "en"; labels: CodyLabels }) {
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORE) ?? "[]") as Msg[];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "faq" | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!busy) sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-16)));
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus({ preventScroll: true });
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const write = (content: string) => setMsgs([...next, { role: "assistant", content }]);
    try {
      const res = await fetch("/api/cody", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: next.slice(-15) }),
      });
      if (!res.ok || !res.body) {
        write(res.status === 429 ? labels.limit : labels.error);
        return;
      }
      setMode(res.headers.get("x-cody-mode") === "ai" ? "ai" : "faq");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let out = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        out += dec.decode(value, { stream: true });
        write(out);
      }
      if (!out.trim()) write(labels.error);
    } catch {
      write(labels.error);
    } finally {
      setBusy(false);
    }
  }

  const status = mode === "faq" ? labels.statusOffline : labels.status;

  return (
    <section
      id="cody-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cody-title"
      data-open={open || undefined}
      inert={!open}
      className="cody-panel fixed inset-x-3 bottom-24 z-40 flex max-h-[min(640px,calc(100svh-8rem))] flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-ink/80 text-paper shadow-[0_30px_120px_-20px_rgb(118_0_231/.55)] backdrop-blur-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[400px]"
    >
      <div aria-hidden className="cody-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-soft to-transparent" />
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <CodyFace size={40} ring={false} />
        <div className="flex-1">
          <h2 id="cody-title" className="font-display text-lg leading-none font-semibold">{labels.title}</h2>
          <p className="mt-1 flex items-center gap-2 font-mono text-[11px] tracking-wider text-mist uppercase">
            <span aria-hidden className="cody-live size-1.5 rounded-full bg-steam-s" />
            {status}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label={labels.close} className="grid size-10 place-items-center rounded-full text-xl text-mist transition-colors hover:bg-white/10 hover:text-paper">
          <span aria-hidden>×</span>
        </button>
      </header>

      <div ref={list} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-5">
        <p className="cody-msg max-w-[88%] rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3 text-[15px] leading-relaxed">{labels.greeting}</p>
        {msgs.length === 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {labels.suggestions.map((s, i) => (
              <li key={s} className="cody-msg" style={{ "--d": `${120 + i * 70}ms` } as React.CSSProperties}>
                <button type="button" onClick={() => ask(s)} className="rounded-full border border-accent-soft/30 bg-accent/10 px-3.5 py-2 text-left text-sm text-accent-soft transition-colors hover:border-accent-soft hover:bg-accent/25 hover:text-paper">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="cody-msg ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-accent px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-white">{m.content}</p>
          ) : m.content ? (
            <p key={i} className="cody-msg max-w-[88%] rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap">{linkify(m.content)}</p>
          ) : (
            <p key={i} className="cody-msg flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-4">
              <span className="sr-only">{labels.thinking}</span>
              {[0, 1, 2].map((d) => <span key={d} aria-hidden className="cody-dot size-1.5 rounded-full bg-accent-soft" style={{ "--d": `${d * 140}ms` } as React.CSSProperties} />)}
            </p>
          ),
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="border-t border-white/10 p-3"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 transition-colors focus-within:border-accent-soft focus-within:bg-white/[0.07]">
          <label htmlFor="cody-input" className="sr-only">{labels.placeholder}</label>
          <textarea
            id="cody-input"
            ref={field}
            rows={1}
            maxLength={800}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(input);
              }
            }}
            placeholder={labels.placeholder}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-paper placeholder:text-mist/70 focus:outline-none"
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label={labels.send} className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-white transition duration-[var(--dur-1)] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0">
            <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <p className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 text-[11px] text-mist">
          <span>{labels.disclaimer}</span>
          <a href={`/${locale}/consultation`} className="text-accent-soft underline underline-offset-4 hover:text-paper">{labels.handover}</a>
        </p>
      </form>
    </section>
  );
}

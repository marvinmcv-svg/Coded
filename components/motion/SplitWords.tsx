import { Fragment } from "react";

/**
 * Server-side word split for reveal animations: real text stays in the DOM for assistive tech (sr-only),
 * the visual copy is aria-hidden spans that motion components translate. No layout shift, no hydration work.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span data-word className="inline-block" style={{ "--i": i } as React.CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

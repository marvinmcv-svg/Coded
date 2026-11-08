"use client";

import { useEffect } from "react";

/**
 * Remembers where this visit started (first URL, incl. utm_* / gclid, and the referrer) for the consultation lead.
 * sessionStorage only: first-party, per tab, gone when the tab closes; nothing is sent until the visitor submits.
 */
export function UtmCapture() {
  useEffect(() => {
    if (sessionStorage.getItem("coded_landing")) return;
    sessionStorage.setItem("coded_landing", location.href);
    sessionStorage.setItem("coded_referrer", document.referrer);
  }, []);
  return null;
}

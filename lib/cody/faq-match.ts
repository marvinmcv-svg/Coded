import type { Faq } from "./knowledge";

/**
 * Offline answers (no ANTHROPIC_API_KEY yet): pick the published FAQ whose question shares the most meaningful words
 * with the visitor's message. Accent- and case-insensitive; ignores short/common words. Returns null below a threshold,
 * so Cody hands over to the team instead of answering something it wasn't asked.
 */
const STOP = new Set(
  "the and for are you your can how what when where who why does with from that this have our about is do a an of to in on it we i me my el la los las de del que en y un una por para con como cual cuando donde es son mi su sus se lo al hay puedo tienen".split(" "),
);

function words(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => w.replace(/(es|s)$/, "")); // crude plural fold: programs→program, fechas→fecha
}

export function matchFaq(question: string, items: Faq[]): Faq | null {
  const q = new Set(words(question));
  if (!q.size) return null;
  let best: Faq | null = null;
  let bestScore = 0;
  for (const item of items) {
    const qWords = new Set(words(item.q));
    const aWords = new Set(words(item.a));
    let score = 0;
    for (const w of q) score += qWords.has(w) ? 2 : aWords.has(w) ? 1 : 0;
    if (score > bestScore) [best, bestScore] = [item, score];
  }
  return bestScore >= 2 ? best : null;
}

/** Reads a CSS custom property from :root, so motion code takes its values from tokens/. */
function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** A duration token such as "800ms" or "0.8s", returned in seconds for GSAP. */
export function readSeconds(name: string): number {
  const raw = readToken(name);
  return raw.endsWith("ms") ? parseFloat(raw) / 1000 : parseFloat(raw);
}

export function readNumber(name: string): number {
  return parseFloat(readToken(name));
}

/** "cubic-bezier(0.16, 1, 0.3, 1)" becomes "0.16,1,0.3,1", the form CustomEase accepts. */
export function readBezier(name: string): string {
  return readToken(name).replace(/^cubic-bezier\(|\)$/g, "").replace(/\s+/g, "");
}

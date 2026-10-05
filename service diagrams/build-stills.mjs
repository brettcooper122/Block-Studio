#!/usr/bin/env node
/**
 * Takes the stills the services backdrop blows up: `node "service diagrams/build-stills.mjs"`
 * from the repo root, with the dev server running (`npm run dev`, on http://localhost:5173).
 *
 * For each diagram it opens public/diagrams/frame-<name>.html on the badge's tile colour, holds
 * the pointer where the row's hover holds it, waits for the drawing to settle, and writes a
 * 1200px picture to public/diagrams/backdrop-<name>.png. Keep the list in step with the
 * `diagram` entries in src/content/services.ts, and the colour with --services-diagram-bg.
 *
 * It drives a browser with playwright-core, which is not a dependency of the site. The Hairline
 * skill's look.mjs installs it once into ~/Library/Caches/hairline-look (macOS); this script
 * borrows that copy. Set HAIRLINE_LOOK_CACHE to point elsewhere.
 */
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";

const BASE = process.env.SITE_URL || "http://localhost:5173";
const TILE = "#e9e9e9"; // --bs-color-brand-charcoal-900, behind --services-diagram-bg
// [name, the viewBox point the row's hover holds, intensity]
const DIAGRAMS = [
  ["marble-run", [212, 160], 0],
  ["lens", [209, 113], 0.5],
  ["pyramid", [211, 213], 0.5],
  ["guide-rails", [221, 173], 0],
];

const cache = process.env.HAIRLINE_LOOK_CACHE || join(homedir(), "Library/Caches/hairline-look");
const { chromium } = createRequire(join(cache, "node_modules/"))("playwright-core");
const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
for (const [name, at, intensity] of DIAGRAMS) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  await page.goto(`${BASE}/diagrams/frame-${name}.html?pad=0.84&intensity=${intensity}`);
  await page.waitForTimeout(600);
  await page.evaluate(([tile, at]) => {
    document.documentElement.style.setProperty("--ground", tile);
    window.postMessage({ hairline: "enter", at }, location.origin);
  }, [TILE, at]);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: join("public/diagrams", `backdrop-${name}.png`) });
  await page.close();
  console.log("wrote", `public/diagrams/backdrop-${name}.png`);
}
await browser.close();

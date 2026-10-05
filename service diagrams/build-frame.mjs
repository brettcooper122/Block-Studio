#!/usr/bin/env node
/**
 * Builds the frame-only version of a figure: `node build-frame.mjs <name>.js [out dir]`
 * writes `frame-<name>.html` beside the figure, or into the out dir, the drawing alone, scaled to fit whatever box it
 * is placed in. It pastes kernel.js (the Hairline engine, MIT, unchanged) and
 * the figure into frame.html.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [file, outDir] = process.argv.slice(2);
if (!file) { console.error("usage: node build-frame.mjs <name>.js [out dir]"); process.exit(1); }
const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(p, "utf8");
const page = read(join(here, "frame.html"))
  .replace("/*KERNEL*/", () => read(join(here, "kernel.js")))
  .replace("/*FIGURE*/", () => read(file));
const out = join(outDir || dirname(file), `frame-${basename(file, ".js")}.html`);
writeFileSync(out, page);
console.log("built", out);

#!/usr/bin/env node
/**
 * Builds the frame-only version of a figure: `node build-frame.mjs <name>.js`
 * writes `frame-<name>.html`, the drawing alone, scaled to fit whatever box it
 * is placed in. It pastes kernel.js (the Hairline engine, MIT, unchanged) and
 * the figure into frame.html.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = process.argv[2];
if (!file) { console.error("usage: node build-frame.mjs <name>.js"); process.exit(1); }
const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(p, "utf8");
const page = read(join(here, "frame.html"))
  .replace("/*KERNEL*/", () => read(join(here, "kernel.js")))
  .replace("/*FIGURE*/", () => read(file));
const out = join(dirname(file), `frame-${basename(file, ".js")}.html`);
writeFileSync(out, page);
console.log("built", out);

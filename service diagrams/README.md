# Service diagrams

One interactive line drawing per service, made with the [Hairline](https://hairline.lucasmarkes.com/skill) skill (`hairline-create`). Each one is a single HTML file with no dependencies.

| Service | Diagram | Status |
| --- | --- | --- |
| (01) Agentic End-to-End UX Design & Development | Marble run | Built |
| (02) Creative Strategy | Lens (main) · Sieve (alternate) | Built |
| (03) Rapid Pattern Generation & System Scaling | Pyramid | Built |
| (04) Self-Serve System Enablement & Brand Continuity | Guide rails | Built |

Prompts and plans for all four are in `PLANS.md`.

## Files

- `<name>.js` is the drawing itself, and the only file to edit.
- `frame-<name>.html` is the version for the site: the drawing alone, scaled to fit whatever box it sits in. Put it in an iframe at 100% width and height of the hover frame. Add `?theme=dark` for the dark palette, and `?pad=0.8` to change how much of the box it fills (0.88 by default).
- `hairline-<name>.html` is the review page from the skill, with the read-out, the intensity slider and the theme switch.
- `frame.html` and `build-frame.mjs` make the frame versions. `kernel.js` is the Hairline engine, unchanged, under the MIT licence in `LICENSE-hairline`.

## Rebuilding after a change

```
node build-frame.mjs marble-run.js
node ~/.agents/skills/hairline-create/look.mjs marble-run.js --answer 75,5,70 --edge 120,5,86
```

The first command rebuilds the frame version. The second rebuilds the review page and runs the skill's checks.

## Matching the site's colours

The drawings use one stroke palette, and their solid parts are filled with the background colour so nearer parts hide farther ones. To sit on a background other than white, set the `--hairline-plate`, `--hairline-hi`, `--hairline-edge`, `--hairline-mid` and `--hairline-lo` CSS variables in `frame.html`, and match the page background to `--hairline-plate`.

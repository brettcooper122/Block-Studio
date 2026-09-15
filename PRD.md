# Block Studio — Interactive Dither/Glitch Grid

## Feature
A full-viewport (100vw × 100vh) canvas grid of square cells over a light background. A subset of cells fill with an accent color, forming **one continuous organic mass** with ragged edges and interior "holes" — not scattered static/noise. Reference: a hand-drawn-feeling blob shape, like ink spreading across a grid, with a soft glitchy flicker along its edges. The mass never settles into a fixed shape — it drifts and reshapes continuously.

## Why noise, not random-per-cell
Flipping each cell independently at random produces uniform static ("salt and pepper"), which reads as noise/flicker, not a mass — this was tried and explicitly rejected. The organic blob shape comes from sampling a coherent 2D **simplex noise field** per cell and thresholding it — neighboring cells get correlated values, so the filled region reads as one mostly-homogenous mass with soft, wandering edges, a few internal holes, and occasional isolated outlier cells (all emerging naturally from the noise field, never randomly toggled per frame).

Motion comes entirely from **domain warping**: the (x, y) coordinates fed into the noise field are themselves offset by a second, slower-moving noise field each frame. This makes the mass's edges ripple and flow continuously — like a cell membrane or amoeba — with no per-cell randomness and therefore no flashing or glitching. Every visual change frame-to-frame is a small, continuous interpolation.

## Controls (right-hand panel — functional/throwaway styling only)
| Control | Effect |
|---|---|
| Density | Noise threshold — how much of the grid is filled (small mass ↔ large mass) |
| Motion intensity | Domain-warp strength — how much the mass's boundary wobbles/morphs, like an organism, with no flicker |
| Speed | How fast the noise field's time coordinate advances (slow drift ↔ fast churn) |
| Background color | Canvas background fill (default `#f8f8f8`) |
| Grid line color | Grid stroke color (default `#b3b3b3`) |
| Square color | Filled-cell color (default `#DA6233`) |

All controls apply live, no reload. Canvas resizes to fill the viewport on window resize.

## Tech stack
- Vite + React + TypeScript
- HTML5 Canvas + `requestAnimationFrame` for rendering/animation
- `simplex-noise` npm package for the coherent noise field
- Plain CSS, no UI/animation libraries

## Acceptance criteria
- Fills the entire viewport, no scrollbars.
- Filled region reads as one organic, holey mass, not static.
- All 6 controls visibly and correctly affect the effect in real time.
- Smooth (no visible stutter) at typical laptop viewport sizes.

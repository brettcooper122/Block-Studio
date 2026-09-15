# Block Studio — interactive dither/glitch grid

A full-viewport, interactive grid effect: an organic, homogenous mass of colored squares that morphs and drifts across a grid like a living organism, no flickering or hard randomness. Built as a prototype for the Block Studio site hero.

See [`PRD.md`](./PRD.md) for the full spec.

## Stack
- Vite + React + TypeScript
- HTML5 Canvas + `requestAnimationFrame`
- `simplex-noise` (domain-warped 2D noise field drives the mass shape and motion)

## Run it

```bash
npm install
npm run dev
```

Opens a full-viewport canvas with a right-hand test panel (density, motion intensity, speed, and colors for background/grid/squares) for live tuning.

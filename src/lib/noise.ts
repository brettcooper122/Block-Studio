import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

/** Samples the shared 3D simplex noise field, remapped to 0..1. */
export function sampleNoise(x: number, y: number, t: number): number {
  return (noise3D(x, y, t) + 1) / 2;
}

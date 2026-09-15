import { useEffect, useRef } from "react";
import { sampleNoise } from "../lib/noise";

const CELL_SIZE = 24;
const NOISE_FREQ = 0.05;
const HOLE_FREQ_MULT = 2.2;
const HOLE_WEIGHT = 0.2;
const WARP_FREQ = 0.02;
const WARP_MAGNITUDE = 3;
const WARP_TIME_MULT = 0.55;
const BASE_TIME_STEP = 0.0012;

export interface GlitchGridProps {
  density: number; // 0..1 — how much of the grid is filled
  motionIntensity: number; // 0..1 — how much the mass wobbles/morphs (domain-warp strength)
  speed: number; // 0..2 — how fast the mass drifts over time
  bgColor: string;
  gridColor: string;
  squareColor: string;
}

export function GlitchGrid({
  density,
  motionIntensity,
  speed,
  bgColor,
  gridColor,
  squareColor,
}: GlitchGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ density, motionIntensity, speed, bgColor, gridColor, squareColor });
  propsRef.current = { density, motionIntensity, speed, bgColor, gridColor, squareColor };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL_SIZE) + 1;
      rows = Math.ceil(height / CELL_SIZE) + 1;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let rafId: number;

    const draw = () => {
      const { density, motionIntensity, speed, bgColor, gridColor, squareColor } = propsRef.current;
      time += BASE_TIME_STEP * speed;
      const warpTime = time * WARP_TIME_MULT;
      const warpMag = motionIntensity * WARP_MAGNITUDE;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const threshold = 1 - density;
      ctx.fillStyle = squareColor;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Domain warp: distort the sample coordinates smoothly over time so the
          // mass ripples/morphs like an organism, instead of cells flipping randomly.
          const warpX =
            (sampleNoise(col * WARP_FREQ, row * WARP_FREQ, warpTime) * 2 - 1) * warpMag;
          const warpY =
            (sampleNoise(col * WARP_FREQ + 37.5, row * WARP_FREQ + 91.3, warpTime + 12.7) * 2 - 1) *
            warpMag;

          const macro = sampleNoise(col * NOISE_FREQ + warpX, row * NOISE_FREQ + warpY, time);
          const holes = sampleNoise(
            col * NOISE_FREQ * HOLE_FREQ_MULT + warpX,
            row * NOISE_FREQ * HOLE_FREQ_MULT + warpY,
            time * 1.15,
          );
          const value = macro * (1 - HOLE_WEIGHT) + holes * HOLE_WEIGHT;

          if (value > threshold) {
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let col = 0; col <= cols; col++) {
        const x = Math.round(col * CELL_SIZE) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let row = 0; row <= rows; row++) {
        const y = Math.round(row * CELL_SIZE) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="glitch-grid-canvas" />;
}

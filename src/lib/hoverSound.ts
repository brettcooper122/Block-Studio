/**
 * A short tap whenever a mouse pointer moves onto a link, button or [data-sound-hover], picked at
 * random from five takes so repeated hovers never sound mechanical.
 *
 * The taps are tap_01 to tap_05 from SND01 "sine" by Yasuhiro Tsuchiya (https://snd.dev), cut
 * from the snd-lib audio sprite. Free for commercial use; the raw files must not be redistributed
 * or resold on their own, or used as a sound logo.
 *
 * Browsers keep audio locked until the visitor first clicks, taps or presses a key, so hovers
 * before that stay silent.
 */
const SOUNDS = [1, 2, 3, 4, 5].map((n) => `/sounds/snd01-tap-0${n}.wav`);
const TARGETS = "a[href], button, [role='button'], [data-sound-hover]";
const VOLUME = 0.15;
const MIN_GAP_MS = 60; // sweeping across a list should not stack taps on top of each other

let context: AudioContext | null = null;
let output: GainNode | null = null;
let taps: AudioBuffer[] = [];
let lastPlayed = 0;

function unlock() {
  if (!context) {
    context = new AudioContext();
    output = context.createGain();
    output.gain.value = VOLUME;
    output.connect(context.destination);
    const ctx = context;
    Promise.all(
      SOUNDS.map((url) =>
        fetch(url)
          .then((response) => response.arrayBuffer())
          .then((data) => ctx.decodeAudioData(data)),
      ),
    ).then((buffers) => {
      taps = buffers;
    });
  }
  if (context.state === "suspended") void context.resume();
}

function play() {
  if (!context || !output || context.state !== "running" || taps.length === 0) return;
  const now = performance.now();
  if (now - lastPlayed < MIN_GAP_MS) return;
  lastPlayed = now;

  const source = context.createBufferSource();
  source.buffer = taps[Math.floor(Math.random() * taps.length)];
  source.connect(output);
  source.start();
}

function onPointerOver(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  const target = (event.target as Element | null)?.closest(TARGETS);
  if (!target) return;
  // Moving between children of the same link is not a new hover
  const from = event.relatedTarget as Node | null;
  if (from && target.contains(from)) return;
  play();
}

export function installHoverSound() {
  for (const type of ["pointerdown", "keydown", "touchstart"] as const) {
    window.addEventListener(type, unlock, { passive: true });
  }
  document.addEventListener("pointerover", onPointerOver, { passive: true });
}

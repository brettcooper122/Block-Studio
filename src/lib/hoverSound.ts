/**
 * A short tap whenever a mouse pointer moves onto a link, button or [data-sound-hover].
 *
 * The tap is tap_02 from SND01 "sine" by Yasuhiro Tsuchiya (https://snd.dev), cut from the
 * snd-lib audio sprite. Free for commercial use; the raw files must not be redistributed
 * or resold on their own, or used as a sound logo.
 *
 * Browsers keep audio locked until the visitor first clicks, taps or presses a key, so hovers
 * before that stay silent.
 */
const SOUND_URL = "/sounds/hover.wav";
const TARGETS = "a[href], button, [role='button'], [data-sound-hover]";
const VOLUME = 0.15;
const MIN_GAP_MS = 60; // sweeping across a list should not stack taps on top of each other

let context: AudioContext | null = null;
let output: GainNode | null = null;
let tap: AudioBuffer | null = null;
let lastPlayed = 0;

function unlock() {
  if (!context) {
    context = new AudioContext();
    output = context.createGain();
    output.gain.value = VOLUME;
    output.connect(context.destination);
    const ctx = context;
    fetch(SOUND_URL)
      .then((response) => response.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        tap = buffer;
      });
  }
  if (context.state === "suspended") void context.resume();
}

function play() {
  if (!context || !output || context.state !== "running" || !tap) return;
  const now = performance.now();
  if (now - lastPlayed < MIN_GAP_MS) return;
  lastPlayed = now;

  const source = context.createBufferSource();
  source.buffer = tap;
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

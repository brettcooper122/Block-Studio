/**
 * A short bubbly pop whenever a mouse pointer moves onto a link, button or [data-sound-hover].
 *
 * Browsers keep audio locked until the visitor first clicks, taps or presses a key, so hovers
 * before that stay silent. The pop is synthesised. To use a recorded sound instead, put the
 * file in public/sounds/ and point SOUND_URL at it.
 */
const SOUND_URL: string | null = null;
const TARGETS = "a[href], button, [role='button'], [data-sound-hover]";
const MIN_GAP_MS = 60; // sweeping across a list should not stack pops on top of each other
const VOLUME = 0.12;

let context: AudioContext | null = null;
let sample: AudioBuffer | null = null;
let lastPlayed = 0;

function unlock() {
  if (!context) {
    context = new AudioContext();
    if (SOUND_URL) {
      fetch(SOUND_URL)
        .then((response) => response.arrayBuffer())
        .then((data) => context!.decodeAudioData(data))
        .then((buffer) => {
          sample = buffer;
        });
    }
  }
  if (context.state === "suspended") void context.resume();
}

/** A sine that sweeps up fast with a quick swell and fade, plus a fainter overtone: a bubble surfacing. */
function synthPop(ctx: AudioContext) {
  const start = ctx.currentTime;
  const pitch = 1 + (Math.random() - 0.5) * 0.18; // each pop a touch different

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(VOLUME, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.13);
  gain.connect(ctx.destination);

  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(380 * pitch, start);
  body.frequency.exponentialRampToValueAtTime(1150 * pitch, start + 0.07);
  body.connect(gain);

  const overtoneGain = ctx.createGain();
  overtoneGain.gain.value = 0.25;
  overtoneGain.connect(gain);
  const overtone = ctx.createOscillator();
  overtone.type = "triangle";
  overtone.frequency.setValueAtTime(760 * pitch, start);
  overtone.frequency.exponentialRampToValueAtTime(2300 * pitch, start + 0.05);
  overtone.connect(overtoneGain);

  for (const osc of [body, overtone]) {
    osc.start(start);
    osc.stop(start + 0.15);
  }
}

function play() {
  if (!context || context.state !== "running") return;
  const now = performance.now();
  if (now - lastPlayed < MIN_GAP_MS) return;
  lastPlayed = now;

  if (sample) {
    const source = context.createBufferSource();
    source.buffer = sample;
    const gain = context.createGain();
    gain.gain.value = VOLUME * 4;
    source.connect(gain).connect(context.destination);
    source.start();
  } else {
    synthPop(context);
  }
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

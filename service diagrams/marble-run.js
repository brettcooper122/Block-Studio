/**
 * Marble run: a hand-cranked run on an upright board. Seven marbles roll down
 * three ramps in a zigzag, back along a groove in the base and up a clear lift,
 * always moving: one unbroken track, nothing waits at a gap. Hovering springs
 * the run down so a marble can be followed. The pointer picks the nearest part
 * of the track, tested on fixed centrelines, and the marble on it nearest the
 * pointer takes the bright stroke and keeps it round the loop. The slider is
 * how slow the run gets while hovered, as a share of full speed.
 *
 * The pattern: dilate time. A spring on the rate, a hit test on geometry that
 * never moves, and one marble latched when the choice changes, never re-picked
 * from moving positions.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, poly, prism, proj, reducedMotion, rings, ringAt, rrect, seg,
  spring, stepS, disposer, mk, place, pointer, put, register, solid,
} = HL;

const R = 4.5, TH = 3, D = 10, MY = D / 2, N = 7, V0 = 34, LX = 10, BW = 124, BH = 132;
// the ramps, top to bottom: [x at the left end, z there, x at the right end, z there]
const RAMPS = [[22, 117, 110, 95], [30, 52, 120, 82], [20, 38, 110, 16]];
const zOn = (k, x) => { const [a, za, b, zb] = RAMPS[k]; return za + ((x - a) / (b - a)) * (zb - za); };
const NAMES = ["ramp 1", "ramp 2", "ramp 3", "lift", "base"];
// the loop a marble's centre follows: [x, z, pace, part]; each point closes a segment run at that pace, in that part
const LOOP = [
  [LX, R],
  [LX, 125, 0.8, 3],
  [24, zOn(0, 24) + R, 1, 0], [110, 95 + R, 1, 0], [115, 94 + R, 2.5, 0], [115, zOn(1, 115) + R, 2.5, 0],
  [30, 52 + R, 1, 1], [25, 51 + R, 2.5, 1], [25, zOn(2, 25) + R, 2.5, 1],
  [110, 16 + R, 1, 2], [115, 15 + R, 2.5, 2], [115, R, 2.5, 2],
  [LX, R, 1.4, 4],
];

const segs = [];
let T = 0;
for (let i = 1; i < LOOP.length; i++) {
  const [x0, z0] = LOOP[i - 1], [x1, z1, pace, part] = LOOP[i];
  const dur = Math.hypot(x1 - x0, z1 - z0) / (V0 * pace);
  segs.push({ x0, z0, x1, z1, t0: T, dur, part });
  T += dur;
}
/** Where a marble's centre is at loop time t, as [x, z]. */
const at = (t) => {
  const s = segs.find((q) => t < q.t0 + q.dur) || segs[segs.length - 1], u = clamp((t - s.t0) / s.dur, 0, 1);
  return [lerp(s.x0, s.x1, u), lerp(s.z0, s.z1, u)];
};
/** The longest segment of each part: its fixed centreline is what the pointer is tested against. */
const LONG = NAMES.map((_, k) => segs.filter((s) => s.part === k).reduce((a, b) => (b.dur > a.dur ? b : a)));
const cdist = (a, b) => { const d = Math.abs(a - b) % T; return Math.min(d, T - d); };

/** A ramp: a sloped plank against the board, as a filleted silhouette, its front edge and the groove along its top. */
function plank(P, [a, za, b, zb]) {
  const top = [[a, 0, za], [b, 0, zb], [b, D, zb], [a, D, za]];
  const pts = hull(top.concat(top.map(([x, y, z]) => [x, y, z - TH])).map((q) => P(...q)));
  return {
    sil: poly(fillet(pts, pts.map(() => 2))),
    crease: seg(P(a, D, za), P(b, D, zb)),
    groove: seg(P(a + 3, MY, za + ((zb - za) * 3) / (b - a)), P(b - 3, MY, zb - ((zb - za) * 3) / (b - a))),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slow = value, clock = LONG[0].t0, part = -1, pick = 0;
  const rate = spring(reducedMotion() ? 0 : 1);

  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-8, -14, -6], [132, 20, -6], [132, -14, -6], [-8, 20, -6], [0, -5, BH], [BW, -5, BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // base, and the groove the marbles roll home along
  const [br, bi] = rings(-8, -14, 132, 20, 6, 2);
  put(solid(g), prism(P, front, br, bi, -6, 0));
  mk("path", { d: poly(ringAt(P, rrect(LX - 6, MY - 4, 121, MY + 4, 4, 4), 0)), class: "nf lo" }, g);

  // the board
  const [wr, wi] = rings(0, -5, BW, 0, 2.5, 1);
  put(solid(g), prism(P, front, wr, wi, 0, BH));

  // the crank beside the lift's foot: a wheel on the board's face, its arm and handle turning with the run
  const CX = 29, CZ = 14, CW = 6.5, Y1 = 2.5;
  const wheel = (y) => Array.from({ length: 28 }, (_, k) => P(CX + CW * Math.cos((k / 28) * 2 * Math.PI), y, CZ + CW * Math.sin((k / 28) * 2 * Math.PI)));
  mk("path", { d: poly(hull(wheel(0.4).concat(wheel(Y1)))), class: "sil" }, g);
  mk("path", { d: poly(wheel(Y1)), class: "nf lo" }, g);
  const arm = mk("path", { class: "nf" }, g), knob = mk("circle", { r: 1.8, class: "dot m" }, g);

  for (const r of RAMPS) {
    const q = plank(P, r);
    put(solid(g), q);
    mk("path", { d: q.groove, class: "nf lo" }, g);
  }

  const marbles = [];
  for (let i = 0; i < N; i++) {
    const el = mk("ellipse", { rx: R * C.S, ry: R * C.S, class: "sil" + (i === 0 ? " hi" : "") }, g);
    marbles.push({ el, glint: mk("circle", { r: 1.1, class: "dot off" }, g) });
  }

  // the lift: a clear tube, drawn over the marbles it carries
  const ring = (rr) => circ(rr, 24).map((q) => ({ ...q, u: q.u + LX, v: q.v + MY }));
  const tube = prism(P, front, ring(5.3), ring(4.6), 0, BH - 3);
  mk("path", { d: tube.sil, class: "nf" }, g);
  mk("path", { d: tube.crease, class: "nf lo" }, g);

  function draw() {
    marbles.forEach((m, i) => {
      const [x, z] = at((clock + (i * T) / N) % T), c = P(x, MY, z);
      place(m.el, c);
      place(m.glint, [c[0] - R * C.S * 0.4, c[1] - R * C.S * 0.4]);
    });
    const phi = (clock / T) * 12 * Math.PI, kx = CX + 4 * Math.cos(phi), kz = CZ + 4 * Math.sin(phi);
    arm.setAttribute("d", seg(P(CX, Y1, CZ), P(kx, Y1, kz)) + seg(P(kx, Y1, kz), P(kx, Y1 + 2.5, kz)));
    place(knob, P(kx, Y1 + 2.5, kz));
  }

  const B = register(stage, (dt) => {
    rate.t = reducedMotion() ? 0 : part >= 0 ? slow : 1;
    const moving = stepS(rate, dt);
    clock = (clock + dt * rate.x) % T;
    draw();
    return moving || rate.x > 0;
  });
  bag.add(B.unregister);

  const light = (j) => marbles.forEach((m, i) => m.el.classList.toggle("hi", i === j));
  const lines = LONG.map((s) => [P(s.x0, MY, s.z0), P(s.x1, MY, s.z1)]);
  /** The pointer's distance to a fixed centreline, and how far along it, 0 to 1. */
  const near = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], f = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    return [Math.hypot(p[0] - a[0] - f * dx, p[1] - a[1] - f * dy), f];
  };

  function choose(p) {
    let best = 0, bd = Infinity, bf = 0;
    lines.forEach(([a, b], k) => { const [d, f] = near(p, a, b); if (d < bd) { bd = d; best = k; bf = f; } });
    if (best !== part) {
      // latch the marble nearest that point of the track; it keeps the bright stroke until the part changes
      part = best;
      const want = LONG[best].t0 + bf * LONG[best].dur;
      let bt = Infinity;
      for (let i = 0; i < N; i++) { const d = cdist((clock + (i * T) / N) % T, want); if (d < bt) { bt = d; pick = i; } }
      light(pick);
      read.textContent = NAMES[best];
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: choose,
    leave: () => { part = -1; pick = 0; light(0); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { slow = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "marble-run",
  means: "A hand-cranked marble run that never stops: hover to slow it, and follow one marble down the track.",
  rules: [1, 4, 5, 8],
  range: [0.6, 0.3, 0.1],
  mount,
});

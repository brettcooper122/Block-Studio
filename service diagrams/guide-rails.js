/**
 * Guide rails: a conveyor that never stops. Blocks come out of a hooded intake
 * turned and off centre, ride the belt into a funnel of guide rails that turns
 * them square and centres them, and tip off the end into a bin, with nobody
 * standing at the belt. The blocks are plain cubes, numbered in the read-out.
 * Hovering springs the belt down so a block can be watched: the pointer picks a
 * station along the belt, on the belt's plane, which never moves, and the block
 * nearest it takes the bright stroke and keeps it until the station changes.
 * The slider is how slow the belt gets while hovered, as a share of full speed.
 *
 * The pattern: dilate time. A spring on the rate, a hit test on fixed geometry,
 * one block latched when the choice changes, and a paint order kept along the
 * belt as the blocks pass the hood, the near rail and the bin.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, reducedMotion, ringAt, rings, rrect, run, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 176, W = 36, ZT = 24, ZB = 16, N = 6, V0 = 22, BS = 12, BH = 12;
const HX = 22, F0 = 44, F1 = 104, WIDE = 17, NARROW = 7.8, BIN0 = L + 3, BIN1 = L + 31, SPAN = L + 17;
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const ease = (t) => t * t * (3 - 2 * t);
const rev = (a) => a.slice().reverse();
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : rev(pts));
/** A ring turned by a radians and moved to (x, y), normals turned with it. */
const pose = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
/** Where a block is at belt distance u: x, y, turn and height. It comes out crooked, the funnel squares it, and it tips into the bin. */
function where(u, i) {
  const t = ease(clamp((u - F0) / (F1 - F0), 0, 1)), a0 = (hash(i) - 0.5) * 1.0, y0 = (hash(i + 7) - 0.5) * 9;
  const f = clamp((u - L) / (SPAN - L), 0, 1);
  return [u, lerp(y0, 0, t), lerp(a0, 0, t), ZT - 21 * f * f];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slow = value, clock = 118 / V0, station = -1, pick = 0;
  const rate = spring(reducedMotion() ? 0 : 1);
  const C = Cam(45, 0.5, 1.58);
  fit(C, [[-4, -W / 2 - 2, 0], [BIN1, W / 2, 0], [BIN1, -W / 2, 0], [-4, W / 2, 0], [-4, -W / 2 - 2, ZT + 18], [HX, -W / 2 - 2, ZT + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.4, b = 0.6, parent = g) => put(solid(parent), prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1));

  // the stand, the belt, its slats and the rollers seen on its near face
  for (const x of [14, L - 14]) for (const y of [-W / 2 + 4, W / 2 - 4]) {
    box(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 0, ZB);
    // a dim line down the leg's nearest corner, where its two lit faces meet
    mk("path", { d: seg(P(x + 2.1, y + 2.1, 0.6), P(x + 2.1, y + 2.1, ZB)), class: "nf lo" }, g);
  }
  box(0, -W / 2, L, W / 2, ZB, ZT, 4, 1.6);
  const slats = mk("path", { class: "nf lo" }, g);
  // the rollers' axle bolts on the belt's near face: a round washer, then a hex head, each with its face as a crease
  for (const x of [5, L - 5]) {
    const ring = (r, n, a0) => Array.from({ length: n }, (_, k) => [x + r * Math.cos(a0 + (k / n) * 2 * Math.PI), 20 + r * Math.sin(a0 + (k / n) * 2 * Math.PI)]);
    const at = (pts, y) => pts.map(([px, pz]) => P(px, y, pz)), slab = (pts, y0, y1) => poly(hull(at(pts, y0).concat(at(pts, y1))));
    mk("path", { d: slab(ring(4.4, 24, 0), W / 2, W / 2 + 0.7), class: "sil" }, g);
    mk("path", { d: poly(at(ring(3.8, 24, 0), W / 2 + 0.7)), class: "nf lo" }, g);
    mk("path", { d: slab(ring(3.2, 6, Math.PI / 6), W / 2 + 0.7, W / 2 + 2), class: "sil" }, g);
    mk("path", { d: poly(at(ring(2.6, 6, Math.PI / 6), W / 2 + 2)), class: "nf lo" }, g);
  }
  // a rail: two bars on each side, wide at the intake, narrowing through the funnel
  const rail = (sy, parent) => {
    const pts = [[F0 - 10, sy * WIDE], [F1, sy * NARROW], [L - 6, sy * NARROW]];
    for (let k = 0; k < 2; k++) {
      const [a, b] = [pts[k], pts[k + 1]], len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 1.6;
      const ring = pose(rings(-len / 2, -0.8, len / 2, 0.8, 0.8, 0.3)[0], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.atan2(b[1] - a[1], b[0] - a[0]));
      const inner = pose(rings(-len / 2, -0.8, len / 2, 0.8, 0.8, 0.3)[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.atan2(b[1] - a[1], b[0] - a[0]));
      put(solid(parent), prism(P, front, ring, inner, ZT + 1, ZT + 7));
    }
  };
  rail(-1, g);
  // the bin's far half
  const bo = rrect(BIN0, -16, BIN1, 16, 4, 6), bi = rrect(BIN0 + 2.2, -13.8, BIN1 - 2.2, 13.8, 1.8, 6);
  mk("path", { d: poly(hull(ringAt(P, bo, 0).concat(ringAt(P, bo, 20)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, bi, 20)), class: "nf" }, g);

  // what moves along the belt, and what it passes, kept in paint order by distance along it
  const lane = mk("g", {}, g);
  const hood = mk("g", {}, lane), near = mk("g", {}, lane);
  box(-4, -W / 2 - 2, HX, W / 2 + 2, ZT - 3, ZT + 16, 4, 1.6, hood);
  mk("path", { d: poly(rrect(-12, ZT + 1, 12, ZT + 13, 3, 4).map((q) => P(HX, q.u, q.v))), class: "nf" }, hood);
  rail(1, near);
  const [br, bri] = rings(-BS / 2, -BS / 2, BS / 2, BS / 2, 2.4, 1);
  const blocks = Array.from({ length: N }, (_, i) => {
    const grp = mk("g", {}, lane);
    return { i, grp, body: solid(grp), x: 0 };
  });
  // a block comes in front of the near rail only once it has cleared the rail's end and tips off the belt
  const items = [{ grp: hood, key: HX }, { grp: near, key: L + 1 }, ...blocks.map((b) => ({ grp: b.grp, block: b, key: 0 }))];
  // the bin's near half, over the blocks that fall into it
  const iF = LR(ringAt(P, run(bi, front), 20)), oT = LR(ringAt(P, run(bo, front), 20)), oB = LR(ringAt(P, run(bo, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...rev(oB), oT[0]]), class: "fo" }, g);
  mk("path", { d: open(iF), class: "nf" }, g);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, g);

  let order = "";
  function draw() {
    blocks.forEach((b) => {
      const u = (clock * V0 + (b.i * SPAN) / N) % SPAN, [x, y, a, z] = where(u, b.i);
      b.x = x;
      put(b.body, prism(P, front, pose(br, x, y, a), pose(bri, x, y, a), z, z + BH));
    });
    let d = "";
    for (let x = (clock * V0) % 8; x < L - 2; x += 8) if (x > 2) d += seg(P(x, -W / 2 + 1.5, ZT), P(x, W / 2 - 1.5, ZT));
    slats.setAttribute("d", d);
    items.forEach((it) => { if (it.block) it.key = it.block.x; });
    const sorted = items.slice().sort((p, q) => p.key - q.key), sig = sorted.map((it) => items.indexOf(it)).join();
    if (sig !== order) { order = sig; sorted.forEach((it) => lane.appendChild(it.grp)); }
  }

  const B = register(stage, (dt) => {
    rate.t = reducedMotion() ? 0 : station >= 0 ? slow : 1;
    const moving = stepS(rate, dt);
    clock += dt * rate.x;
    draw();
    return moving || rate.x > 0;
  });
  bag.add(B.unregister);

  const light = (j) => blocks.forEach((b) => b.body.sil.classList.toggle("hi", b.i === j));
  light(0);

  /** Picks the station under the pointer; when it changes, latches the block nearest it. */
  function choose(p) {
    const q = unproj(C, p[0], p[1], ZT), s = q[0] > -36 && q[0] < BIN1 + 10 && Math.abs(q[1]) < W + 10 ? clamp(Math.floor(q[0] / 30), 0, 6) : -1;
    if (s !== station) {
      station = s;
      if (s >= 0) pick = blocks.reduce((a, b) => (Math.abs(b.x - q[0]) < Math.abs(a.x - q[0]) ? b : a)).i;
      else pick = 0;
      light(pick);
      read.textContent = s >= 0 ? String(pick + 1).padStart(2, "0") : "rest";
    }
    B.wake();
  }

  bag.add(pointer(stage, { move: choose, leave: () => { station = -1; pick = 0; light(0); read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { slow = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "guide-rails",
  means: "A conveyor with guide rails: blocks go in crooked and come out square. Hover to slow it and follow one block.",
  rules: [1, 4, 5, 10],
  range: [0.6, 0.3, 0.1],
  mount,
});

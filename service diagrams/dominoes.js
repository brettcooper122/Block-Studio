/**
 * Dominoes: ten dominoes stand in a gentle S across a board, each a size up on
 * the last, so the run builds toward a tall final tile. At rest the first leans,
 * poised. The pointer pushes the tile under it, and the fall travels forward to
 * the finish, each tile tipping onto the next and coming to rest against it, the
 * last lying flat. Leaving stands them back up, from the finish backward. The
 * tile pushed takes the bright stroke. The slider is the stagger, in ms.
 *
 * The pattern: one of many. A tween per tile for the discrete change (standing
 * or fallen), delayed by its distance down the run from the tile pushed; a hit
 * test on rest positions, on the board's plane, which never moves; and resting
 * angles worked out once, from the finish back, so fallen tiles never cross.
 */
const {
  Cam, fillet, fit, hull, lerp, poly, prism, proj, rad, rings, seg, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, register, solid, facing,
} = HL;

const N = 10, H0 = 12, GROW = 1.11, LEAN = rad(9);
const PIPS = [[1, 2], [3, 0], [2, 2], [0, 1], [3, 3], [1, 1], [2, 0], [3, 2], [1, 3], [2, 3]];
// the run's path: along a line that crosses the frame left to right, with a gentle S across it
const PHI = Math.atan2(-0.42, 1), DX = Math.cos(PHI), DY = Math.sin(PHI), RUN = 170, OX = 0, OY = 70;
const toWorld = (u, v) => [OX + u * DX - v * DY, OY + u * DY + v * DX];
const PATH = [];
for (let k = 0; k <= 200; k++) { const u = (k / 200) * RUN; PATH.push(toWorld(u, -9 * Math.sin((2 * Math.PI * u) / RUN))); }
const LEN = [0];
for (let k = 1; k < PATH.length; k++) LEN.push(LEN[k - 1] + Math.hypot(PATH[k][0] - PATH[k - 1][0], PATH[k][1] - PATH[k - 1][1]));
/** The point on the path at length s, and its unit direction. */
function along(s) {
  let k = 1;
  while (k < LEN.length - 1 && LEN[k] < s) k++;
  const u = (s - LEN[k - 1]) / (LEN[k] - LEN[k - 1]), a = PATH[k - 1], b = PATH[k], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), (b[0] - a[0]) / l, (b[1] - a[1]) / l];
}

// the tiles: height, width, thickness and where each stands along the path
const TILES = [];
let s = 6;
for (let i = 0; i < N; i++) {
  const h = H0 * GROW ** i, t = { h, w: h * 0.5, th: h * 0.2, s };
  TILES.push(t);
  s += h * 0.72;
}
/** A point of tile i tipped by theta about its front bottom edge: [distance along the run, height]; a is across its thickness, c up it. */
const tip = (t, th, a, c) => {
  const p = t.s + t.th / 2, x = a - t.th / 2;
  return [p + x * Math.cos(th) + c * Math.sin(th), -x * Math.sin(th) + c * Math.cos(th)];
};
// resting angles, from the finish back: the last lies flat, each other leans until its top meets the back of the next
TILES[N - 1].rest = Math.PI / 2;
for (let i = N - 2; i >= 0; i--) {
  const t = TILES[i], n = TILES[i + 1], b0 = tip(n, n.rest, -n.th / 2, 0), b1 = tip(n, n.rest, -n.th / 2, n.h);
  const side = (th) => { const q = tip(t, th, t.th / 2, t.h); return (b1[0] - b0[0]) * (q[1] - b0[1]) - (b1[1] - b0[1]) * (q[0] - b0[0]); };
  let lo = 0, hi = Math.PI / 2;
  if (Math.sign(side(lo)) === Math.sign(side(hi))) t.rest = hi;
  else { for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (Math.sign(side(m)) === Math.sign(side(lo))) lo = m; else hi = m; } t.rest = lo; }
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value, from = -1;
  const C = Cam(45, 0.5, 2.0);
  const U1 = TILES[N - 1].s + TILES[N - 1].h + 8, corners = [[-8, -20], [U1, -20], [U1, 20], [-8, 20]].map(([u, v]) => toWorld(u, v));
  fit(C, corners.map(([x, y]) => [x, y, -4]).concat([[...toWorld(TILES[N - 1].s, 0), TILES[N - 1].h + 2], [...toWorld(0, 0), H0 + 4]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the board
  const turn = (ring) => ring.map((q) => { const [x, y] = toWorld(q.u, q.v); return { u: x, v: y, nu: q.nu * DX - q.nv * DY, nv: q.nu * DY + q.nv * DX }; });
  const [br, bi] = rings(-8, -20, U1, 20, 8, 2);
  put(solid(g), prism(P, front, turn(br), turn(bi), -4, 0));

  const tiles = TILES.map((t, i) => {
    const [x, y, fx, fy] = along(t.s), grp = mk("g", {}, g);
    const el = { sil: mk("path", { class: "sil" }, grp), face: mk("path", { class: "nf lo" }, grp) };
    const pips = Array.from({ length: PIPS[i][0] + PIPS[i][1] }, () => mk("circle", { r: 0.9, class: "dot off" }, grp));
    return { ...t, i, x, y, fx, fy, el, pips, tw: tween(i === 0 ? LEAN : 0), drawn: NaN };
  });

  /** A tile at angle theta: its silhouette, its front face with the line across it, and its pips, while that face shows. */
  function draw(t, now) {
    const th = tval(t.tw, now);
    if (th === t.drawn) return;
    t.drawn = th;
    const W = (a, b, c) => { const [f, z] = tip(t, th, a, c); return P(t.x + t.fx * (f - t.s) - t.fy * b, t.y + t.fy * (f - t.s) + t.fx * b, z); };
    const corners = [];
    for (const a of [-t.th / 2, t.th / 2]) for (const b of [-t.w / 2, t.w / 2]) for (const c of [0, t.h]) corners.push(W(a, b, c));
    const hp = hull(corners);
    t.el.sil.setAttribute("d", poly(fillet(hp, hp.map(() => 1.2), 3)));
    const fa = t.th / 2, m = 0.9, F = [W(fa, -t.w / 2 + m, m), W(fa, t.w / 2 - m, m), W(fa, t.w / 2 - m, t.h - m), W(fa, -t.w / 2 + m, t.h - m)];
    const area = F.reduce((acc, p, k) => acc + p[0] * F[(k + 1) % 4][1] - F[(k + 1) % 4][0] * p[1], 0), shows = area > 0;
    t.el.face.setAttribute("d", shows ? poly(F) + seg(W(fa, -t.w / 2 + 2, t.h / 2), W(fa, t.w / 2 - 2, t.h / 2)) : "");
    const [lo, up] = PIPS[t.i];
    const spots = (n, c0) => [[0, 0], [-1, 1], [1, -1]].slice(0, n).map(([u, v]) => [u * t.w * 0.22, c0 + v * t.h * 0.12]);
    spots(lo, t.h * 0.25).concat(spots(up, t.h * 0.75)).forEach(([b, c], k) => {
      place(t.pips[k], W(fa, b, c));
      t.pips[k].setAttribute("r", shows ? 0.9 : 0);
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tiles) { draw(t, now); if (!tdone(t.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const light = (j) => tiles.forEach((t) => t.el.sil.classList.toggle("hi", t.i === j));
  light(0);

  /** Pushes tile a: it and every tile after it fall, each after the one before. Never stands a tile up while the pointer is on the board. */
  function push(a) {
    if (from >= 0 && a >= from) return;
    from = a;
    const now = performance.now();
    tiles.forEach((t) => { if (t.i >= a) tset(t.tw, t.rest, now, (t.i - a) * stag); });
    light(a);
    read.textContent = "tile " + String(a + 1).padStart(2, "0");
    B.wake();
  }
  function reset() {
    if (from < 0) return;
    from = -1;
    const now = performance.now();
    tiles.forEach((t) => tset(t.tw, t.i === 0 ? LEAN : 0, now, (N - 1 - t.i) * stag));
    light(0);
    read.textContent = "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], 0), u = (q[0] - OX) * DX + (q[1] - OY) * DY, v = -(q[0] - OX) * DY + (q[1] - OY) * DX;
      if (u < -12 || u > U1 + 4 || Math.abs(v) > 26) { reset(); return; }
      push(tiles.reduce((a, t) => (Math.hypot(t.x - q[0], t.y - q[1]) < Math.hypot(a.x - q[0], a.y - q[1]) ? t : a)).i);
    },
    leave: reset,
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dominoes",
  means: "A run of dominoes, each bigger than the last: push one and the fall carries forward, tile by tile, to the finish.",
  rules: [1, 2, 5, 8],
  range: [40, 70, 110],
  mount,
});

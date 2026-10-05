/**
 * Pyramid: fourteen studded bricks lie scattered and turned across a flat tray.
 * When the pointer comes onto the tray they hop up, turn square and click
 * together into a stepped pyramid, three by three, then two by two, then the
 * capstone. Each layer starts from the brick nearest the pointer, and a layer
 * waits for the one beneath it, so nothing is ever placed on air. Leaving takes
 * the pyramid apart from the top. The capstone carries the bright stroke, loose
 * at rest and on top when built. The slider is the stagger, in ms.
 *
 * The pattern: one of many. A tween per brick for the discrete change (loose or
 * placed), delayed by layer and by distance from the pointer; a hit test on the
 * tray's top, which never moves; paint order kept by layer, then depth.
 */
const {
  Cam, circ, clamp, facing, fit, lerp, poly, prism, proj, rings, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 144, Y1 = 104, H = 8, B = 23, BH = 12.5, PITCH = 11.5, SR = 3.1, SH = 2.2, GAP = 0.35, LIFT = 20;
const CX = X1 / 2, CY = Y1 / 2;
// the pyramid's places, bottom layer first: [x, y, layer]
const PLACES = [];
for (const [n, L] of [[3, 0], [2, 1], [1, 2]]) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
  PLACES.push([CX + (i - (n - 1) / 2) * B, CY + (j - (n - 1) / 2) * B, L]);
}
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// where the bricks lie at rest: a jittered scatter over the tray, each turned its own way
const SCATTER = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
  const k = r * 5 + c;
  if (k === 7) continue;
  SCATTER.push([14 + c * 29 + (hash(k) - 0.5) * 4, 16 + r * 36 + (hash(k + 20) - 0.5) * 5, (hash(k + 40) - 0.5) * 0.75]);
}
// the capstone lies near the front right, where the eye starts
const ORDER = [0, 5, 10, 1, 6, 11, 2, 12, 3, 8, 7, 4, 9, 13];
/** A ring turned by a radians and moved to (x, y), normals turned with it. */
const pose = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value, built = false, at = [CX, CY];
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-8, -8, 0], [X1 + 8, Y1 + 8, 0], [X1 + 8, -8, 0], [-8, Y1 + 8, 0], [CX, CY, H + 3 * BH + SH + 2], [0, 0, H + LIFT + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the tray, flat, with the finger notch on its front face
  const [tr, ti] = rings(-8, -8, X1 + 8, Y1 + 8, 8, 2);
  put(solid(g), prism(P, front, tr, ti, 0, H));
  const onFront = (ring) => ring.map((q) => P(q.u, Y1 + 8, q.v));
  mk("path", { d: poly(onFront(rings(CX - 12, 2, CX + 12, 6, 2, 1)[0])), class: "nf lo" }, g);

  const [ring, inner] = rings(-B / 2 + GAP, -B / 2 + GAP, B / 2 - GAP, B / 2 - GAP, 2.4, 1.2);
  const stud = circ(SR, 16), studIn = circ(SR - 0.8, 16);
  const STUDS = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([u, v]) => [(u * PITCH) / 2, (v * PITCH) / 2]);
  const bricks = PLACES.map(([x, y, L], i) => {
    const grp = mk("g", {}, g), body = solid(grp);
    return { place: [x, y, L], loose: SCATTER[ORDER[i]], grp, body, studs: STUDS.map(() => solid(grp)), tw: tween(0), drawn: NaN, key: 0 };
  });
  const cap = bricks[bricks.length - 1];
  cap.body.sil.classList.add("hi");

  /** A brick at t: 0 loose on the tray, 1 in its place; it hops on the way. Paths are rewritten only when t moves. */
  function draw(b, now) {
    const t = clamp(tval(b.tw, now), 0, 1);
    if (t === b.drawn) return;
    b.drawn = t;
    const [lx, ly, la] = b.loose, [px, py, L] = b.place;
    const x = lerp(lx, px, t), y = lerp(ly, py, t), a = lerp(la, 0, t), z = H + lerp(0, L * BH, t) + Math.sin(Math.PI * t) * LIFT;
    put(b.body, prism(P, front, pose(ring, x, y, a), pose(inner, x, y, a), z, z + BH));
    const c = Math.cos(a), s = Math.sin(a);
    b.studs.forEach((el, k) => {
      const [u, v] = STUDS[k], sx = x + u * c - v * s, sy = y + u * s + v * c;
      put(el, prism(P, front, pose(stud, sx, sy, 0), pose(studIn, sx, sy, 0), z + BH, z + BH + SH));
    });
    b.key = Math.round((z - H) / BH) * 1000 + x + y;
  }

  let order = "";
  /** Keeps the paint order: by layer, then back to front. Groups are moved only when the order changes. */
  function sortPaint() {
    const s = bricks.slice().sort((p, q) => p.key - q.key), sig = s.map((b) => bricks.indexOf(b)).join();
    if (sig === order) return;
    order = sig;
    s.forEach((b) => g.appendChild(b.grp));
  }

  const R = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bricks) { draw(b, now); if (!tdone(b.tw, now)) moving = true; }
    sortPaint();
    return moving;
  });
  bag.add(R.unregister);

  /** Builds or takes apart: a layer starts when the one before it has started its last brick, nearest the pointer first. */
  function go(on) {
    if (on === built) return;
    built = on;
    const now = performance.now();
    let base = 0;
    for (const L of on ? [0, 1, 2] : [2, 1, 0]) {
      const layer = bricks.filter((b) => b.place[2] === L);
      layer.sort((p, q) => Math.hypot(p.place[0] - at[0], p.place[1] - at[1]) - Math.hypot(q.place[0] - at[0], q.place[1] - at[1]));
      layer.forEach((b, k) => tset(b.tw, on ? 1 : 0, now, base + k * stag));
      base += (layer.length - 1) * stag + 140;
    }
    read.textContent = on ? "built" : "rest";
    R.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], H), on = q[0] > -8 && q[0] < X1 + 8 && q[1] > -8 && q[1] < Y1 + 8;
      if (on && !built) at = q;
      go(on);
    },
    leave: () => go(false),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pyramid",
  means: "Bricks scattered across a tray click together into a stepped pyramid when the pointer comes onto it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 90],
  mount,
});

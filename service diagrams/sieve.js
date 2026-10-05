/**
 * Sieve: an archaeologist's sifting screen, a wooden box frame with a wire mesh
 * floor and a handle at each end, standing on braced legs over a catch tray.
 * Soil pebbles and four finds lie on the mesh: a coin, a pottery shard, a cut
 * diamond and a bead; some soil has already fallen through. Where the pointer shakes the
 * mesh, the pebbles within reach drop through into the tray, spreading out from
 * the pointer, and the finds stay: the one nearest the pointer takes the bright
 * stroke. The slider is how far the shake reaches, in world units.
 *
 * The pattern: a field of discrete items. The pointer is put on the mesh plane,
 * which never moves; each pebble drops on its own tween, delayed by its distance
 * from the pointer. A pebble below the mesh is painted in the layer under it and
 * dims, so the mesh is drawn over it, as it is seen through the mesh.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, ringAt, rings, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

const FX = 62, FY = 42, WB = 4, ZB = 34, ZM = 35, ZT = 46;   // frame: half size, board thickness; base, mesh and top heights
const TX = 56, TY = 36, TH = 7, TF = 1.5;                    // catch tray: half size, height, floor
const RM = 2.6, STEP = 4, SPLAY = 11;                                     // pebble radius; stagger in ms per world unit
// the finds: [name, x, y, turn, outline, corner radii or crease ring, height]; the diamond is a cut gem, table up
const FINDS = [
  ["coin", -30, -12, 0.3, () => circ(5.5, 24), () => circ(4.5, 24), 1.6],
  ["shard", 18, -18, 0.5, () => [[-8, -5], [7, -7], [9, 4], [-5, 6]], [2.5, 2, 2.5, 2], 2.2],
  ["diamond", -8, 14, 0.39, null, "gem", 4.2],
  ["bead", 34, 12, 0, null, null, 5],
];
const FLOOR = [[-20, -26], [4, -28], [-40, -6], [26, -24], [-6, -12], [40, -10]];
const SOIL = [];
for (let k = 0; k < 40; k++) {
  const rr = Math.sqrt((k + 0.5) / 40), th = k * 2.39996, p = [rr * Math.cos(th) * 54, rr * Math.sin(th) * 34];
  if (FINDS.every((f) => Math.hypot(f[1] - p[0], f[2] - p[1]) > 11)) SOIL.push(p);
}
const rev = (a) => a.slice().reverse();
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : rev(pts));
/** The samples of a ring the camera does not face, and one more at each end, so the run meets its front half. */
const behind = (ring, front) => run(ring, (q) => { const i = ring.indexOf(q), n = ring.length; return !front(q) || !front(ring[(i + 1) % n]) || !front(ring[(i + n - 1) % n]); });
/** A closed outline as a ring, each sample given its outward normal. */
const toRing = (pts) => {
  const n = pts.length, sg = pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * p[1], 0) > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const q = pts[(i + 1) % n], o = pts[(i + n - 1) % n], tx = q[0] - o[0], ty = q[1] - o[1], l = Math.hypot(tx, ty) || 1;
    return { u: p[0], v: p[1], nu: (sg * ty) / l, nv: (-sg * tx) / l };
  });
};
/** A ring turned by a radians and moved to (x, y), normals turned with it. */
const pose = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null, last = [0, 0];
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-FX, -FY - 11, 0], [FX, FY + 11, 0], [FX, -FY - 11, 0], [-FX, FY + 11, 0], [-FX, -FY, ZT], [FX, -FY, ZT], [-FX - 18, 0, ZT], [FX + 18, 0, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x0, y0, x1, y1, z0, z1) => put(solid(g), prism(P, front, ...rings(x0, y0, x1, y1, 1.4, 0.6), z0, z1));
  /** A splayed leg, its foot SPLAY out across the frame's short side, so each end stands as an A: the hull of its top and its foot. */
  const leg = (x, y) => {
    const sq = (cx, cy) => rrect(cx - 2.5, cy - 2.5, cx + 2.5, cy + 2.5, 1.4, 4), sy = Math.sign(y);
    put(solid(g), { sil: poly(hull(ringAt(P, sq(x, y + sy * SPLAY), 0).concat(ringAt(P, sq(x, y), ZB)))), crease: "" });
  };

  // the catch tray: its far half, the soil below the mesh, then its near half
  const to = rrect(-TX, -TY, TX, TY, 4, 6), ti = rrect(-TX + 2.5, -TY + 2.5, TX - 2.5, TY - 2.5, 1.5, 6);
  mk("path", { d: poly(hull(ringAt(P, to, 0).concat(ringAt(P, to, TH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, ti, TH)), class: "nf" }, g);
  mk("path", { d: open(ringAt(P, run(ti, (q) => !front(q)), TF)), class: "nf lo" }, g);
  const below = mk("g", {}, g);
  const iF = LR(ringAt(P, run(ti, front), TH)), oT = LR(ringAt(P, run(to, front), TH)), oB = LR(ringAt(P, run(to, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...rev(oB), oT[0]]), class: "fo" }, g);
  mk("path", { d: open(iF), class: "nf" }, g);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, g);
  // in front of the tray: three legs (the fourth stands hidden under the frame) and the rail between the near pair
  leg(FX - 3, -FY + 3); leg(-FX + 3, FY - 3);
  const ry = FY - 3 + SPLAY * (1 - 10.5 / ZB);
  post(-FX + 5.5, ry - 1.2, FX - 5.5, ry + 1.2, 9, 12);
  leg(FX - 3, FY - 3);
  post(-FX - 18, -3.5, -FX + 1, 3.5, ZT - 6, ZT - 3);

  // the frame's far boards: their tops, the inside faces, then the mesh
  const fo = rrect(-FX, -FY, FX, FY, 3, 6), fi = rrect(-FX + WB, -FY + WB, FX - WB, FY - WB, 1, 6);
  const oFar = ringAt(P, behind(fo, front), ZT), iFar = behind(fi, front);
  mk("path", { d: poly(LR(oFar).concat(rev(LR(ringAt(P, iFar, ZT))))), class: "fo" }, g);
  mk("path", { d: poly(ringAt(P, iFar, ZT).concat(rev(ringAt(P, iFar, ZM)))), class: "fo" }, g);
  mk("path", { d: open(ringAt(P, iFar, ZM)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, iFar, ZT)), class: "nf lo" }, g);
  mk("path", { d: open(oFar), class: "nf sil" }, g);
  let mesh = "", MX = FX - WB, MY = FY - WB;
  for (let c = -MX + 5.5; c < MX; c += 5.5) mesh += "M" + P(c, -MY, ZM).join(",") + "L" + P(c, MY, ZM).join(",");
  for (let c = -MY + 5.5; c < MY; c += 5.5) mesh += "M" + P(-MX, c, ZM).join(",") + "L" + P(MX, c, ZM).join(",");
  mk("path", { d: mesh, class: "nf lo" }, g);
  const above = mk("g", {}, g);

  // the frame's near boards, over the front of the mesh, and the near handle
  const nI = LR(ringAt(P, run(fi, front), ZT)), nT = LR(ringAt(P, run(fo, front), ZT)), nB = LR(ringAt(P, run(fo, front), ZB));
  mk("path", { d: poly([...nI, nT[nT.length - 1], ...rev(nB), nT[0]]), class: "fo" }, g);
  mk("path", { d: open(nI), class: "nf lo" }, g);
  mk("path", { d: open(nT), class: "nf" }, g);
  mk("path", { d: open([nT[0], ...nB, nT[nT.length - 1]]), class: "nf sil" }, g);
  post(FX - 1, -3.5, FX + 18, 3.5, ZT - 6, ZT - 3);

  // pebbles and finds: a slot in each layer, back to front; pebbles move between layers as they cross the mesh
  const items = [];
  SOIL.forEach((p) => items.push({ p, kind: "soil", tw: tween(0) }));
  FLOOR.forEach((p) => items.push({ p, kind: "floor", tw: tween(1) }));
  FINDS.forEach((f) => items.push({ p: [f[1], f[2]], kind: "find", f }));
  items.slice().sort((a, b) => a.p[0] + a.p[1] - (b.p[0] + b.p[1])).forEach((it) => { it.up = mk("g", {}, above); it.down = mk("g", {}, below); });
  const finds = items.filter((it) => it.kind === "find"), soil = items.filter((it) => it.kind === "soil");
  for (const it of items) {
    if (it.kind !== "find") { it.el = mk("ellipse", { rx: RM * C.S, ry: RM * C.S }); it.drawn = NaN; continue; }
    const [, x, y, a, shape, crease, h] = it.f;
    if (crease === "gem") {
      // an eight-sided girdle resting on the mesh, tapering to its table, with a facet line from each front corner
      const girdle = pose(circ(6.8, 8), x, y, a), table = pose(circ(3.9, 8), x, y, a), gr = ringAt(P, girdle, ZM), tb = ringAt(P, table, ZM + h);
      const el = solid(it.up);
      put(el, { sil: poly(hull(gr.concat(tb))), crease: open(ringAt(P, run(table, front), ZM + h)) });
      mk("path", { d: girdle.map((q, k) => (front(q) ? "M" + tb[k].join(",") + "L" + gr[k].join(",") : "")).join(""), class: "nf lo" }, it.up);
      it.edge = el.sil;
      continue;
    }
    if (!shape) {
      it.edge = mk("ellipse", { rx: h * C.S, ry: h * C.S, class: "sil" }, it.up);
      place(it.edge, P(x, y, ZM + h));
      place(mk("circle", { r: 1.2, class: "dot off" }, it.up), P(x - h * 0.4, y - h * 0.4, ZM + h * 1.5));
      continue;
    }
    const ring = typeof crease === "function" ? shape() : toRing(fillet(shape(), crease, 4));
    const inner = typeof crease === "function" ? crease() : toRing(ring.map((q) => [q.u - q.nu * 1.1, q.v - q.nv * 1.1]));
    const el = solid(it.up);
    put(el, prism(P, front, pose(ring, x, y, a), pose(inner, x, y, a), ZM, ZM + h));
    it.edge = el.sil;
  }

  function draw(it, now) {
    const t = tval(it.tw, now);
    if (t === it.drawn) return;
    it.drawn = t;
    const z = lerp(ZM + RM, TF + RM, t), down = z < ZM;
    place(it.el, P(it.p[0], it.p[1], z));
    if (it.layer !== down) {
      it.layer = down;
      (down ? it.down : it.up).appendChild(it.el);
      it.el.classList.toggle("lo", down);
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) if (it.kind !== "find") { draw(it, now); if (!tdone(it.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const light = (i) => finds.forEach((it, k) => it.edge.classList.toggle("hi", k === i));
  light(2);

  /** Shakes the mesh at the pointer, or lets it settle: each pebble drops or rises after a delay set by its distance. */
  function retarget() {
    const now = performance.now(), at = over || last;
    for (const it of soil) {
      const d = Math.hypot(it.p[0] - at[0], it.p[1] - at[1]);
      tset(it.tw, over && d < reach ? 1 : 0, now, clamp(d * STEP, 0, 360));
    }
    if (over) {
      const dist = (it) => Math.hypot(it.p[0] - over[0], it.p[1] - over[1]);
      const k = finds.reduce((a, it, i) => (dist(it) < dist(finds[a]) ? i : a), 0);
      light(k);
      read.textContent = finds[k].f[0];
    } else { light(2); read.textContent = "rest"; }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], ZM);
      over = Math.abs(q[0]) < FX + 4 && Math.abs(q[1]) < FY + 4 ? q : null;
      if (over) last = over;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sieve",
  means: "An archaeologist's sieve: where the pointer shakes it, the soil falls through and the finds stay on the mesh.",
  rules: [1, 2, 3, 6],
  range: [24, 38, 56],
  mount,
});

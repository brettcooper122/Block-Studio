/**
 * Sieve: a round sieve with a mesh floor and a handle, sitting on a catch bowl.
 * Four big beads and a scatter of small ones lie on the mesh; a few small ones
 * have already fallen through. Where the pointer shakes the mesh, the small
 * beads within reach drop through into the bowl, spreading out from the
 * pointer, and the big beads stay: the one nearest the pointer takes the bright
 * stroke. The slider is how far the shake reaches, in world units.
 *
 * The pattern: a field of discrete items. The pointer is put on the mesh plane,
 * which never moves; each small bead drops on its own tween, delayed by its
 * distance from the pointer. A bead below the mesh is painted in the layer under
 * it and dims, so the mesh is drawn over it, as it is seen through the mesh.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, ringAt, rings, run, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

const RS = 60, RI = 58, ZB = 28, ZM = 30, ZT = 42;       // sieve: outer and inner radius; base, mesh and rim heights
const BT = 54, BF = 40, FZ = 4, FR = 37;                 // bowl: top and foot radius; floor height and radius
const RB = 7, RM = 3, STEP = 4;                           // big and small bead radii; stagger in ms per world unit
const BIG = [[-22, -20], [22, -12], [-4, 18], [-36, 14]];
const FLOOR = [[-12, -26], [6, -30], [-28, -10], [18, -22], [0, -14]];
const SMALL = [];
for (let k = 0; k < 30; k++) {
  const rr = 48 * Math.sqrt((k + 0.5) / 30), th = k * 2.39996, p = [rr * Math.cos(th), rr * Math.sin(th)];
  if (BIG.every((b) => Math.hypot(b[0] - p[0], b[1] - p[1]) > RB + RM + 3)) SMALL.push(p);
}
/** Where a small bead at (x, y) comes to rest in the bowl: the floor, or the sloping wall past it. */
const land = ([x, y]) => { const r = Math.hypot(x, y); return (r <= FR ? FZ : FZ + ((r - FR) / (BT - FR)) * (ZB - FZ)) + RM; };
const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rev = (a) => a.slice().reverse();
/** The samples of a ring the camera does not face, and one more at each end, so the run meets its front half. */
const behind = (ring, front) => run(ring, (q) => { const i = ring.indexOf(q), n = ring.length; return !front(q) || !front(ring[(i + 1) % n]) || !front(ring[(i + n - 1) % n]); });
/** The lower chain of a closed hull, from its leftmost point to its rightmost. */
function lower(H) {
  const L = H.reduce((a, q, i) => (q[0] < H[a][0] ? i : a), 0), R = H.reduce((a, q, i) => (q[0] > H[a][0] ? i : a), 0);
  const walk = (a, b) => { const out = []; for (let i = a; ; i = (i + 1) % H.length) { out.push(H[i]); if (i === b) return out; } };
  const A = walk(L, R), B = rev(walk(R, L)), mean = (c) => c.reduce((t, q) => t + q[1], 0) / c.length;
  return mean(A) > mean(B) ? A : B;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null, last = [0, 0];
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-RS, -RS, ZT], [RS, RS, ZB], [RS, -RS, ZT], [-RS, RS, ZB], [RS + 36, 0, ZT], [BF * 0.71, BF * 0.71, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = circ(RS, 64), inner = circ(RI, 64), bTop = circ(BT, 56), bFoot = circ(BF, 48);
  const g = mk("g", {}, svg);

  // the bowl, its floor seen through the mesh, and the layer of beads below the mesh
  const bh = hull(ringAt(P, bFoot, 0).concat(ringAt(P, bTop, ZB))), bl = lower(bh);
  mk("path", { d: poly(bh), class: "fo" }, g);
  mk("path", { d: open(ringAt(P, behind(bTop, front), ZB)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, circ(FR, 48), FZ)), class: "nf lo" }, g);
  const below = mk("g", {}, g);
  // the bowl's near face, over what lies inside it
  const bt = ringAt(P, run(bTop, front), ZB), lr = bt[0][0] < bt[bt.length - 1][0] ? bt : rev(bt);
  mk("path", { d: poly(lr.concat(rev(bl))), class: "fo" }, g);
  mk("path", { d: open(bl), class: "nf sil" }, g);

  // the sieve's far wall, seen from inside, then the mesh
  const fi = behind(inner, front);
  mk("path", { d: poly(ringAt(P, fi, ZT).concat(rev(ringAt(P, fi, ZM)))), class: "fo" }, g);
  mk("path", { d: open(ringAt(P, fi, ZM)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, fi, ZT)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, behind(outer, front), ZT)), class: "nf sil" }, g);
  let mesh = "";
  for (let c = -RI + 6; c < RI - 2; c += 7.25) {
    const h = Math.sqrt(RI * RI - c * c);
    mesh += "M" + P(c, -h, ZM).join(",") + "L" + P(c, h, ZM).join(",") + "M" + P(-h, c, ZM).join(",") + "L" + P(h, c, ZM).join(",");
  }
  mk("path", { d: mesh, class: "nf lo" }, g);
  const above = mk("g", {}, g);

  // the sieve's near wall, over the front of the mesh, and the handle with its hanging hole
  const ot = ringAt(P, run(outer, front), ZT), ob = ringAt(P, run(outer, front), ZB);
  mk("path", { d: poly(ot.concat(rev(ob))), class: "fo" }, g);
  mk("path", { d: open(ringAt(P, run(inner, front), ZT)), class: "nf lo" }, g);
  mk("path", { d: open(ot), class: "nf" }, g);
  mk("path", { d: open([ot[0], ...ob, ot[ot.length - 1]]), class: "nf sil" }, g);
  const [hr, hi] = rings(RS - 1, -5, RS + 36, 5, 5, 1.2);
  put(solid(g), prism(P, front, hr, hi, ZT - 5, ZT - 2));
  mk("path", { d: poly(ringAt(P, shift(circ(2.2, 16), RS + 29, 0), ZT - 2)), class: "nf lo" }, g);

  // beads: each has a slot in both layers, back to front, and moves between them as it crosses the mesh
  const beads = [];
  const add = (p, r, kind) => beads.push({ p, r, kind, el: mk("ellipse", { rx: r * C.S, ry: r * C.S }), tw: tween(kind === "floor" ? 1 : 0), drawn: NaN, layer: null });
  BIG.forEach((p) => add(p, RB, "big"));
  SMALL.forEach((p) => add(p, RM, "small"));
  FLOOR.forEach((p) => add(p, RM, "floor"));
  beads.slice().sort((a, b) => a.p[0] + a.p[1] - (b.p[0] + b.p[1])).forEach((b) => {
    b.up = mk("g", {}, above);
    b.down = mk("g", {}, below);
  });
  const big = beads.filter((b) => b.kind === "big"), small = beads.filter((b) => b.kind === "small");

  function draw(b, now) {
    const t = tval(b.tw, now);
    if (t === b.drawn) return;
    b.drawn = t;
    const z = lerp(ZM + b.r, b.kind === "big" ? ZM + b.r : land(b.p), t), down = z < ZM;
    place(b.el, P(b.p[0], b.p[1], z));
    if (b.layer !== down) {
      b.layer = down;
      (down ? b.down : b.up).appendChild(b.el);
      b.el.classList.toggle("lo", down);
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of beads) { draw(b, now); if (!tdone(b.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let lit = -1;
  function light(i) {
    if (i === lit) return;
    lit = i;
    big.forEach((b, k) => b.el.setAttribute("class", k === i ? "sil hi" : "sil"));
  }
  light(0);

  /** Shakes the mesh at the pointer, or lets it settle: each small bead drops or rises after a delay set by its distance. */
  function retarget() {
    const now = performance.now(), at = over || last;
    for (const b of small) {
      const d = Math.hypot(b.p[0] - at[0], b.p[1] - at[1]);
      tset(b.tw, over && d < reach ? 1 : 0, now, clamp(d * STEP, 0, 360));
    }
    if (over) {
      let k = 0;
      big.forEach((b, i) => { if (Math.hypot(b.p[0] - over[0], b.p[1] - over[1]) < Math.hypot(big[k].p[0] - over[0], big[k].p[1] - over[1])) k = i; });
      light(k);
      read.textContent = String(k + 1).padStart(2, "0");
    } else { light(0); read.textContent = "rest"; }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], ZM);
      over = Math.hypot(q[0], q[1]) < RS + 6 ? q : null;
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
  means: "A sieve over a bowl: where the pointer shakes it, the small beads fall through and the big ones stay on top.",
  rules: [1, 2, 3, 6],
  range: [24, 38, 56],
  mount,
});

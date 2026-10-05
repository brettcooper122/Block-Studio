/**
 * Lens: a magnifying glass over a research page, a sheet with a bar chart, a
 * table and lines of notes. At rest the glass hangs too high to focus: what it
 * shows is three faint copies of the page, offset, and its rim carries the
 * bright stroke. Brought over the page by the pointer, it glides there and
 * lowers to its focal height, the copies close into one, and the magnified
 * content takes the bright stroke, crisp. A dashed circle on the page marks the
 * spot under the glass. The slider is the magnification.
 *
 * The pattern: a field, through a lens. The pointer is put on the plane at the
 * glass's focal height, its target pose, which never moves; the glass follows
 * on springs, one per axis and one for focus. The magnified content is the
 * page's own lines, scaled about the lens centre and clipped to the glass.
 */
const {
  Cam, circ, clamp, facing, fit, lerp, poly, prism, proj, rings, ringAt, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const PW = 120, PH = 90, PT = 1.2, R = 21, RIM = 2.6, HF = 13, HH = 27, BLUR = 3.2, HLEN = 30;
const REST = [86, 30];
// the page's content, as segments on the sheet: [x1, y1, x2, y2], and the zone each belongs to
const LINES = [];
const add = (zone, x1, y1, x2, y2) => LINES.push([x1, y1, x2, y2, zone]);
[[0, 0, PW, 0], [PW, 0, PW, PH], [PW, PH, 0, PH], [0, PH, 0, 0]].forEach((s) => add("page", ...s));
add("chart", 10, 34, 110, 34);
[12, 19, 9, 23, 16, 21, 13, 25, 18].forEach((h, k) => {
  const x = 13 + k * 10.6;
  add("chart", x, 34, x, 34 - h); add("chart", x, 34 - h, x + 6, 34 - h); add("chart", x + 6, 34 - h, x + 6, 34);
});
for (let r = 0; r <= 6; r++) add("table", 10, 40 + r * 4, 110, 40 + r * 4);
for (const x of [10, 34, 56, 78, 110]) add("table", x, 40, x, 64);
[98, 84, 92, 70, 88, 52].forEach((w, k) => add("notes", 10, 69 + k * 3.6, 10 + w, 69 + k * 3.6));
const ZONE = (y) => (y < 4 || y > PH - 4 ? "page" : y < 38 ? "chart" : y < 67 ? "table" : "notes");

/** A segment clipped to the circle of radius r about c, or null if none of it is inside. */
function clip(ax, ay, bx, by, c, r) {
  const dx = bx - ax, dy = by - ay, fx = ax - c[0], fy = ay - c[1];
  const A = dx * dx + dy * dy, Bq = 2 * (fx * dx + fy * dy), Cq = fx * fx + fy * fy - r * r, disc = Bq * Bq - 4 * A * Cq;
  if (A === 0 || disc <= 0) return null;
  const s = Math.sqrt(disc), t0 = clamp((-Bq - s) / (2 * A), 0, 1), t1 = clamp((-Bq + s) / (2 * A), 0, 1);
  return t1 - t0 < 1e-3 ? null : [ax + dx * t0, ay + dy * t0, ax + dx * t1, ay + dy * t1];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let mag = value, hovering = false;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [PW + 4, PH + 4, 0], [PW + 4, -4, 0], [-4, PH + 4, 0], [REST[0] - R, REST[1] - R, HH + 3], [PW, PH - 20, HF], [PW + 12, 34, HH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the sheet, and its printed content, which never moves
  const [pr, pi] = rings(0, 0, PW, PH, 2.5, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, PT));
  const printed = (zone, cls) => mk("path", { d: LINES.filter((l) => l[4] === zone).map(([x1, y1, x2, y2]) => seg(P(x1, y1, PT), P(x2, y2, PT))).join(""), class: cls }, g);
  printed("chart", "nf"); printed("table", "nf lo"); printed("notes", "nf lo");

  // the glass: the spot under it, then its rim, the glass itself, what it shows, and the handle
  const spot = mk("path", { class: "nf dash" }, g);
  const rim = solid(g), glass = mk("path", {}, g);
  const copies = [mk("path", { class: "nf lo" }, g), mk("path", { class: "nf lo" }, g), mk("path", { class: "nf lo" }, g)];
  const handle = solid(g);
  const sx = spring(REST[0]), sy = spring(REST[1]), focus = spring(0);
  const ring = (r, n, c) => circ(r, n).map((q) => ({ ...q, u: q.u + c[0], v: q.v + c[1] }));
  let drawn = "";

  function draw() {
    const c = [sx.x, sy.x], f = clamp(focus.x, 0, 1), h = lerp(HH, HF, f), z = h + 2, b = BLUR * (1 - f);
    const key = [c[0], c[1], f, mag].map((v) => v.toFixed(3)).join();
    if (key === drawn) return;
    drawn = key;
    spot.setAttribute("d", poly(ringAt(P, ring(R + RIM, 40, c), PT)));
    put(rim, prism(P, front, ring(R + RIM, 56, c), ring(R + 0.8, 56, c), h, z));
    glass.setAttribute("d", poly(ringAt(P, ring(R, 56, c), z)));
    // the page under the glass, scaled about its centre and clipped to it; out of focus, three offset copies
    const offs = b < 0.15 ? [[0, 0]] : [[b, 0], [-b / 2, b * 0.87], [-b / 2, -b * 0.87]];
    copies.forEach((el, k) => {
      const o = offs[k];
      if (!o) { el.setAttribute("d", ""); return; }
      let d = "";
      for (const [x1, y1, x2, y2] of LINES) {
        const q = clip(c[0] + (x1 - c[0]) * mag + o[0], c[1] + (y1 - c[1]) * mag + o[1], c[0] + (x2 - c[0]) * mag + o[0], c[1] + (y2 - c[1]) * mag + o[1], c, R - 0.6);
        if (q) d += seg(P(q[0], q[1], z), P(q[2], q[3], z));
      }
      el.setAttribute("d", d);
    });
    const sharp = f > 0.9;
    copies[0].setAttribute("class", sharp ? "nf hi" : "nf lo");
    rim.sil.classList.toggle("hi", !sharp);
    // the handle runs out from the rim toward the viewer's right
    const [hr, hi] = rings(c[0] + R + RIM - 1, c[1] - 2.6, c[0] + R + RIM + HLEN, c[1] + 2.6, 2.6, 0.9);
    put(handle, prism(P, front, hr, hi, h + 0.4, z - 0.2));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of [sx, sy, focus]) if (stepS(s, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const q = unproj(C, p[0], p[1], HF + 2);
      hovering = q[0] > -10 && q[0] < PW + 10 && q[1] > -10 && q[1] < PH + 10;
      if (hovering) {
        sx.t = clamp(q[0], 8, PW - 8); sy.t = clamp(q[1], 8, PH - 8); focus.t = 1;
        read.textContent = ZONE(sy.t);
      } else { sx.t = REST[0]; sy.t = REST[1]; focus.t = 0; read.textContent = "rest"; }
      B.wake();
    },
    leave: () => { hovering = false; sx.t = REST[0]; sy.t = REST[1]; focus.t = 0; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { mag = v; drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "lens",
  means: "A magnifying glass over a research page: blurred at rest, it comes into focus wherever the pointer brings it.",
  rules: [1, 3, 5, 8],
  range: [1.3, 1.6, 2.1],
  mount,
});

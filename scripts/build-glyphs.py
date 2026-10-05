"""Block glyph generator for the services section.

Each glyph is drawn on a 6x6 grid of 16-unit cells. The script traces the outline of the filled
cells, rounds the outer (convex) corners by a quarter of a cell and keeps the inner (concave)
corners sharp, so the cells fuse into one piece. A "D" cell is drawn separately as a loose piece
with a square base, for glyphs where it moves.

Run from the repo root:  python3 scripts/build-glyphs.py
"""
CELL, R = 16, 4

def outline(cells):
    edges = {}
    for (c, r) in cells:
        x, y = c, r
        for a, b in [((x, y), (x+1, y)), ((x+1, y), (x+1, y+1)), ((x+1, y+1), (x, y+1)), ((x, y+1), (x, y))]:
            if (b, a) in edges: del edges[(b, a)]
            else: edges[(a, b)] = True
    nxt = {}
    for a, b in edges: nxt.setdefault(a, []).append(b)
    assert all(len(v) == 1 for v in nxt.values()), "cells touch only at a corner somewhere"
    nxt = {a: v[0] for a, v in nxt.items()}
    loops, seen = [], set()
    for start in nxt:
        if start in seen: continue
        loop, p = [], start
        while p not in seen:
            seen.add(p); loop.append(p); p = nxt[p]
        # drop collinear points
        pts = []
        n = len(loop)
        for i in range(n):
            a, b, c = loop[i-1], loop[i], loop[(i+1) % n]
            if (b[0]-a[0])*(c[1]-b[1]) - (b[1]-a[1])*(c[0]-b[0]) != 0: pts.append(b)
        loops.append(pts)
    return loops

def path(cells):
    out = ""
    for pts in outline(cells):
        n = len(pts); seg = []
        for i in range(n):
            a, b, c = pts[i-1], pts[i], pts[(i+1) % n]
            d1 = ((b[0]-a[0]), (b[1]-a[1])); d2 = ((c[0]-b[0]), (c[1]-b[1]))
            u1 = (d1[0] and d1[0]//abs(d1[0]), d1[1] and d1[1]//abs(d1[1]))
            u2 = (d2[0] and d2[0]//abs(d2[0]), d2[1] and d2[1]//abs(d2[1]))
            bx, by = b[0]*CELL, b[1]*CELL
            if u1[0]*u2[1] - u1[1]*u2[0] > 0:  # convex: round it
                p1 = (bx - u1[0]*R, by - u1[1]*R); p2 = (bx + u2[0]*R, by + u2[1]*R)
                seg.append(("L", p1)); seg.append(("A", p2))
            else:
                seg.append(("L", (bx, by)))
        d = f"M{seg[-1][1][0]:g} {seg[-1][1][1]:g}" if seg[-1][0] == "A" else f"M{seg[-1][1][0]:g} {seg[-1][1][1]:g}"
        for kind, (x, y) in seg:
            d += f"L{x:g} {y:g}" if kind == "L" else f"A{R} {R} 0 0 1 {x:g} {y:g}"
        out += d + "Z"
    return out

def drop_path(cells):
    """The falling cell: rounded on top, square underneath, so it sits flush when it lands."""
    out = ""
    for (c, r) in cells:
        x, y, s, k = c*CELL, r*CELL, CELL, R
        out += f"M{x} {y+k}A{k} {k} 0 0 1 {x+k} {y}H{x+s-k}A{k} {k} 0 0 1 {x+s} {y+k}V{y+s}H{x}Z"
    return out

def build(grid, name):
    cells = lambda ch: [(c, r) for r, row in enumerate(grid) for c, k in enumerate(row) if k == ch]
    block, drop = path(cells("X")), drop_path(cells("D"))
    size = len(grid) * CELL
    svg = f'<svg viewBox="0 0 {size} {size}" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path class="badge__glyph-fill" d="{block}"/>\n'
    if drop: svg += f'<path class="badge__glyph-fill glyph__drop" d="{drop}"/>\n'
    open(name, "w").write(svg + "</svg>\n")

GLYPHS = {
    # 01 UX Design & Development: "the last piece", a block with one gap and a cell dropping in
    "src/assets/glyphs/glyph-01-last-piece.svg": [
        "...D..",
        "......",
        ".XX.XX",
        "XXXXXX",
        "XXXXX.",
        ".XXX..",
    ],
}

if __name__ == "__main__":
    for name, grid in GLYPHS.items():
        build(grid, name)
        print("wrote", name)

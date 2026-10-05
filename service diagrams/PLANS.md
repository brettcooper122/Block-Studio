# Hairline service figures: prompts and plans

One interactive Hairline figure per service, built with the `hairline-create` skill. Each one is a single HTML file (`hairline-<name>.html`) in this folder, built from `<name>.js`. They are built one at a time, and each waits for Brett's approval before the next starts.

House rules that apply to all four (from the skill's ten rules):

- Grey line work only. One bright stroke marks the active part. No fills, no colour, no glow, so Block Studio orange stays outside the figures.
- No words, numbers or icons inside the drawing. Names go to the small read-out in the corner.
- At rest, each figure is already a composed picture with one bright mark, since the still frame is the thumbnail.
- The figure has to be recognisable at 240px wide.
- One idea per figure. The slider changes one number.

Order of work: 01 Marble run → 02 Sieve → 03 Pyramid → 04 Guide rails.

---

## 01 · Marble run

**Service:** Agentic End-to-End UX Design & Development

**Prompt:**

```
/hairline-create a hand-cranked marble run for a design-and-build service where the same hands take work from sketch to shipped code with no handoff: one unbroken zigzag track, marbles always rolling; hovering slows the run so one marble can be followed
```

**The metaphor:** one continuous track from top to bottom, and nothing ever waits at a gap between owners. The crank is the same pair of hands that lifts every marble back to the top.

**The object and what gives it away:**

- An upright wooden backboard standing on a base plate.
- Three sloped ramps zigzagging down the face of the board. Each one is a plank with a groove along its top.
- A return groove along the base, a vertical lift channel up the right side, and a small crank wheel with a handle on the side of the base.
- Seven marbles. Each one is a round outline with a small glint dot.

**What the pointer does:** this is Hairline's "dilate time" pattern. The run is always moving. Hovering over it springs the speed down so a marble can be followed. The pointer picks the nearest ramp (or the lift), tested against where the ramps sit, which never moves. When the picked ramp changes, the marble on that ramp nearest the pointer takes the bright stroke and keeps it as it travels round. Leaving springs the speed back up, and the bright mark returns to the lead marble.

**Rest:** marbles spread along the whole loop, one on every ramp, the lift carrying one up. One bright marble shows where the eye should start. Under reduced motion the run holds still as a composed frame.

**Read-out:** `ramp 1`, `ramp 2`, `ramp 3`, `lift`, `rest`.

**Slider:** how slow the run gets while hovered, as a share of full speed: `0.6 / 0.3 / 0.1`.

**Rules it leans on:** 01 hit, 04 accent, 05 rest, 08 clock (a spring on the speed).

---

## 02 · Sieve

**Service:** Creative Strategy

**Prompt:**

```
/hairline-create an archaeologist's sifting screen on a stand over a catch tray, for a research service that finds the right problem before a build: soil and a few finds on the mesh; where the pointer shakes it, the soil drops through and the finds stay on top
```

**The metaphor:** research shakes out the noise, and what stays on the mesh is the find worth building on.

**The object and what gives it away:**

- A rectangular wooden box frame with a wire mesh floor and a handle at each end.
- A sawhorse stand: legs splayed across the short side so each end stands as an A, with a rail between the near legs.
- A catch tray on the ground underneath, where fallen soil collects.
- Soil pebbles, and four finds with their own shapes: a coin, a pottery shard, a cut diamond and a bead.

**What the pointer does:** this is the "field" pattern. The pointer is projected onto the mesh. Pebbles within reach drop through into the tray, staggered outwards from the pointer. Under the mesh they dim, as they are seen through it. The finds stay, and the one nearest the pointer takes the bright stroke. Leaving brings everything back to the rest pose.

**Rest:** soil across the mesh, some already in the tray, and the diamond bright.

**Read-out:** the find nearest the pointer, `coin`, `shard`, `diamond` or `bead`, and `rest`.

**Slider:** how wide the shake reaches, in world units: `24 / 38 / 56`.

**Rules it leans on:** 01 hit, 02 order, 03 reach, 06 honesty (soil seen through the mesh, hidden by the boards and the tray walls).

First built as a round kitchen sieve on a bowl; reworked into the archaeological sieve on Brett's call, as a more distinctive object.

---

## 03 · Pyramid

**Service:** Rapid Pattern Generation & System Scaling

**Prompt:**

```
/hairline-create LEGO-style studded bricks scattered across a flat tray, for a design-system service that turns loose parts into a system that scales: when the pointer comes onto the tray, the bricks hop up and click together into a stepped pyramid, layer by layer
```

**The metaphor:** the same few standard parts, combined by a clear system, become one solid structure that can keep growing. Replaced the first concept (Snap tray, an organiser tray with slots) on Brett's call, because building reads closer to pattern generation than tidying does.

**The object and what gives it away:**

- The same flat tray as the first concept, with its rounded rim and finger notch, and no slots.
- Fourteen 2×2 bricks, each with four studs on top, so they read as LEGO at a glance.
- Built, they form a stepped pyramid: 3×3, then 2×2, then a capstone, each layer offset by one stud.

**What the pointer does:** this is the "one of many" pattern. Coming onto the tray builds the pyramid. Each brick hops, turns square and clicks into place on its own 700ms tween. The bottom layer goes first, then the next, so nothing is placed on air. Within each layer the bricks start from the one nearest the pointer. Leaving takes the pyramid apart from the top.

**Rest:** the bricks lie scattered and turned across the tray, with the centre clear where the pyramid will stand. The capstone carries the bright stroke: loose at the front at rest, on top when built.

**Read-out:** `built`, and `rest`.

**Slider:** the stagger between bricks, in ms: `0 / 40 / 90`.

**Rules it leans on:** 01 hit, 02 order, 05 rest, 06 honesty (paint order kept by layer, then depth, as bricks move).

---

## 04 · Guide rails

**Service:** Self-Serve System Enablement & Brand Continuity

**Prompt:**

```
/hairline-create a conveyor belt with guide rails for a service that gives a team the tools to stay on brand without the studio: blocks ride the belt, enter crooked, and come out square through a funnel of rails; hovering slows the belt so one block can be watched
```

**The metaphor:** the rails do the correcting, with nobody standing at the belt. Whatever goes in, on brand comes out.

**The object and what gives it away:**

- A belt with slats across its surface that move with it, a roller showing at each end, on four legs.
- A hooded intake at the start, where blocks come out turned and off centre, and a bin at the end that they tip into.
- Two guide rails that narrow into a funnel partway along.
- Plain cube boxes riding the belt. (A dot code on each lid was tried first; Brett preferred plain cubes.)

**What the pointer does:** the same "dilate time" pattern as 01, with a different object. The belt always runs. Hovering springs the speed down. The pointer picks a fixed station along the belt, and the block nearest that station takes the bright stroke and keeps it until the pointer leaves. Before the funnel, blocks sit rotated and off-centre. The rails turn them square and centred as they pass.

**Rest:** a line of blocks crooked at the far end and square at the near end, the funnel between them. One bright block has just come out square.

**Read-out:** the number of the block being followed, `03`, and `rest`.

**Slider:** how slow the belt gets while hovered: `0.6 / 0.3 / 0.1`.

**Rules it leans on:** 01 hit, 04 accent, 05 rest, 10 quiet.

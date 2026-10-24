# Plan Atlas — code, deployment and drawing review

> Stair update: the two-flight front-stair interpretation, projection readings and feasibility conclusions below are historical and superseded by [STAIR_CORRECTION.md](docs/STAIR_CORRECTION.md). Both front stairs now use three flights and two landings.

> **Status: all findings addressed.** §§4–10 were fixed first (README → "Review round 3"), then the four
> items that had been deferred — walkthrough stair traversal, camera fitting, glTF export and the full
> data-driven refactor of §11 — were completed (README → "Round 4"). The one recommendation **not** taken is
> the three.js r170 → r186 bump: upstream split the package and stopped publishing a minified build, so
> shipping r186 would be 7% larger *and* would cost the byte-for-byte provenance of the vendored files.
> That trade-off is documented with measurements in README → "Still on r170, and why", and the provenance
> property is now enforced by `scripts/check-vendor.mjs` and a CI `cmp` against npm.
>
> This document is kept as the review record, written against `main` at `2e4e460`, so the reasoning behind
> each change stays readable.

**Scope:** `modhack2003/CAD` at `2e4e460` (main) and the production deployment
<https://cad-alpha-two.vercel.app/>, cross-checked against the two reference photographs of drawings
**218129 (Plan A)** and **218124 (Plan B)**.

**Method:** full read of `dist/app.js`, `dist/plans.js`, `dist/style.css`, `dist/index.html`,
`dist/mobile-ui.js`, `scripts/dev.mjs`, `tests/*`, `vercel.json`; `npm ci` and `npm test` run locally (both
pass on Node 22); the live deployment driven in headless Chromium at 1280×720 and 390×844 with console, DOM,
layout, glyph-rasterisation and contrast probes. WebGL was available via SwiftShader, so the 3D path was
exercised for real.

> **Note on overlap with the open PR.** PR #3 (`codex/two-plan-audit`, opened 23 Oct 2026) already fixes a
> substantial share of what this review found, and its `docs/PLAN_AUDIT.md` registers 30 findings. To stay
> useful, §3 below lists only what PR #3 **has already fixed** (do not re-report these), and §§4–10 list only
> what is **still open on both `main` and the PR branch**. Every "still open" item was re-verified against
> `codex/two-plan-audit`, not just against `main`.

---

## 1. What is genuinely good

Worth stating first, because the list below is long.

- **Zero runtime dependencies, no build step.** `npm ci` installs nothing, `three` is vendored with its MIT
  licence, and the dev server is 20 lines with a correct path-traversal guard. Deploys are reproducible.
- **Unusually honest about its own uncertainty.** Every inferred dimension is marked. The first floor is
  labelled "assumed repeat" in the UI, the SVG, the OBJ header *and* the JSON export. The projection conflict
  is carried into the exports rather than quietly resolved. This discipline is rare in concept models.
- **The regression suite tests real geometry**, not snapshots: ray-casting that the upper door leaf lands on
  slab, that cut planes are shared between leaf and frame, that stair voids block walking, that OBJ face
  indices are in range, that the model survives rebuilds at both height extremes.
- **The reference photograph stays local** — object URL, per-plan, never uploaded, `.gitignore`d.
- **The WebGL-absent fallback actually works**: 2D plan plus all exports, with 3D-only controls disabled.
- **The mobile CSS is thought through**: safe-area insets, 44 px targets, a focus-trapped drawer with Escape
  and backdrop dismissal, landscape and display-cutout handling.
- **The deployment matches the repo byte-for-byte** (verified for all six assets) with `nosniff`,
  `Referrer-Policy` and HSTS set.

---

## 2. Summary

| Area | Verdict |
|---|---|
| Drawing fidelity | Good intent; **5 transcription/geometry issues remain**, incl. a likely digit transposition |
| 3D model correctness | Solid; **dimension layer is duplicated and its labels are unreachable** |
| Buildability | **Plan A's stairwell cannot be built**; single-stair Plan B needs an egress answer |
| Performance | **Renders every frame forever**; ships a 1.3 MB unminified three.js with no cache headers |
| Accessibility | **Keyboard users cannot operate the 3D view at all**; 14/17 text styles fail WCAG AA |
| 2D plan / CAD output | Much improved by PR #3, but **no DXF, no dimension chains, no scale bar, no print** |
| Deployment hygiene | **No favicon (404 on every load), no CSP, no OG tags, no CI** |
| Architecture | Two forked renderers; the root cause of the drift PR #3 had to fix |

---

## 3. Already fixed in open PR #3 — do not re-report

Verified present on `codex/two-plan-audit`:

| Finding | How it was fixed |
|---|---|
| Plan A's 2D plan drew a **phantom column** at grid (12.72, 3.28) that was absent from the 3D model and the collision set — the grid literal existed in three places and one lacked the exclusion | `columnPoints()` → `planColumns(plan)`, single-sourced across `build()`, `svgPlan()` and `canWalk()`; zero literals remain |
| Plan B's column grid ignored the printed bay chains | Bays now 5.245 / 5.250 / 5.245 m and 4.200 / 4.551 / 4.200 m, with four inferred 250 mm columns reconciling them to the printed main-block dimensions |
| `focusRoom()` left a permanent inline `font-size: 11px` on the hero stats, surviving plan switches *and* "Reset workspace" | `style.fontSize=''` reset added |
| Plan B's rear room, three WCs and front-left room were modelled approximately despite readable printed dimensions | Now 2.4384 × 3.6576 m, 1.2192 × 1.8288 m and a corrected 6.000 × 2.450 m |
| 2D plan could not be zoomed or panned — `zoom()` only showed a toast | Bounded 1–8× zoom with drag, pinch, wheel and keyboard, plus a working Fit |
| SVG plan showed openings as bare gaps with no door symbols | Door-swing indicators and glazing spans generated from the real opening definitions |
| Plan A SVG contained an unescaped `&` and could fail as standalone XML | Escaped; both exports now parsed with an XML parser |
| `clearMeasure()` leaked marker and line materials | Geometry **and** materials disposed |
| Mode/floor toggles exposed selection through CSS only | `aria-pressed` added; unsupported choices disabled |
| Walking passed through stairs, door leaves, foyer columns and furniture | Collisions added for all four; room shortcuts now seek a clear destination |
| Layer/style controls looked usable in 2D but did nothing | 3D-only controls disabled in plan mode |
| Stair feasibility was buried in general assumptions | Live rise/tread/landing values shown beside the controls and included in the JSON spec |

---

## 4. Still open — verified bugs

### 4.1 The dimension layer is built twice and its labels are unreachable

Two separate defects that compound.

**Duplication.** The dimension group is created *inside* the `for (let level = 0; level < 2; level++)` loop, so
both storeys carry an identical set (`g.userData.dims = dims`, one occurrence, inside the loop — unchanged in
PR #3). With floors assembled the lines are coincident and z-fight; with "Separate floors" the upper set floats
in mid-air. Visible in the Plan B cutaway capture: **"13.951 m" and "16.740 m main block" each appear twice**,
one pair hovering a storey above the other.

**Unreachable labels.** On `main`, the label gate excludes exterior:

```js
const show = l.g.visible && state.mode !== 'walk' && state.mode !== 'plan'
          && (l.kind === 'dim' ? state.dimensions : state.labels)
          && state.mode !== 'exterior';
```

Measured live in Exterior with Dimensions on: 6 dim labels in the DOM, **0 visible** — the ground lines render
without their values. PR #3 then adds `$('labelLayer').hidden = state.mode !== 'cutaway'`, which makes this
**worse**: labels and dimension values are now suppressed in Exterior **and** in Bird's-eye, **Top** and
**Front** — the orthographic elevation and plan views are precisely where dimensions are wanted. The dimension
*lines* still draw, so the Top view shows witness lines with no numbers.

Dimension labels also skip the occlusion test (`blocked = l.kind !== 'dim' && …`), so they render *through* the
building — the ground-floor width label draws over the facade that hides it.

**Fix:** build dimensions once in a floor-independent group; allow dim labels in all orthographic/exterior
camera views; include them in the depth test.

### 4.2 Room labels for both storeys compete for the same screen space

With "Both" levels selected, `l.g.visible` is true for both groups. In the Plan B cutaway, `ENTRY` (level 0)
and `STAIR LANDING` (level 1) land ~50 px apart and the overlap suppressor silently drops
**`PLAN B · MAIN HALL`** — the most important label on screen — because suppression is first-come by iteration
order. Prioritise by importance, and suppress labels for storeys the camera is not looking at.

### 4.3 Desktop walk mode: overlapping and unreachable chrome

The rule that hides the camera toolbar and hero card in walk mode sits at line 24 of `style.css`, **inside the
`@media(max-width:760px)` block** — on the PR branch too. Desktop gets neither.

| Element | Rect (1280×720, walk mode) | Problem |
|---|---|---|
| `.view-tools` | x 302, y 213, 47×317 | Still shown |
| `.walk-hint` | x 304, y 484, 230×54 | **Completely covers the last toolbar button** (x 308, y 482, 35×42) |
| `#spaceCard` | x 964, y 378, 290×256 | Covers the right third of the first-person view |

The rotate button is unreachable in walk mode on desktop. Promote both `main[data-mode=walk]` rules out of the
media query.

### 4.4 Plan B has no hall or room furniture

`furniture()` — desks, chairs, hall benches, wash counter — is called only from the Plan A branch;
`buildFloorB()` adds sanitary fixtures only (`grep -c "Hall bench"` → 1, Plan A's). So in Plan B the
"Fixtures & furniture" toggle appears dead: the hall, the 8′×12′ room and both front rooms are empty boxes.
Since PR #3 made furniture a *collision* surface, this also means the two plans have materially different
walkthrough behaviour. Share the furniture layer or disable the toggle for B.

### 4.5 Plan B has a sealed room with no fixture

`planBPartitions()` creates four cells in the toilet block; `buildFloorB()` places three WC pedestals. The cell
at x 1.3532–2.7124, z 5.7604–7.7292 gets a door off the hall and nothing inside — a ~1.36 × 1.97 m unlabelled
closet that is not on drawing 218124. Still present on the PR branch.

Separately, the first WC cell's only door is on `z = 3.79` at x 0.4–1.15, which means **it is entered through
the 8′×12′ room**, not from the lobby side the drawing implies.

### 4.6 Dead and redundant code

- `#error` is declared in `index.html` and styled in `style.css`, but **nothing ever writes to it**
  (`grep -c "\$('error')"` → 0). The WebGL fallback uses a toast. Remove it or wire it up.
- `sun.intensity` is assigned twice in the same handler; the first (`evening ? 2 : 3.1`) is immediately
  overwritten by `evening ? .7 : 3.1`.
- `update()` syncs cut-material colour/map/wireframe inside `floors.forEach(g => g.traverse(…))`, then repeats
  the **same work** in a second `floors.forEach(g => g.traverse(…))` immediately after — a full double traversal
  of 745 meshes on every state change.
- `localDrawingURL` is assigned but only ever read through `drawingURLs[plan.id]`.
- On the PR branch, `state.mode !== 'exterior'` in the label gate is now dead, superseded by the
  `labelLayer.hidden` check.

---

## 5. Still open — drawing fidelity

Dimensions read off photographs, so treat printed values as "verify on site". But each discrepancy below is
internal to the app and resolvable.

### 5.1 The Plan A front projection looks like a digit transposition

`index.html` and `plans.js` both state **3.773 m / 12′4½″**. The drawing's annotation reads
**3722.57 [12′-2½″]** — i.e. **3.7226 m**. 3.773 m converts to exactly 12′4½″, so the app's conversion is
self-consistent; the *source* value looks like `3772` read in place of `3722`. A 50 mm error that propagates
into `extension`, the slab outline, the SVG, the OBJ and the JSON.

PR #3 keeps `extension: 3.773` and its audit still records the left annotation as "approximately 3.773 m", so
this is unaddressed in both branches. Worth re-reading that one annotation on the original.

### 5.2 The same building is modelled at two different widths

| | Printed | App |
|---|---|---|
| Plan A (218129) | 18540 site; hall 54′1″ | `width: 16.94` — **inferred** as 16.4846 + 2 × 230 mm |
| Plan B (218124) | **16740 [54′-11″]** main block | `width: 16.74` — printed |

Both drawings are the same building: identical 18540, 13951, 9525, 15978 and 3722.57 annotations. Once 16.740 m
is known from 218124, Plan A's inference is superseded — yet the app ships two models 200 mm apart and shows
"16.94 m" vs "16.74 m" as BLOCK WIDTH. PR #3's audit lists "Plan A overall width — need a clear outer-building
width", but the answer is arguably already on the second drawing.

More importantly, **the two printed values genuinely conflict and that conflict is never surfaced**: 16.740 m
outer with 230 mm walls gives a 16.28 m (53′5″) clear hall, not the printed 54′1″ (16.485 m). The much smaller
4.600-vs-3.773 projection conflict is flagged prominently in the UI, SVG and JSON; this larger one is not
flagged anywhere.

### 5.3 Plan A's toilet compartments are still modelled oversize

PR #3 corrected Plan B's compartments to printed clear sizes but left Plan A's partition coordinates untouched
(`3.58 / 4.82 / 1.64 / 3.28 / 9.38` — unchanged).

| Compartment | Printed | Modelled | Δ |
|---|---|---|---|
| Left upper | 3′11″ × 4′10″ (1.194 × 1.473) | 1.24 × 1.49 | +46 / +17 mm |
| Left lower | **3′11″ × 2′10″** (1.194 × 0.864) | 1.24 × 1.64 | +46 / **+776 mm** |
| Right (×2) | 3′7″ × 4′10″ (1.092 × 1.473) | 1.25 × 1.64 | +158 / +167 mm |

Two issues. The partitions sit on round numbers rather than printed sizes — and the **left lower toilet on
218129 reads 2′10″, not 4′10″**. `plans.js` still lists `['Left toilets (×2)','3′11″ × 4′10″']`, collapsing two
differently sized compartments into one reading, so the UI shows the user a printed value the drawing does not
contain and the geometry does not honour.

### 5.4 Plan A omits the drawing's BASIN & URINAL zone

Drawing 218129 labels **"BASIN & URINAL"** down the right of the service strip, beside a "3′-2″ WD. PASS."
Plan A models that area as a wash counter with three basins and taps — **no urinals at all**
(`grep -c "Urinal fixture"` → 1, and that one is Plan B's) — and both the room list and the SVG call it simply
"WASH". Plan B correctly models a separate urinal zone, so Plan A is missing a fixture type its own drawing
names. Not in PR #3's register.

---

## 6. Still open — buildability

The app presents a banquet hall (assembly occupancy), G+1, so these matter more than for an abstract model.

### 6.1 The Plan A stairwell cannot accommodate a stair

`stairs()` fits 2 flights × 10 risers into the stairwell footprint:

```js
const n = 10, run = (depth - .88) / n;   // riser = state.height / 20
```

| Stair | Footprint | Riser @ 3.3 m | Going | Verdict |
|---|---|---|---|---|
| Plan A front | 2.18 × 2.60 | 165 mm | **172 mm** | unusable — needs ≥ 250 mm |
| Plan A rear (L) | 1.25 / 2.30 legs | 165 mm | **185 / 230 mm** | too steep |
| Plan B front | 3.45 × 3.85 | 165 mm | ~247–297 mm | plausible ✔ |

A 165 mm riser with a 172 mm going is not a stair anyone can walk down; Plan A's 2.60 m well is roughly 1.2 m
too short for the storey. Independently, the riser is derived from the height slider while the footprint is
fixed — at the 4.5 m end the riser becomes **225 mm**, over any code maximum. So the stair is non-compliant
across the entire slider range.

PR #3 helpfully **surfaces** these numbers live in the UI and the JSON (finding #28), and shortened Plan B's
flight for landing clearance (#8) — but the Plan A geometry is unchanged. Surfacing is the right first step;
the next one is either enlarging the well or rendering the stair as an explicitly diagrammatic volume so nobody
measures it off the 3D view.

### 6.2 Egress and accessibility questions worth surfacing in the UI

- **Plan B has a single stair** serving a ~170 m² first-floor assembly space. A second, remote means of egress
  is normally required; Plan A's rear stair provides it, Plan B drops it.
- **No lift, ramp or platform lift** in either plan — there is no accessible route to the first floor of a
  public venue.
- The assumed first floor inherits four toilets, none modelled as accessible (1.5 m turning circle, grab rails).
- No roof access is modelled (a test asserts its absence), yet the roof slab is continuous with a parapet.

PR #3's register notes that accessible facilities and evacuation routes "are not established by either
drawing", which is fair. The suggestion here is narrower: an app this careful about *dimensional* honesty should
flag the single-stair and no-lift conditions with the same prominence as the dimensional caveats, because a
viewer sees two usable storeys.

### 6.3 There is no interior lighting at all

The whole scene has four light sources: one `HemisphereLight`, two `DirectionalLight`s, and exterior garden
`PointLight`s. **Nothing is inside the building** — unchanged on the PR branch. "Walk inside" + "Evening"
therefore yields a flat grey-olive interior lit only by ambient hemisphere light. For a banquet hall, where the
lighting *is* the product, a few emissive ceiling fittings plus interior point lights would transform the
feature the UI leads with.

---

## 7. Still open — performance

### 7.1 The renderer never idles

```js
function animate(now){ requestAnimationFrame(animate); … renderer.render(scene, activeCamera); }
```

745 meshes with soft shadows (2048² map on desktop) are re-rendered every frame forever, whether or not
anything changed. On a phone that is continuous GPU draw and battery burn for a static image. Standard fix:
render on demand — on `controls.change`, while damping settles, while auto-rotate or walk input is active, and
once after any `update()`.

### 7.2 The height slider rebuilds the entire model per input event

```js
$('height').oninput = e => { state.height = Number(e.target.value); build(); … };
```

`build()` disposes every geometry, clears the model, re-extrudes both slabs, re-walls both storeys, rebuilds the
roof **and** rebuilds the whole garden. One drag fires dozens of input events, each doing all of that
synchronously on the main thread. Debounce to `requestAnimationFrame`, or scale storey height without a full
teardown.

### 7.3 Label occlusion ray-casts the whole scene

Every 120 ms each label ray-casts against `[model, ceilingGroup]` — brute force over all 745 meshes, no BVH, no
bounding-sphere pre-pass. Cheaper options: a handful of proxy boxes, a dedicated occluder `Layer`, or the depth
buffer.

### 7.4 The unminified three.js development build is shipped

`dist/vendor/three.module.js` is **1,314,681 bytes** of unminified r170 — **272 KB gzipped over the wire**,
measured against production. `three.module.min.js` is roughly half. With `installCommand: npm ci` already
present, adding `three` as a devDependency plus an esbuild step would also enable tree-shaking.

### 7.5 Vercel serves the vendor bundle with no cache

```
cache-control: public, max-age=0, must-revalidate
```

Every asset, including the 1.3 MB three.js, is revalidated on every page load. `dist/vendor/*` is
content-stable, so add:

```json
{ "source": "/vendor/(.*)",
  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
```

### 7.6 `preserveDrawingBuffer: true` is permanently on

It is only needed for the snapshot, and `$('capture')` already calls `renderer.render()` immediately before
`drawImage()`, so the flag is redundant and costs a buffer copy every frame. The live console confirms the cost:
repeated *"GPU stall due to ReadPixels"* driver warnings.

### 7.7 three.js r170 is ~16 releases behind

The vendored build is r170 (Dec 2024). Current is
[r186, published 8 September 2026](https://www.utsubo.com/blog/threejs-2026-what-changed). Worth a scheduled
bump for the WebGPU path, shadow fixes and colour-management work.
*(Version information from that source was rephrased for compliance with licensing restrictions.)*

---

## 8. Still open — accessibility

### 8.1 Keyboard users cannot operate the 3D view at all

The canvas has `tabindex="0"` and an `aria-label` reading "Drag to orbit, scroll to zoom" — but
`controls.listenToKeyEvents()` is **never called**. The method exists in the vendored `OrbitControls.js`;
`grep -c listenToKeyEvents dist/app.js` → **0** on `main` and on the PR branch. Verified live: focusing the
canvas and pressing arrow keys produces a pixel-identical frame.

There is no keyboard path to orbit, pan or zoom the 3D model. The arrow keys *are* bound — but only in walk
mode, which requires pointer drag to look around, so a keyboard-only user can move forward but cannot turn.
PR #3 added keyboard control to the **2D** plan; the 3D view still has none.

Minimum fix: `controls.listenToKeyEvents(canvas)`, plus `Q`/`E` or `[`/`]` for yaw in walk mode.

### 8.2 Text contrast and size

14 of 17 sampled text styles fail WCAG 2.1 AA (4.5:1 for body text), measured on the live page:

| Selector | Size | Contrast | Needs |
|---|---|---|---|
| `.sidebar-foot` | 8 px | 2.65 | 4.5 |
| `h2` (sidebar section headings) | 10 px | 2.80 | 4.5 |
| `#roomList small` | 10 px | 2.99 | 4.5 |
| `.micro` | 10 px | 3.07 | 4.5 |
| `.space-stats small` | **7 px** | 3.18 | 4.5 |
| `#compass span` / `small` | 7 / 8 px | 3.39 | 4.5 |
| `.eyebrow` | 8 px | 3.46 | 4.5 |
| `.bottom-bar` | 10 px | 3.67 | 4.5 |
| `.drawing p` | 10 px | 3.87 | 4.5 |
| `.project-card small` | 11 px | 3.88 | 4.5 |
| `#spaceCard p` | 11 px | 3.95 | 4.5 |
| `.review ul` | 11 px | 3.98 | 4.5 |

Passing: `.view-chip` 4.82, `.brand small` 6.01, `.model-label` 8.91. The 7–8 px sizes are the bigger problem:
the assumption and caveat copy — the part a user most needs to read — is the hardest to read.

### 8.3 Icons depend on font glyphs that are frequently missing

All UI icons are bare Unicode symbols in `Arial, Helvetica, sans-serif`. Measured on the live page by
rasterising each glyph and comparing its signature against the `.notdef` box, **15 of 16 render as tofu**:

`◈ ⌂ ♙ ▦ ↗ ⊞ ▥ ＋ ⛶ ⟳ ⌁ ▣ ▧ ⌘ ☰` — only `−` (U+2212) resolves.

Every screenshot shows blank boxes for Cutaway / Exterior / Walk inside / Floor plan, the entire camera
toolbar, the hamburger, Measure, Snapshot, Fullscreen, Export and the compass arrow. This environment has a
thin font stack, so a Mac or Windows desktop fares better — but `⛶`, `⌁`, `▧`, `♙` and `⊞` have patchy
coverage on Android and iOS too, and a tofu box beside "Cutaway" is indistinguishable from a broken build.
Replace with inline SVG (≈1 KB total) or a shipped icon subset.

### 8.4 Smaller items

- The canvas is the **29th of 40** focusable elements — a keyboard user tabs through the whole sidebar before
  reaching the subject of the page. Add a skip link or reorder.
- `#viewChip` text changes (ASSEMBLED 3D → EXPLODED VIEW → 2D PLAN) are not announced; it is not a live region.
- No `prefers-contrast` support, and `prefers-reduced-motion` is honoured for CSS transitions but **not** for
  `controls.autoRotate`.

---

## 9. Still open — CAD output gaps

PR #3 substantially fixed 2D *navigation* (zoom, pan, door symbols). What a drawing still cannot do:

- **No dimension chains.** Two overall dimensions only; no room-by-room or grid-line dimensions, so the
  exported plan cannot be checked against the drawing it came from.
- **No scale bar, no north arrow, no title block, no grid-line bubbles.** The compass widget lives outside the
  SVG, so the exported file carries no orientation marker at all.
- **No print stylesheet** and no paper-size sheet, so the plan cannot be printed to scale.
- **No DXF export.** For a project called CAD, DXF of the 2D plan would be far more useful than SVG — it is a
  text format and the polyline subset needed here is modest. **glTF/GLB** would likewise beat OBJ for 3D
  interchange.
- **OBJ is geometry only** — no `vn` normals, no `vt` UVs, no companion `.mtl`, so every material and colour is
  lost on import; and it is Y-up where most CAD is Z-up. An `.mtl` sidecar is ~30 lines given `palette`.
- **Measurement only snaps to slab surfaces** (`h.object.userData.kind === 'slab'`), so you cannot measure
  wall-to-wall — the measurement people actually want. No corner/edge snapping, no multi-segment chain, no
  on-screen dimension line in 3D, two points maximum.
- **Sectioning is one axis, one direction.** `globalClip` is fixed to `(0, 0, -1)`; no X or Y section, no flip.
- **No stair traversal in walk mode.** You cannot climb between storeys; the floor selector is the only way.
- **No shareable view state** beyond `?plan=` — camera, floor, layers and mode are not encoded in the URL.

---

## 10. Still open — deployment and repository hygiene

| Item | Status |
|---|---|
| Live `dist/` matches the repo byte-for-byte | ✔ verified, all 6 assets |
| `npm ci --ignore-scripts` + `npm run build` (runs tests) | ✔ both pass on Node 22 |
| `X-Content-Type-Options`, `Referrer-Policy`, HSTS | ✔ present |
| **`favicon.ico`** | ✘ **404 — the only console error on the live site** |
| `robots.txt` | ✘ 404 |
| `Content-Security-Policy` | ✘ absent |
| `X-Frame-Options` / `frame-ancestors` | ✘ absent — the app can be framed anywhere |
| `Permissions-Policy` | ✘ absent |
| Immutable caching for `/vendor/*` | ✘ absent (§7.5) |
| Open Graph / Twitter card tags | ✘ absent — link previews render nothing |
| `<noscript>` fallback | ✘ absent — JS off gives a blank page |
| CI (`.github/workflows`) | ✘ absent — tests only run on the Vercel build |
| `LICENSE` | ✘ absent (three.js's licence is vendored correctly) |
| `CONTRIBUTING.md` | ✘ absent |

A CSP is cheap here and worth adding, because `refreshPlanUI()` writes `plan.notes` and `plan.readings` into the
DOM via `innerHTML`. The data is static and trusted today, so this is **not** a live vulnerability — but it is
exactly the pattern that becomes one the moment plan data comes from anywhere else. Prefer `textContent`, and
add:

```
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self';
  img-src 'self' blob:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'
```

(`blob:` is required for the local reference-drawing preview.)

Adding a GitHub Actions workflow running `npm test` on every PR is a ten-line change and would have caught the
phantom-column drift before it shipped.

---

## 11. The structural problem underneath

`build()` contains a ~40-line `if (plan.id === 'B') { buildFloorB(…) } else { …inline Plan A… }`, and
`svgPlan()` forks the same way. Adding Plan B meant duplicating the wall list, the fixture list, the label list
and the SVG renderer with different magic numbers. Plan A's coordinates are still inline literals in `build()`;
Plan B's are split between `plans.js` and `buildFloorB()`.

That split is the root cause of the phantom column PR #3 had to fix — the grid existed in three places and one
drifted — and it is why §4.4 (no Plan B furniture), §5.3 (Plan A compartments not corrected alongside Plan B's)
and §4.5 (a cell with no fixture) all exist. PR #3 fixed the symptom for columns by introducing
`planColumns(plan)`; the same move applied to everything else would prevent the next recurrence.

Push the whole layout into data:

```js
{ id: 'B', drawing: '218124',
  grid:     { x: [...], z: [...] },       // derived from printed bay chains
  walls:    [ { name, axis, a, b, c, outer, cut, openings: [...] }, ... ],
  fixtures: [ { type: 'wc', x, z }, { type: 'urinal', x, z }, ... ],
  labels:   [ { text, x, z, level } ],
  zones:    [ { id, x, z, w, d, title, printed } ] }
```

Then one `buildFloor(spec, level)`, one `svgPlan(spec)` and one `canWalk(spec)` serve every plan, the 2D and 3D
views cannot disagree, and a Plan C becomes a data file rather than a second renderer.

---

## 12. Prioritised recommendations

**Correctness — these are wrong, not merely improvable**

1. Re-read the projection annotation; if it is 12′2½″, correct 3.773 m → 3.7226 m everywhere (§5.1).
2. Reconcile Plan A's width to the printed 16.740 m, **and** surface the 16.740-vs-54′1″ conflict with the same
   prominence the projection conflict already gets (§5.2).
3. Correct the Plan A toilet readings (left lower = 2′10″) and rebuild those compartments at printed clear
   sizes, as PR #3 did for Plan B (§5.3).
4. Add the BASIN & URINAL zone to Plan A (§5.4).
5. Build dimensions once, not per storey; show their values in Exterior, Top, Front and Bird's-eye; depth-test
   them (§4.1).
6. Enlarge the Plan A stairwell to a workable going, or render the stair as explicitly diagrammatic, and clamp
   the riser across the height slider (§6.1).
7. Fix the desktop walk-mode overlaps (§4.3) and label-priority collisions (§4.2).
8. Give Plan B furniture or disable the toggle; remove or populate the fixture-less Plan B cell (§4.4, §4.5).

**Quality — high value, low risk**

9. Replace Unicode icons with inline SVG (§8.3).
10. `controls.listenToKeyEvents(canvas)` plus yaw keys in walk mode (§8.1).
11. Lift body text to ≥ 11 px and ≥ 4.5:1 contrast, starting with the assumption copy (§8.2).
12. Render on demand; debounce the height rebuild; drop `preserveDrawingBuffer`; remove the duplicated
    `update()` traversal (§7.1, §7.2, §7.6, §4.6).
13. Ship minified three.js; add immutable `/vendor/*` caching (§7.4, §7.5).
14. Add `favicon.ico`, `robots.txt`, OG tags, `<noscript>`, CSP and `frame-ancestors` (§10).
15. Add a GitHub Actions workflow running `npm test` on every PR (§10).

**Features — these change what the tool is for**

16. Dimension chains, scale bar, north arrow and a printable sheet in the SVG (§9).
17. DXF export of the plan, glTF/GLB of the model, `.mtl` sidecar for the OBJ (§9).
18. Wall-to-wall measurement with corner snapping and multi-segment chains (§9).
19. Interior lighting, so "Evening" and "Walk inside" mean something (§6.3).
20. Stair traversal in walk mode (§9).
21. Shareable URL state beyond `?plan=` (§9).
22. Move the layout into data and collapse the A/B forks (§11).

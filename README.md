# Plan Atlas — Plan A and Plan B

A static, browser-local Three.js architectural explorer built from the supplied photograph.

## Features

- Two-storey model: ground + first, with first-floor repetition explicitly documented.
- Exterior, cutaway, interior walkthrough, orthographic top/front, bird's-eye and annotated 2D plan.
- Independent floor selection, floor separation, depth sectioning, roof, labels, fixtures and dimensions.
- Adjustable floor height, material/clay/wireframe views, daylight/evening lighting.
- Touch look controls and directional walking buttons; desktop WASD plus Q/E to turn; use floor selector to change storeys.
- Full keyboard control of the 3D view: arrows orbit, shift+arrows pan, +/− zoom, Home refits.
- Two-point measurement against any visible surface — floor, wall, column or fixture — with a 280 mm corner snap.
- PNG snapshot, annotated SVG sheet, layered DXF, OBJ + MTL geometry and JSON specification exports.
- Local-only reference drawing picker and transcription/assumptions review, including the dimensions that conflict.
- Local vendor modules; no third-party runtime network calls or account data access.
- WebGL-unavailable browsers receive a working 2D plan and model exports.
- Render-on-demand: a static view costs no GPU work.
- Shareable URL state — plan, view, storey, layers, height, lighting and style.

## Run

Use Node.js 22 or newer:

```bash
git clone https://github.com/modhack2003/CAD.git
cd CAD
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm test` for geometry regression checks.

The app can also be served from `dist/` with any static HTTP server. The import map requires a modern browser. Opening index.html directly as file:// is not supported by browser ES module rules.

## Model interpretation

Both plans use the **printed 16.740 m (54′11″) main-block width** and the printed 13.951 m depth. The front-right projection is **3.7226 m (12′2½″)**, read from the 3722.57 mm annotation. The wider 18.540 m top dimension is treated as a site dimension. The rear stair follows the L-shaped footprint.

Two printed dimensions genuinely conflict, and both are surfaced in **Source & assumptions**, on the exported sheet and in the JSON:

- **16.740 m outer width vs. the 54′1″ hall label.** With 230 mm walls, 16.740 m gives a 16.280 m (53′5″) clear hall — about 205 mm short of the label. The outer width is used; 54′1″ is treated as a drawing label, not a measured span.
- **Plan B front projection:** 4.600 m on the right against about 3.7226 m on the left. 4.600 m is used provisionally.

Toilet compartments, rooms and column bays are set out from their printed clear dimensions, shared between the 3D model, the walk-collision set and the 2D sheet so they cannot drift apart.

Only one floor plan was supplied. Floor heights, first-floor layout, openings, elevations, roof and furnishing need design verification. No north orientation or structural design is asserted. OBJ and DXF are geometry, not parametric CAD.

### The stair is diagrammatic, and the app says so

The drawn front projection **cannot contain a stair with a compliant going at any storey height in the slider range.** Rather than hide that:

- Riser count follows the storey height, so the rise never exceeds 190 mm (previously a 4.5 m storey produced a 225 mm riser).
- The going is limited by the drawn well depth and cannot be fixed in software. Plan A yields about 172 mm against a 250 mm target; Plan B about 247 mm, which is marginal.
- Treads render **amber** when the going is below target, the sidebar reports the well-depth shortfall live, and the figures appear in the SVG sheet, the DXF and the JSON specification.

Fixing this properly means relocating the stair or deepening the projection — an architect's decision, not a code change. A single stair serving a first-floor assembly space, and the absence of any lift or ramp, are also recorded as unresolved design questions.

## Verification

- Browser checked: fallback plan rendering, ground/first selection, source review and export UI.
- Geometry checks: 611 floor meshes, finite vertex coordinates, 10,428 valid exported triangles, two levels, roof/handrail elevation bounds, height rebuild and wall collision checks.
- Browser WebGL rendering could not be visually verified because the QA browser has its GPU/WebGL disabled. Do not describe 3D browser QA as passed.


## Visual correction — version 2

- Ground-floor hall and room layout retained.
- First-floor hall entry now opens inward from the stair landing, on the slab; its ground-level external door is replaced upstairs by a window.
- Floors default to assembled; explosion is available only for the both-floor cutaway. Isolated floors retain their physical elevations.
- Cutaway uses a shared plane for walls, doors and frames instead of removing walls while leaving suspended doors.
- Stairwell openings match the flights, upper voids have guards, and stairs connect ground to first only. Roof slab is continuous.
- Chair legs and wash-counter support added; window/door frames and slab texture scaling corrected.
- Labels check geometry occlusion and overlap. First-person motion cannot cross upper stair voids.

Run the geometry regression check with `node tests/geometry.mjs`. It verifies the upper gate's support using ray intersections, floor/cutaway elevations, isolation/explosion behavior, stair-void collisions and valid OBJ geometry. It does not claim GPU/browser rendering verification.


## Vercel deployment

The repository includes `vercel.json`: static output is `dist/`, and the build runs the geometry regression checks. There are no runtime dependencies, API keys or environment variables to configure.

The Vercel project is connected to this GitHub repository. Pushes to `main` deploy production; other branches receive preview deployments according to the project's Git settings. Keep the checked-in `dist/vendor` modules and their license with the app.


## Reference drawing privacy

The original plan photograph is not included in this public repository or the deployment. Use **Source & assumptions → Open your reference drawing** to load it locally. The browser displays it using a local object URL; no upload request is sent, and it is cleared on reload.

## Banquet exterior design

The exterior now opens with tall glazed bays, warm ivory cladding, bronze accents and vertical fins, a column-supported entrance canopy, and a proposed garden with trees, flowering borders, seating and bollards. Select **Evening** under appearance to illuminate the facade and entrance. The floor plan and supported first-floor landing entry are retained. Landscaping is illustrative; site boundaries and setbacks have not been surveyed.

## Mobile controls

On a phone, open the menu for floors, rooms, layers and appearance. Camera shortcuts sit in a scrollable bottom toolbar. Drag to orbit and pinch to zoom; in Walk inside, drag to look and hold the arrow buttons to move. The controls adapt to portrait, landscape and display cutouts. The drawer closes with its close button, the backdrop or Escape.

The test command includes portrait camera framing and drawer keyboard/focus checks alongside the building geometry regressions. The mobile layout was reviewed at 320 × 568, 390 × 844 and 844 × 390, including floor switching, the controls drawer and source/export dialogs. The review browser has WebGL disabled, so live 3D rendering and physical-device touch gestures still need a device check.

## Plan A and Plan B

Use the **Building plan** selector in the header to switch alternatives. `?plan=A` opens drawing 218129; `?plan=B` opens drawing 218124. The last selection is remembered on your device. Room lists, floor plans, model geometry, source readings and OBJ/SVG/JSON/snapshot exports follow the selected plan. Local reference photos are kept separately for each alternative and are never bundled with the public app.

Plan B uses the printed 16.740 × 13.951 m main block. It has an 8′ × 12′ rear-left room, three 4′ × 6′ toilet compartments, separate urinal and hand-wash areas, two front rooms with unspecified uses, and one front stair. The left front room is labeled 6.000 × 2.450 m. The other room width and door positions are inferred.

The front projection dimensions conflict: 4.600 m on the right versus approximately 3.773 m on the left. Plan B provisionally uses 4.600 m, clearly marked in the source review, SVG and JSON. As with Plan A, the first floor is an assumed repeat because only one floor drawing was supplied. A net hall area is not asserted for Plan B.

## Two-plan audit

See [the full findings register](docs/PLAN_AUDIT.md) for corrections, drawing uncertainties and remaining design work. Plan B now follows the printed column bay chains and clear dimensions of the rear room, three WCs and front-left room. Its 128 mm exterior-wall annotation is treated provisionally.

The floor-plan view supports drag to pan, pinch/wheel or +/− to zoom, and Fit to reset. Keyboard users can focus the plan and use arrows, +/− and Home. Zoom stays available without WebGL. SVG exports identify the selected floor and include doors and glazing. 3D-only controls are disabled while viewing the annotated plan.

The stair readout shows modeled rise, tread and exit landing at the current height. It does not establish stair suitability or regulatory compliance. Movement stays on the selected floor; stairs, open doors and visible furniture block the walkthrough. Use Ground/First to change storeys.

## Review round 3 — findings from REVIEW.md

This round closes the items left open after the two-plan audit. `REVIEW.md` records the full review of
`main` and the live deployment; the entries below are what changed in response.

### Drawing fidelity

- **Front projection corrected** from 3.773 m (12′4½″) to **3.7226 m (12′2½″)**. The annotation reads
  3722.57 mm; the old value looks like 3722 transposed as 3772. The correction propagates to the slab outline,
  the SVG, the DXF, the OBJ and the JSON.
- **Plan A now uses the printed 16.740 m width** instead of an inferred ~16.94 m. Drawing 218124 prints the
  width for the same building, so the inference was superseded — and the two plans no longer model one
  building 200 mm apart.
- **The width-versus-hall-label conflict is surfaced** with the same prominence the projection conflict
  already had, via a new `conflicts` field rendered in the source dialog, the sheet and the JSON.
- **Plan A toilet compartments rebuilt to printed clear sizes** (3′11″ × 4′10″, 3′11″ × **2′10″**, and
  3′7″ × 4′10″ twice). The left lower compartment reads 2′10″, not 4′10″; the old reading collapsed two
  differently sized compartments into one.
- **The BASIN & URINAL zone the drawing labels is now modelled** — three urinals, a basin counter and a
  genuine 3′2″ wash passage between them. Plan A previously had basins only.

### Correctness

- **Dimensions are one annotation layer**, not a copy per storey. Values no longer appear twice, one pair
  floating a storey up, and the lines now render as an overlay so a line and its value are never separated.
- **Dimension values are reachable** in exterior and elevation views, where the layer previously drew lines
  with no numbers. Room labels are cutaway-only and the toggle is disabled elsewhere rather than silently
  doing nothing.
- **Label priority** means the hall keeps its label; the overlap suppressor drops a secondary caption instead.
- **Desktop walkthrough chrome fixed.** The rules hiding the camera toolbar and hero card existed only in the
  phone breakpoint, so on desktop the walk hint sat exactly on top of the last toolbar button.
- **Plan B has a furniture layer.** Benches, tables and a desk, so the toggle is not dead for one of the two
  plans — and, since furniture is a collision surface, both plans now walk the same way.
- **Plan B's fourth WC cell** is labelled an inferred WC lobby and equipped with a cleaner's sink and floor
  drain. The drawing labels three toilets; the 2 × 2 block has four cells, and the spare one was a sealed
  empty box. The inference is documented rather than presented as a fourth toilet.
- Dead code removed: the unused `#error` element, a double `sun.intensity` assignment, a redundant second
  material traversal per state change, and an unused object-URL variable.

### Performance

- **Render on demand.** The renderer previously drew 745 meshes with soft shadows every frame forever,
  whether or not anything moved.
- **Height slider coalesced to one rebuild per frame.** It previously ran a full teardown, re-extrude,
  re-wall and garden rebuild synchronously on every input event.
- **`preserveDrawingBuffer` dropped.** The snapshot renders immediately before readback, so the per-frame
  buffer copy — and the ReadPixels stalls visible in the console — was unnecessary.
- **Minified three.js**: 1,314,681 → 691,648 bytes. The previously vendored file was verified
  byte-identical to npm `three@0.170.0` before swapping in that release's minified build.
- **`/vendor/*` served immutable**, instead of `max-age=0, must-revalidate` on every page load.

### Accessibility

- **Keyboard control of the 3D view.** `OrbitControls` own key handling only pans and was never enabled, so
  there was no keyboard route to orbit or zoom at all. Arrows orbit, shift+arrows pan, +/− zoom, Home refits,
  and Q/E turn in the walkthrough.
- **Inline SVG icons.** Measured on the deployment, 15 of 16 Unicode icon glyphs fell back to the `.notdef`
  box, so every control read as an empty square. A build check now fails if those code points reappear.
- **Type and contrast.** Fourteen of seventeen sampled styles failed WCAG 2.1 AA, worst 2.65:1, several at
  7–8 px — including the assumption copy that matters most. Body text is now ≥ 11 px and ≥ 4.5:1.
- `aria-live` on the view chip; the canvas label describes the keyboard controls.

### CAD output

- **DXF R12 export** with real layers (`A-WALL`, `A-COLS`, `A-GLAZ`, `A-DOOR`, `A-STRS`, `A-GRID`, `A-ANNO`).
- **OBJ now ships a companion MTL** and vertex normals, so colours and smooth-shaded foliage survive import.
- **Sheet furniture**: bay dimension chains traced from the shared column grid, a graphic scale bar, a
  labelled north arrow (drawing-up, true north unverified) and a title block.
- **Measurement works against any visible surface**, not only floor slabs, with a 280 mm corner snap and a
  plan-distance readout alongside the true distance.

### Deployment

- `favicon`, `robots.txt`, Open Graph and Twitter tags, and a `<noscript>` fallback.
- **Content-Security-Policy** with `default-src 'none'`, a hash for the single inline import map, and
  `frame-ancestors 'none'`; plus `X-Frame-Options` and `Permissions-Policy`. The policy is also set as a
  `<meta>` tag so the dev server enforces the same rules.
- Plan data is now written to the DOM with `textContent` instead of `innerHTML`.
- **GitHub Actions CI** runs the same `npm test` Vercel uses, so a red PR cannot deploy green.
- `scripts/check-csp.mjs` fails the build if the import map is edited without regenerating its CSP hash, if
  vendor caching is dropped, or if the font-dependent icon glyphs return.

### Not done, and why

- **Stair traversal in walkthrough.** Climbing between storeys conflicts with the floor-isolation model,
  where each level is a separately visible group and the camera is pinned to one elevation. It needs a
  reworked camera model, not a patch. The floor selector remains the supported way to change storeys.
- **three.js r170 → r186.** The minified r170 build ships now. A sixteen-release jump changes colour
  management and lighting defaults, and bundling it with twenty other changes would make any visual
  regression impossible to attribute. It deserves its own PR with before/after renders.
- **Full data-driven refactor.** Plan A's partitions, column grid and stair metrics now come from shared data
  in `plans.js`, which is what the 2D/3D drift bugs needed. `build()` still forks on `plan.id` for the wall
  lists; collapsing that is a larger change and is tracked in `REVIEW.md` §11.
- **glTF/GLB export.** Would mean vendoring another exporter; DXF was the higher-value gap for CAD use.

## Verification

`npm test` covers both models, printed clear room/bay dimensions, the corrected width and projection, the
basin/urinal zone, the single dimension layer, interior lighting, Plan B furniture and lobby, capped risers
with the reported shortfall, sheet scale/north/title block, DXF structure and layers, OBJ/MTL consistency,
floor/entry support, stair openings, height limits, OBJ face indices, safe room targets, collisions, plan
switching, image isolation, resource disposal, drawer focus, SVG navigation gestures, and the CSP/caching/icon
build checks.

The automated suite runs without WebGL. Live GPU rendering, physical-device touch and real-device performance
still need a device check.

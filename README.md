# Plan Atlas — drawing 218129

A static, browser-local Three.js architectural explorer built from the supplied photograph.

## Features

- Two-storey model: ground + first, with first-floor repetition explicitly documented.
- Exterior, cutaway, interior walkthrough, orthographic top/front, bird's-eye and annotated 2D plan.
- Independent floor selection, floor separation, depth sectioning, roof, labels, fixtures and dimensions.
- Adjustable floor height, material/clay/wireframe views, daylight/evening lighting.
- Touch look controls and directional walking buttons; desktop WASD; use floor selector to change storeys.
- Two-point floor measurements, PNG snapshot, SVG plan, OBJ geometry and JSON specification exports.
- Local-only reference drawing picker and transcription/assumptions review.
- Local vendor modules; no third-party runtime network calls or account data access.
- WebGL-unavailable browsers receive a working 2D plan and model exports.

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

Printed hall dimensions are 54′1″ × 34′6″. Main block depth is 13.951 m; front-right projection is 3.773 m. Overall building width (~16.94 m) is inferred from the clear hall width plus assumed wall thickness. The wider 18.540 m top dimension is treated as a site dimension. The rear stair follows the L-shaped footprint. Front stair rise/run is conceptual.

Only one floor plan was supplied. Floor heights, first-floor layout, openings, elevations, stairs, roof and furnishing need design verification. No north orientation or structural design is asserted. OBJ is mesh geometry in metres, not parametric CAD.

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

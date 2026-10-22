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

# Two-plan audit — 23 October 2026

Compared the supplied photographs of drawing 218129 (Plan A) and 218124 (Plan B) with the model, exported geometry, annotated plans and controls. This is the findings register for this review, not a guarantee that all architectural or browser issues have been eliminated.

## Corrected in this PR

| # | Finding | Correction |
|---|---|---|
| 1 | Plan A used a repeated rectangular column grid, inventing rear positions and missing the service/stair junction. | Trace separate rows, share the same positions between geometry, collision and SVG; retain approximate coordinates. |
| 2 | Plan B's column coordinates did not follow the dimension chains. | Use clear bays 5.245 / 5.250 / 5.245 m and 4.200 / 4.55121 / 4.200 m. Four inferred 250 mm columns make these sum to the printed main-block dimensions. |
| 3 | Plan A's ground rear ENT opening was rendered as a window. | Restore a conceptual ground door; keep upstairs glazing. Exact doorway width remains inferred. |
| 4 | Plan B ignored the 128 mm / 5 inch wall annotation. | Apply 128 mm provisionally to its exterior walls and identify the interpretation in source notes. Internal partitions remain assumed 140 mm. |
| 5 | Plan B's 8 × 12 ft rear room was only approximate despite readable dimensions. | Its clear modeled width/depth now match 2.4384 × 3.6576 m. |
| 6 | Plan B's toilet compartments were also approximate. | All three use 1.2192 × 1.8288 m clear dimensions, corresponding to 4 × 6 ft. |
| 7 | Plan B's labeled 6.000 × 2.450 m front room did not have those clear dimensions. | Correct the north and divider walls; keep both front-room uses unspecified. |
| 8 | Plan B's upper stair exit left only about half a metre before the front wall. | Shorten the inferred flight footprint to leave approximately 0.97 m clear. Tread/height feasibility remains explicitly unverified. |
| 9 | Upper stair flights lacked a continuous visual supporting waist. | Add a waist below the upper front flight and Plan A rear flight. This is conceptual geometry, not structural design. |
| 10 | Canopy height was fixed even when storey height was reduced, causing slab overlap. | Limit canopy elevation relative to the selected floor height and resize its supports. |
| 11 | Plan B's last paving joints extended beyond the terrace. | Size the terrace and presentation base from the active footprint and approach. |
| 12 | The grid was below opaque geometry and effectively invisible. | Raise the optional grid just above the ground plane. |
| 13 | Plan A ground SVG had an unescaped ampersand and could fail as standalone XML. | Escape it and check both exports for XML validity. |
| 14 | Plan A's SVG toilet fills overlapped and ran beyond partitions. | Fit the zone fills within the compartments. |
| 15 | SVG plans showed gaps without identifying doors or glazing. | Add opening spans and door-swing indicators from the actual opening definitions. |
| 16 | 2D zoom was a toast instead of an action; mobile hid the toolbar. | Add bounded 1–8× SVG zoom, drag/pinch, wheel, keyboard arrows/+/-/Home, and working Fit. Keep these available in WebGL fallback. |
| 17 | Several layer/style controls appeared usable in 2D but did nothing. | Disable 3D-only controls in plan mode. Printed plan annotations remain visible; label units are independent of the measure-tool units. |
| 18 | SVG filenames did not distinguish ground and first floors. | Include the selected floor in plan and snapshot SVG filenames. |
| 19 | Ground walkthrough could move through solid stairs; upper voids alone were blocked. | Exclude stair footprints on both levels. Floor selection remains the supported way to change storeys. |
| 20 | Walking ignored door leaves, foyer columns and furniture. | Add collisions for open leaves, entrance columns and visible fixtures; hiding furniture removes those obstacles. |
| 21 | Room shortcuts could place the camera inside furniture. | Find a nearby clear destination before entering a room. Regression-check every room on both levels. |
| 22 | Opening a modal could leave movement/autorotation active. | Stop motion before showing dialogs and suppress movement while a dialog or controls drawer is open. |
| 23 | Clearing measurements leaked marker/line materials; floor changes left old markers. | Dispose geometry and materials, clear measurements on floor changes, and reset measurement instructions. |
| 24 | Changing measure units left an existing result in old units. | Reformat the current result immediately. |
| 25 | Room highlights and card formatting could become stale after reset/switch/export. | Track selected rooms, preserve highlights during plan rendering, and reset card state on workspace/plan changes. |
| 26 | Active mode/floor buttons exposed visual state only. | Add aria-pressed and disable unsupported choices in fallback/plan mode. |
| 27 | Plan A room areas looked more exact than the source justified. | Mark label products as nominal, distinguish Room A's stepped geometry, and correct nominal hall rounding. |
| 28 | Stair risk was hidden in general assumptions. | Show live rise/tread/upper-landing values beside the controls and include them in the JSON specification. |

| 29 | Landscape phone plan view spent too much height on the camera toolbar. | Move its three plan controls to the side and expand the drawing viewport; widen the narrow-phone plan selector. |

| 30 | New 3D room labels could flash at the viewport origin before the next animation frame, including in 2D fallback. | Hide new labels until projected and hide their entire layer outside cutaway mode. |

## Drawing questions and remaining design work

These cannot be resolved faithfully from the two photographs alone. They are documented, not silently invented.

| Item | Current treatment / needed next input |
|---|---|
| Separate first floor | Both first floors repeat the supplied plan as a concept. Need an approved first-floor plan to model differences. |
| Plan B front projection | Right annotation is 4.600 m; left reads approximately 3.773 m. Continue to use 4.600 m provisionally. Need confirmation of which endpoints those dimensions reference. |
| Plan A overall width | Approximately 16.94 m is inferred from the hall label plus assumed walls. 18.540 m appears to be the wider site dimension. Need a clear outer-building width. |
| Walls and offsets | Plan B's readable rooms and bay dimensions are honored, but other positions, wall centerlines, reveals and reference-face choices are approximate. Need a dimensioned CAD/PDF or survey for full coordination. |
| Stairs | Plan A front treads are about 172 mm, rear lower treads 185 mm; Plan B front treads are about 247 mm. The assumed 20 risers give 165 mm rise at default height and change with the height slider. These are model diagnostics, not code compliance. Need designed stair sections, landings, headroom and guard details. |
| Banquet operations | Seating capacity, dining arrangement, catering/kitchen, storage, accessible facilities and evacuation routes are not established by either drawing. No capacity or compliance claim. |
| Exterior and site | Tall windows, finishes, canopy, garden, lighting and terrace are proposals. Need elevations, site boundary/setbacks, levels, drainage and structural design before finalizing. |
| Technical CAD | OBJ is a geometry export without parametric solids or an engineering model. IFC/STEP, coordinated dimensions and quantities would be a separate modeling task. |
| Device validation | Automated geometry/navigation tests and browser fallback checks do not replace real-device GPU rendering, touch, memory and performance tests. |

## Verification

`npm test` covers both models, printed clear room/bay dimensions, floor/entry support, stair openings, height limits, canopy/paving support, OBJ face indices, safe room targets, collisions, plan switching, image isolation, resource disposal, drawer focus and SVG navigation gestures. Both generated SVG files were also parsed with an XML parser during the audit.

The review browser disables WebGL. Software depth-buffer images were used to inspect ground-floor geometry, but are not evidence of the browser's lighting, transparency, clipping or GPU performance. Live WebGL and physical-phone verification remain outstanding.

Preview browser checks passed at 320 × 568, 390 × 844 and 844 × 390 for overflow, plan zoom/Fit, first-floor selection, modal source readings and drawer dismissal. `tests/responsive.html` retains the repeatable iframe fixture; temporarily serve it beside `index.html` for manual review. It is excluded from the deployed app.

# Three-flight front-stair correction

The front stairs in drawings 218129 (A) and 218124 (B) have three flights, not two. The prior model omitted the middle flight along the left wall. Its stair feasibility claims and upper landing measurements therefore described the wrong geometry.

## Arrangement

With the photographs oriented as supplied, ascend left across the bottom flight, turn on a square landing, ascend along the left side, turn on a second landing, then return right across the top flight. Ascending order is inferred from the solid lower and dashed upper flights; no legible UP arrow or stair section is supplied. The upper exit opens into the lobby to the right. Plan A's separate rear L stair is retained.

`dist/front-stair.js` describes all three flights and both landings. The same coordinates drive the mesh builder, guard positions, walk surface, SVG and DXF. The first-floor slab has an opening across the stair envelope, with a supported arrival on the right and a guard that leaves that arrival open. No extra flight leads to the roof.

## Dimension register

| Item | Current model | Evidence / status |
| --- | --- | --- |
| B full projection | 4.600 m | Printed right-side dimension; retained as wall-axis distance. Exact wall-face references still need confirmation. |
| B clear span, stair end to right inner wall | 4.365 m | Printed dimension. Used to locate the stair end at x = 12.311 m. |
| B hall opening | 1.825 m | Printed opening beside the top flight; replaces the 1.700 m opening in the old model. |
| B right return after that opening | 2.540 m | Printed chain; 1.825 + 2.540 = 4.365 m. |
| B front entrance opening | 1.800 m | Printed dimension; replaces 1.700 m. Horizontal placement retains the existing inferred entrance centre. |
| B 4.240 m annotation | Recorded, not used as the 4.365 m clear span | References near the column/upper wall differ. The 125 mm difference is consistent with half an inferred 250 mm column, but that is not proof of its endpoints. |
| B left vertical annotation | 3722.57 mm | Starts below the hall wall in the photograph; not the complete projection. Do not substitute it for 4.600 m. |
| A left vertical annotation | Appears to read 3772.57 mm | Also starts below the hall wall. Earlier correction to a 3.7226 m overall projection was not justified. Verify original characters/endpoints. |
| A full projection | Approximately 4.850 m | Photo-trace estimate relative to the main block; not a printed measurement. |
| A stair envelope / flight width | 2.500 × 4.620 m / 1.200 m | Photo-trace estimates, allowing for the current assumed exterior wall thickness. |
| B stair envelope / flight width | 3.597 × 4.472 m / 1.650 m | Envelope follows the retained wall axes and 4.365 m span. Flight width and its internal division are traced estimates. |
| Riser distribution at default height | A: 5 + 9 + 5; B: 7 + 4 + 7 | Interpreted from visible tread marks; not a dimensioned riser schedule. |
| Floor-to-floor height | Default 3.300 m; adjustable | Existing model assumption. Not supplied by either drawing. |

At default height the model gives A goings of approximately 260 / 247 / 260 mm and B goings of approximately 278 / 293 / 278 mm. These are consequences of the provisional widths and riser counts, not verified dimensions from the drawings. Increasing height can add risers and reduce goings. The UI reports each flight separately. Its 190 mm rise and 250 mm going thresholds are model review targets, not a local-code assessment.

**An exact dimensional reconstruction is not established.** A dimensioned stair plan/section is needed for flight widths, both landing dimensions, riser counts, storey height and headroom. The app marks these estimates rather than claiming a 100% match. Photographs remain local and are not bundled or uploaded to the repository.

## Verification

- Actual mesh directions follow x-negative, z-negative, x-positive in both plans; each tread elevation is checked.
- Three flight groups and two landings appear in the SVG; DXF uses the same line segments.
- Both turning landings join flights at equal elevation; walking is sampled along every flight.
- Ray checks confirm that the first-floor slab does not cover flights or landings and supports the upper arrival.
- The central upper void blocks walking, and the upper guard does not cross the arrival.
- Literal checks retain the B 4.365 / 1.825 / 2.540 / 1.800 / 4.600 m dimension chain.
- Existing geometry/export, mobile, navigation, CSP and vendor checks remain required.

Node geometry tests use a mocked DOM, not a WebGL renderer. Software geometry images and browser 2D review supplement those tests; they do not establish physical-device GPU performance or construction suitability.

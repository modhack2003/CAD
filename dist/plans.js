// Metres. Printed dimensions take priority; unresolved readings stay explicit.
export const plans={
 A:{id:'A',drawing:'218129',name:'Plan A',wallThickness:.23,width:16.74,depth:13.951,extension:3.7226,extensionX:8.65,entryCenter:14.5,
  stair:{x:8.9,z:14.131,width:2.18,depth:2.6},rearStair:true,
  widthBasis:'16.740 m printed main-block width (54′11″) read from drawing 218124 of the same building',
  readings:[['Hall label','54′1″ × 34′6″'],['Main block width','16.740 m / 54′11″ (from 218124)'],['Main block depth','45′9″ / 13.951 m'],['Rear room A','11′0″ × 10′1″'],['Rear room B','10′0″ × 10′1″'],['Left toilets','3′11″ × 4′10″ and 3′11″ × 2′10″'],['Right toilets (×2)','3′7″ × 4′10″'],['Wash passage','3′2″ wide (appears)'],['Basin & urinal','Labelled zone beside the wash passage'],['Front projection','3.7226 m / 12′2½″'],['Wider site dimension','18.540 m']],
  conflicts:[
   'The printed 16.740 m outer width and the printed 54′1″ hall label cannot both hold. With 230 mm outer walls, 16.740 m gives a 16.280 m (53′5″) clear hall — about 205 mm short of the 54′1″ label. The model uses the printed outer width and treats 54′1″ as a drawing label, not a measured clear span.',
   'The front projection annotation reads 3722.57 mm (12′2½″). An earlier reading of 3.773 m (12′4½″) appears to have transposed 3722 as 3772 and has been corrected; re-check the original before technical use.',
   'Drawing 218129 does not dimension the column grid, so the rows are traced from the visible marks and the bay chain comes out uneven (about 4.76 / 3.19 / 3.39 / 5.18 m). Drawing 218124 prints near-equal 5.245 / 5.250 / 5.245 m bays for the same building, which the traced Plan A positions do not reproduce. Plan B uses the printed bays; Plan A keeps the traced marks because its service-area column sits off that grid. Confirm the real grid before any structural reading.'
  ],
  notes:['First-floor rooms repeat this plan as a concept; no separate upper-floor drawing was supplied.','Upper hall entry is from the internal stair landing. Ground exterior doors become windows upstairs.','The outer width now uses the printed 16.740 m from drawing 218124, which shows the same building. The earlier ~16.94 m figure was inferred from the hall label plus assumed walls and is superseded. 18.540 m is treated as a site dimension.','Toilet compartments are set out from their printed clear dimensions. The left pair is 3′11″ × 4′10″ and 3′11″ × 2′10″; the right pair is 3′7″ × 4′10″, with about 9 mm residual absorbed at the hall wall.','The drawing labels a BASIN & URINAL zone beside the 3′2″ wash passage. Urinals, a basin counter and the clear passage are now modelled; fixture counts and positions within the zone are inferred.','Printed room areas are nominal label products, not surveyed usable areas. Room A has a stepped boundary; its actual modeled area differs.','Column marks are traced by row; their coordinates and sizes remain approximate.','The front projection cannot contain a stair with a code-compliant going at any storey height in the slider range. Risers are capped at 190 mm by raising the riser count, and the shortfall in well depth is reported live. The stair is diagrammatic and needs architectural redesign or relocation.','Four toilets, staggered rear partitions, rear wash passage and both stair areas follow drawing 218129.'],
  rooms:{hall:{title:'The main hall',desc:'Open hall with the column grid retained. Furniture is illustrative.',size:'54′1″ × 34′6″ label',area:'173.3 m² label',x:8.5,z:8.5},roomA:{title:'Rear room A',desc:'The stepped left toilet partition is retained.',size:'11′0″ × 10′1″',area:'10.3 m² nominal',x:1.79,z:1.65},roomB:{title:'Rear room B',desc:'Rear room between the two toilet groups.',size:'10′0″ × 10′1″',area:'9.4 m² nominal',x:6.47,z:1.65},wash:{title:'Toilets, wash passage, basin & urinal',desc:'Four toilet compartments, a 3′2″ wash passage and the labelled basin and urinal zone.',size:'4 toilets + urinals',area:'0.94 m passage',x:10.2,z:1.7},stair:{title:'Front entrance & stair',desc:'Front-right extension. Stair geometry is diagrammatic; the well is too shallow for a compliant stair.',size:'3.7226 m projection',area:'G + 1',x:13.5,z:15.7}}},
 B:{id:'B',drawing:'218124',name:'Plan B',wallThickness:.128,width:16.74,depth:13.951,extension:4.6,extensionX:8.65,entryCenter:15.05,
  stair:{x:8.9,z:14.171,width:3.45,depth:3.35},rearStair:false,
  widthBasis:'16.740 m upper main-block dimension (54′11″); 128 mm wall annotation provisionally applied to exterior walls',
  readings:[['Main block','16.740 × 13.951 m'],['Horizontal clear bays','5.245 / 5.250 / 5.245 m'],['Vertical clear bays','4.200 / 4.55121 / 4.200 m'],['Wall annotation','128 mm (5 inch)'],['Hall label','54′1″ × 34′6″ (printed)'],['Rear-left room','8′0″ × 12′0″'],['Toilets (×3)','4′0″ × 6′0″ each'],['Urinal area','8′0″ × 4′6″'],['Hand wash','8′5″ × 6′7″'],['Front-left room','6.000 × 2.450 m; use unlabeled'],['Front second room','Width inferred; use unlabeled'],['Front projection','4.600 m right / 3.7226 m left — conflict'],['Wider site dimension','18.540 m']],
  conflicts:[
   'The front projection is dimensioned 4.600 m on the right and about 3.7226 m (12′2½″) on the left. The model uses 4.600 m provisionally; confirm which endpoints each dimension references.',
   'The printed 16.740 m outer width and the printed 54′1″ hall label cannot both hold. No net hall area is asserted for Plan B.'
  ],
  notes:['Front projection is provisionally 4.600 m from the right annotation. The left annotation reads about 3.7226 m (12′2½″) and conflicts; verify before technical use.','Four 250 mm columns plus the three printed clear bays sum to 16.740 m horizontally and approximately 13.951 m vertically. Plan B uses this internally consistent column grid; column size is inferred from that arithmetic.','The 128 mm (5 inch) annotation is used provisionally for outer walls; 140 mm internal partitions are assumed. The rear room, three toilets and front-left room use their printed clear dimensions.','The toilet block is a 2 × 2 set of cells but the drawing labels only three compartments. The fourth cell is modelled as an inferred WC lobby with a cleaner\u2019s sink and floor drain, not a fourth toilet. The TOI door off the rear room is inferred and should be reviewed.','The U stair leaves approximately 1.0 m of clear space at its upper exit. Treads are about 247 mm, marginally under a 250 mm target; risers, headroom and width remain unverified.','Only one floor is drawn. The first floor repeats Plan B as a concept, with the hall entry on its supported internal stair landing.','Three 4′ × 6′ toilets, a separate urinal zone and an L-shaped basin/hand-wash area are arranged along the left side.','The two front rooms have no legible use labels. The left room is marked 6.000 × 2.450 m; the second width and door locations are inferred. They are not labeled as a kitchen or store.','The 16.740 m main-block width is used. The printed hall label does not define the net usable hall area around the service rooms; no exact hall area is claimed.','A single front stair serves a first-floor assembly space and no lift or ramp is drawn. A second means of escape and an accessible route are design questions this drawing cannot answer.','The original photograph remains on your device. Neither drawing is bundled with the public app.'],
  rooms:{hall:{title:'Plan B · banquet hall',desc:'Open hall to the right of the service strip and above the two front rooms. Printed hall dimensions are retained as a drawing label, not a measured clear rectangle.',size:'54′1″ × 34′6″ label',area:'Area unverified',x:8,z:7.6},roomA:{title:'Rear-left room',desc:'The 8′ × 12′ room shown at the upper left. Door location is inferred.',size:'8′0″ × 12′0″',area:'8.9 m² nominal',x:1.45,z:1.9},wash:{title:'Toilets, urinal & hand wash',desc:'Three toilet compartments, an inferred WC lobby, a separate urinal zone and L-shaped basin counters along the left side.',size:'3 toilets + urinal',area:'Separate hand wash',x:1.5,z:10.25},frontA:{title:'Front room 1 · use unspecified',desc:'The drawing gives a 6.000 × 2.450 m rectangle but no room-use label. Door location is inferred.',size:'6.000 × 2.450 m',area:'14.7 m² nominal',x:3.2,z:12.55},frontB:{title:'Front room 2 · use unspecified',desc:'The second front room is retained. Its width and doorway are inferred from the adjoining dimensions.',size:'~3.1 × 2.450 m',area:'Width inferred',x:7.7,z:12.55},stair:{title:'Front lobby & single stair',desc:'The right-side 4.600 m projection is used provisionally. The conflicting 3.7226 m annotation needs confirmation.',size:'4.600 m provisional',area:'G + 1',x:14.5,z:16.7}}}
};

// Plan A rear-strip setting-out, derived from the printed clear dimensions so the
// 3D walls, the 2D plan, the fixtures and the labels cannot drift apart.
const FT=.3048, IN=.0254;
export const planAGrid=(()=>{
 const outerFace=.115,part=.07,hallWall=3.28,hallFace=hallWall-part;
 const roomA=11*FT,roomBWide=10*FT,leftWc=3*FT+11*IN,rightWc=3*FT+7*IN,wcUpper=4*FT+10*IN,wcLowerLeft=2*FT+10*IN;
 const roomAWall=outerFace+roomA+part;
 const leftWcWall=roomAWall+part+leftWc+part;
 const roomBWall=leftWcWall+part+roomBWide+part;
 const rightWcWall=roomBWall+part+rightWc+part;
 const washWall=11.45;
 const wcDivider=outerFace+wcUpper+part;
 const leftWcFront=wcDivider+part+wcLowerLeft+part;
 const urinalFace=rightWcWall+part,passageStart=urinalFace+.4,passageEnd=passageStart+3*FT+2*IN;
 return {outerFace,part,hallWall,hallFace,roomA,roomBWide,leftWc,rightWc,wcUpper,wcLowerLeft,
  roomAWall,leftWcWall,roomBWall,rightWcWall,washWall,wcDivider,leftWcFront,
  urinalFace,passageStart,passageEnd,
  rightWcLower:hallFace-(wcDivider+part)};
})();

export function planAPartitions(){const g=planAGrid;return [
 // Stepped left WC block: the printed 4′10″ and 2′10″ compartments, not a square pair.
 ['Rear room A / left WC','z',0,g.leftWcFront,g.roomAWall,[{a:1.85,b:2.47,door:true}]],
 ['Left WC divider','x',g.roomAWall,g.leftWcWall,g.wcDivider,[]],
 ['Staggered WC return','x',g.roomAWall,g.leftWcWall,g.leftWcFront,[]],
 ['WC / room B divider','z',0,g.hallWall,g.leftWcWall,[{a:.55,b:1.17,door:true}]],
 ['Room A hall wall','x',0,g.leftWcWall,g.hallWall,[{a:2.5,b:3.45,door:true}]],
 ['Room B hall wall','x',g.leftWcWall,g.roomBWall,g.hallWall,[{a:5.05,b:6,door:true}]],
 ['Room B / right toilets','z',0,g.hallWall,g.roomBWall,[]],
 ['Right WC rear division','x',g.roomBWall,g.rightWcWall,g.wcDivider,[]],
 ['Right WC hall wall','x',g.roomBWall,g.rightWcWall,g.hallWall,[]],
 ['Right toilet doors','z',0,g.hallWall,g.rightWcWall,[{a:.57,b:1.19,door:true},{a:2.1,b:2.72,door:true}]],
 ['Wash / stair divider','z',0,g.hallWall,g.washWall,[]]
]}

export function planBPartitions(){return [
 ['Rear-left room divider','z',0,3.7916,2.5724,[{a:2.65,b:3.55,door:true}]],
 ['Rear-left room front','x',0,2.5724,3.7916,[{a:.4,b:1.15,door:true,inward:true}]],
 ['Toilet centre divider','z',3.7916,7.7292,1.3532,[{a:6.3,b:7.1,door:true}]],
 ['Toilet upper division','x',0,1.3532,5.7604,[]],
 ['Toilet service front','x',0,2.7124,7.7292,[]],
 ['Toilet L rear','x',1.3532,2.7124,3.7916,[]],
 ['Toilet service screen','z',3.7916,7.7292,2.7124,[{a:6.3,b:7.1,door:true}]],
 // The fourth cell of the 2x2 block is an inferred lobby, so TOI(L) opens into it.
 ['WC lobby entry','x',1.3532,2.7124,5.7604,[{a:1.75,b:2.37,door:true}]],
 ['Urinal screen','z',7.7292,9.2408,2.7124,[{a:8.1,b:9.05,door:true}]],
 ['Wash rear screen','x',0,2.7124,9.2408,[]],
 ['Front room partitions','x',0,9.425,11.367,[{a:4.6,b:5.6,door:true,inward:true},{a:7.3,b:8.3,door:true,inward:true}]],
 ['Front room divider','z',11.367,13.951,6.134,[]],
 ['Front room end','z',11.367,13.951,9.425,[]]
]}

// Explicit rows prevent a rectangular grid from inventing service-area columns.
export function planColumns(plan){
 if(plan.id==='B')return [.125,5.62,11.12,plan.width-.125].flatMap(x=>[.125,4.575,9.37621,plan.depth-.125].map(z=>[x,z]));
 const g=planAGrid;
 return [
  ...[.11,g.leftWcWall,g.roomBWall,g.washWall,plan.width-.11].map(x=>[x,.11]),
  ...[.11,g.leftWcWall,g.roomBWall,g.washWall,plan.width-.11].map(x=>[x,g.hallWall]),
  ...[6.78,10.28].flatMap(z=>[.11,g.leftWcWall,g.roomBWall,12.72,plan.width-.11].map(x=>[x,z])),
  ...[.11,g.leftWcWall,8.85,12.72,plan.width-.11].map(x=>[x,plan.depth-.11])
 ];
}

// Risers are capped so the slider cannot produce an impossible stair; the going
// shortfall that the drawn footprint cannot fix is reported instead of hidden.
export const MAX_RISE=.19, TARGET_GOING=.25, LANDING=.88;
export function stairMetrics(depth,height){
 const perFlight=Math.max(10,Math.ceil(height/2/MAX_RISE));
 const rise=height/(perFlight*2),going=(depth-LANDING)/perFlight;
 const requiredDepth=LANDING+perFlight*TARGET_GOING;
 return {perFlight,risers:perFlight*2,rise,going,requiredDepth,
  shortfall:Math.max(0,requiredDepth-depth),
  verdict:going>=TARGET_GOING?'meets the 250 mm going target':going>=.24?'marginal: just under the 250 mm going target':'diagrammatic: the going is far below any usable stair'};
}

// Sheet extents: building plus dimension chains, scale bar, north arrow and title block.
export const PLAN_VIEWBOX=[-3,-3,23,26];

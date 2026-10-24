import {frontStairLayout} from './front-stair.js';
// Metres. Printed dimensions take priority; unresolved readings stay explicit.
export const plans={
 A:{id:'A',drawing:'218129',name:'Plan A',wallThickness:.23,columnSize:.28,facadePiers:[.2,4.83,8.4],tagline:'Rear service rooms · twin stairs',blurb:'Tall glass, warm ivory stone and a planted garden. Explore the original banquet layout.',hallLights:[[5,6.5],[12,6.5],[5,11],[12,11]],width:16.74,depth:13.951,extension:4.85,projectionProvisional:true,extensionX:8.65,entryCenter:14.5,
  stair:{x:8.765,z:14.066,width:2.5,depth:4.62,flightWidth:1.2,drawnRisers:[5,9,5],dimensionalStatus:'Three flights traced from 218129. 2.50 m envelope width, 1.20 m flight width and 4.85 m overall projection are provisional photo-trace estimates; no complete stair dimensions or section supplied.'},rearStair:true,
  widthBasis:'16.740 m printed main-block width (54′11″) read from drawing 218124 of the same building',
  readings:[['Hall label','54′1″ × 34′6″'],['Main block width','16.740 m / 54′11″ (from 218124)'],['Main block depth','45′9″ / 13.951 m'],['Rear room A','11′0″ × 10′1″'],['Rear room B','10′0″ × 10′1″'],['Left toilets','3′11″ × 4′10″ and 3′11″ × 2′10″'],['Right toilets (×2)','3′7″ × 4′10″'],['Wash passage','3′2″ wide (appears)'],['Basin & urinal','Labelled zone beside the wash passage'],['Front projection','~4.85 m full depth, traced; left partial annotation appears 3772.57 mm'],['Wider site dimension','18.540 m']],
  conflicts:[
   'The printed 16.740 m outer width and the printed 54′1″ hall label cannot both hold. With 230 mm outer walls, 16.740 m gives a 16.280 m (53′5″) clear hall — about 205 mm short of the 54′1″ label. The model uses the printed outer width and treats 54′1″ as a drawing label, not a measured clear span.',
   'The left-side annotation appears to read 3772.57 mm and starts below the hall wall; it does not dimension the full projection. The previous 3.7226 m overall projection was incorrect. Full depth is provisionally traced as 4.85 m; verify the endpoints and a dimensioned original.',
   'Drawing 218129 does not dimension the column grid, so the rows are traced from the visible marks and the bay chain comes out uneven (about 4.76 / 3.19 / 3.39 / 5.18 m). Drawing 218124 prints near-equal 5.245 / 5.250 / 5.245 m bays for the same building, which the traced Plan A positions do not reproduce. Plan B uses the printed bays; Plan A keeps the traced marks because its service-area column sits off that grid. Confirm the real grid before any structural reading.'
  ],
  notes:['First-floor rooms repeat this plan as a concept; no separate upper-floor drawing was supplied.','Upper hall entry is from the internal stair landing. Ground exterior doors become windows upstairs.','The outer width now uses the printed 16.740 m from drawing 218124, which shows the same building. The earlier ~16.94 m figure was inferred from the hall label plus assumed walls and is superseded. 18.540 m is treated as a site dimension.','Toilet compartments are set out from their printed clear dimensions. The left pair is 3′11″ × 4′10″ and 3′11″ × 2′10″; the right pair is 3′7″ × 4′10″, with about 9 mm residual absorbed at the hall wall.','The drawing labels a BASIN & URINAL zone beside the 3′2″ wash passage. Urinals, a basin counter and the clear passage are now modelled; fixture counts and positions within the zone are inferred.','Printed room areas are nominal label products, not surveyed usable areas. Room A has a stepped boundary; its actual modeled area differs.','Column marks are traced by row; their coordinates and sizes remain approximate.','The front stair has three flights and two quarter-turn landings, matching the visible arrangement. Flight widths, step counts and full projection depth are traced estimates. Earlier claims that the drawing could not fit a usable stair came from the wrong two-flight model and are withdrawn. A dimensioned stair section is still required.','Four toilets, staggered rear partitions, rear wash passage and both stair areas follow drawing 218129.'],
  rooms:{hall:{title:'The main hall',desc:'Open hall with the column grid retained. Furniture is illustrative.',size:'54′1″ × 34′6″ label',area:'173.3 m² label',x:8.5,z:8.5},roomA:{title:'Rear room A',desc:'The stepped left toilet partition is retained.',size:'11′0″ × 10′1″',area:'10.3 m² nominal',x:1.79,z:1.65},roomB:{title:'Rear room B',desc:'Rear room between the two toilet groups.',size:'10′0″ × 10′1″',area:'9.4 m² nominal',x:6.47,z:1.65},wash:{title:'Toilets, wash passage, basin & urinal',desc:'Four toilet compartments, a 3′2″ wash passage and the labelled basin and urinal zone.',size:'4 toilets + urinals',area:'0.94 m passage',areaLabel:'PASSAGE WIDTH',x:10.2,z:1.7},stair:{title:'Front entrance & stair',desc:'Three flights with two quarter-turn landings. Full projection and flight widths are traced estimates, not verified dimensions.',size:'~4.85 m projection (traced)',area:'G + 1',areaLabel:'LEVELS',x:13.5,z:15.7}}},
 B:{id:'B',drawing:'218124',name:'Plan B',wallThickness:.128,columnSize:.25,projectionProvisional:true,facadePiers:[.2,6.23,8.4],tagline:'Left service strip · two front rooms · one stair',blurb:'A new layout with left-side services, two front rooms and a single stair. The front projection needs confirmation.',hallLights:[[6.5,3],[13,3],[6.5,8.5],[13,8.5]],width:16.74,depth:13.951,extension:4.6,extensionX:8.65,entryCenter:15.05,
  stair:{x:8.714,z:14.015,width:3.597,depth:4.472,flightWidth:1.65,drawnRisers:[7,4,7],dimensionalStatus:'4.600 m projection, 4.365 m right-side clear span, 1.825 m hall opening and 1.800 m entrance opening follow printed dimensions. 1.650 m flight width, partition alignment and riser distribution are traced/inferred; no stair section supplied.'},rearStair:false,
  widthBasis:'16.740 m upper main-block dimension (54′11″); 128 mm wall annotation provisionally applied to exterior walls',
  readings:[['Main block','16.740 × 13.951 m'],['Horizontal clear bays','5.245 / 5.250 / 5.245 m'],['Vertical clear bays','4.200 / 4.55121 / 4.200 m'],['Wall annotation','128 mm (5 inch)'],['Hall label','54′1″ × 34′6″ (printed)'],['Rear-left room','8′0″ × 12′0″'],['Toilets (×3)','4′0″ × 6′0″ each'],['Urinal area','8′0″ × 4′6″'],['Hand wash','8′5″ × 6′7″'],['Front-left room','6.000 × 2.450 m; use unlabeled'],['Front second room','Width inferred; use unlabeled'],['Front projection','4.600 m full right dimension; 3722.57 mm partial left annotation'],['Stair-side clear span','4.365 m'],['Hall opening / right return','1.825 m / 2.540 m'],['Front entrance','1.800 m'],['Wider site dimension','18.540 m']],
  conflicts:[
   'The right-side 4.600 m full projection and the left 3722.57 mm annotation start at different points. Do not treat them as conflicting full depths. The 4.600 m wall-axis projection is retained; wall-face references require confirmation.',
   'The printed 16.740 m outer width and the printed 54′1″ hall label cannot both hold. No net hall area is asserted for Plan B.'
  ],
  notes:['Front projection retains the printed right-side 4.600 m. The 3722.57 mm left annotation starts below the hall wall, so it is not the full projection. Wall-face references still need confirmation.','Four 250 mm columns plus the three printed clear bays sum to 16.740 m horizontally and approximately 13.951 m vertically. Plan B uses this internally consistent column grid; column size is inferred from that arithmetic.','The 128 mm (5 inch) annotation is used provisionally for outer walls; 140 mm internal partitions are assumed. The rear room, three toilets and front-left room use their printed clear dimensions.','The toilet block is a 2 × 2 set of cells but the drawing labels only three compartments. The fourth cell is modelled as an inferred WC lobby with a cleaner\u2019s sink and floor drain, not a fourth toilet. The TOI door off the rear room is inferred and should be reviewed.','Three flights run left across the bottom, up the left side, and right across the top, connected by two landings. The stair ends 4.365 m from the right inner wall. Flight width (1.650 m), riser distribution and elevations remain provisional; verify with a stair section.','Only one floor is drawn. The first floor repeats Plan B as a concept, with the hall entry on its supported internal stair landing.','Three 4′ × 6′ toilets, a separate urinal zone and an L-shaped basin/hand-wash area are arranged along the left side.','The two front rooms have no legible use labels. The left room is marked 6.000 × 2.450 m; the second width and door locations are inferred. They are not labeled as a kitchen or store.','The 16.740 m main-block width is used. The printed hall label does not define the net usable hall area around the service rooms; no exact hall area is claimed.','A single front stair serves a first-floor assembly space and no lift or ramp is drawn. A second means of escape and an accessible route are design questions this drawing cannot answer.','The original photograph remains on your device. Neither drawing is bundled with the public app.'],
  rooms:{hall:{title:'Plan B · banquet hall',desc:'Open hall to the right of the service strip and above the two front rooms. Printed hall dimensions are retained as a drawing label, not a measured clear rectangle.',size:'54′1″ × 34′6″ label',area:'Area unverified',x:8,z:7.6},roomA:{title:'Rear-left room',desc:'The 8′ × 12′ room shown at the upper left. Door location is inferred.',size:'8′0″ × 12′0″',area:'8.9 m² nominal',x:1.45,z:1.9},wash:{title:'Toilets, urinal & hand wash',desc:'Three toilet compartments, an inferred WC lobby, a separate urinal zone and L-shaped basin counters along the left side.',size:'3 toilets + urinal',area:'Separate hand wash',areaLabel:'SERVICE ZONES',x:1.5,z:10.25},frontA:{title:'Front room 1 · use unspecified',desc:'The drawing gives a 6.000 × 2.450 m rectangle but no room-use label. Door location is inferred.',size:'6.000 × 2.450 m',area:'14.7 m² nominal',x:3.2,z:12.55},frontB:{title:'Front room 2 · use unspecified',desc:'The second front room is retained. Its width and doorway are inferred from the adjoining dimensions.',size:'~3.1 × 2.450 m',area:'Width inferred',x:7.7,z:12.55},stair:{title:'Front lobby & single stair',desc:'Three-flight stair with two landings. The 4.600 m projection and 4.365 m clear span follow the drawing; flight widths and heights need confirmation.',size:'4.600 m provisional',area:'G + 1',areaLabel:'LEVELS',x:14.5,z:16.7}}}
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
export const MAX_RISE=.19, TARGET_GOING=.25;
// One vocabulary for stair adequacy, so the tread tint, the sidebar readout and
// the exported specification cannot describe the same stair differently.
export function goingBand(going){return going>=TARGET_GOING?'meets':going>=TARGET_GOING-.01?'marginal':'diagrammatic'}
export function flightRisers(height){return Math.max(10,Math.ceil(height/2/MAX_RISE))}
// Sheet extents: building plus dimension chains, scale bar, north arrow and title block.
export const PLAN_VIEWBOX=[-3,-3,23,26];

// ---------------------------------------------------------------------------
// Layout as data. build() used to fork on plan.id and carry two hand-written
// geometry lists, which is how the column grid came to exist in three places
// and one of them drifted. One renderer now walks these descriptors, so a
// further alternative is a data entry rather than a second code path.
// ---------------------------------------------------------------------------

// [name, axis, from, to, offset, openings, outer, cutaway]
export function planShell(plan,level){
 const {width:W,depth:D,extension:E,extensionX:EX}=plan;
 const stairEnd=plan.stair.x+plan.stair.width;
 if(plan.id==='B')return [
  ['Plan B rear exterior','x',0,W,0,[{a:.65,b:2.1,window:true},{a:3.5,b:5,window:true,tall:true},{a:6,b:9.8,window:true,tall:true},{a:11.6,b:13.6,window:true,tall:true},level?{a:14.3,b:16.1,window:true,tall:true}:{a:14.3,b:16.1,door:true,glazed:true}],true,false],
  ['Plan B service exterior','z',0,D,0,[{a:.7,b:2.5,window:true},{a:4.25,b:5.15,window:true,sill:1.8,head:2.4},{a:6.25,b:7.15,window:true,sill:1.8,head:2.4},{a:9.65,b:10.65,window:true},{a:12,b:13.3,window:true}],true,true],
  ['Plan B right exterior','z',0,D+E,W,[{a:.7,b:3.7,window:true,tall:true},{a:4.9,b:8.5,window:true,tall:true},{a:9.65,b:13.25,window:true,tall:true},{a:14.6,b:17.7,window:true,tall:true}],true,false],
  ['Plan B front room facade','x',0,EX,D,[{a:.65,b:5.7,window:true,tall:true},{a:6.7,b:8.1,window:true,tall:true}],true,true],
  ['Plan B front room / lobby','x',EX,9.425,D,[],false,true],
  [level?'First-floor landing entry':'Plan B hall / lobby','x',9.425,W,D,[{a:stairEnd,b:stairEnd+1.825,door:level===1,inward:true}],false,true],
  [level?'First-floor front window':'Entrance front','x',EX,W,D+E,[{a:9.1,b:12.25,window:true,tall:true},level?{a:14.2,b:15.9,window:true,tall:true}:{a:14.15,b:15.95,door:true,glazed:true}],true,true],
  ['Entrance left','z',D,D+E,EX,[],true,true],
  ...planBPartitions().map(([name,axis,a,b,c,openings])=>['Plan B '+name,axis,a,b,c,openings,false,true])
 ];
 return [
  ['Rear exterior','x',0,W,0,[{a:.9,b:2.5,window:true},{a:5.7,b:7.3,window:true},level?{a:14.1,b:15.8,window:true}:{a:15.3,b:16.5,door:true,glazed:true}],true,false],
  ['Left exterior','z',0,D,0,[{a:4.8,b:6.5,window:true,tall:true},{a:8.1,b:9.8,window:true,tall:true},{a:11.2,b:12.8,window:true,tall:true}],true,true],
  ['Right exterior','z',0,D+E,W,[{a:4.8,b:6.5,window:true,tall:true},{a:8.1,b:9.8,window:true,tall:true},{a:11.2,b:12.8,window:true,tall:true},{a:14.8,b:16.4,window:true,tall:true}],true,false],
  ['Hall front left','x',0,EX,D,[{a:.65,b:4.4,window:true,tall:true},{a:5.25,b:7.85,window:true,tall:true}],true,true],
  [level?'First-floor landing entry':'Hall front / entry to lobby','x',EX,W,D,[{a:stairEnd,b:stairEnd+1.7,door:level===1,inward:true}],false,true],
  [level?'First-floor front window':'Entrance front','x',EX,W,D+E,[{a:9.1,b:12.25,window:true,tall:true},level?{a:13.65,b:15.35,window:true,tall:true}:{a:13.65,b:15.35,door:true,glazed:true}],true,true],
  ['Entrance left','z',D,D+E,EX,[],true,true],
  ...planAPartitions().map(([name,axis,a,b,c,openings])=>[name,axis,a,b,c,openings,false,true])
 ];
}

// ['wc'|'desk'|'table', x, z] or ['benches', xs, zs] or
// ['box', name, x, y, z, width, height, depth, materialKey]
export function planFixtures(plan){
 if(plan.id==='B')return [
  ...[[.674,4.4],[2.033,4.4],[.674,6.37]].map(([x,z])=>['wc',x,z]),
  // The 2x2 block's fourth cell is an inferred lobby, so it gets service
  // fittings rather than a fourth toilet the drawing never labelled.
  ['box','Cleaner sink',2.45,.5,6.2,.44,.3,.44,'sanitary'],
  ['box','Cleaner sink tap',2.45,.78,6.02,.03,.22,.03,'metal'],
  ['box','WC lobby floor drain',1.75,.02,7.3,.3,.04,.3,'metal'],
  ...[.65,1.4,2.15].flatMap(x=>[['box','Urinal fixture',x,.72,8.15,.4,.65,.32,'sanitary'],['box','Urinal drain',x,.04,8.3,.3,.08,.3,'metal']]),
  ['box','Hand-wash rear cabinet',1.5,.4,9.62,2.3,.8,.42,'wood'],
  ['box','Hand-wash rear counter',1.5,.85,9.62,2.4,.1,.5,'stone'],
  ['box','Hand-wash side cabinet',.48,.4,10.5,.42,.8,1.3,'wood'],
  ['box','Hand-wash side counter',.48,.85,10.5,.5,.1,1.4,'stone'],
  ...[.8,1.55,2.3].flatMap(x=>[['box','Hand-wash basin',x,.94,9.64,.45,.08,.35,'sanitary'],['box','Hand-wash tap',x,1.08,9.48,.035,.25,.035,'metal']]),
  ['box','Hand-wash basin',.48,.94,10.6,.35,.08,.45,'sanitary'],
  ['benches',[8.37,13.87],[2.35,7,10.5]],['desk',1.28,.9],['table',3,12.6],['table',7.7,12.6]
 ];
 const q=planAGrid;
 const leftX=(q.roomAWall+q.leftWcWall)/2,rightX=(q.roomBWall+q.rightWcWall)/2;
 const upperZ=q.outerFace+q.wcUpper/2,leftLowerZ=(q.wcDivider+q.part+q.leftWcFront-q.part)/2,rightLowerZ=(q.wcDivider+q.part+q.hallFace)/2;
 const basinX=(q.passageEnd+q.washWall-q.part)/2;
 return [
  ...[[leftX,upperZ],[leftX,leftLowerZ],[rightX,upperZ],[rightX,rightLowerZ]].map(([x,z])=>['wc',x,z]),
  // The drawing labels a BASIN & URINAL zone either side of the 3'2" passage.
  ...[.75,1.45,2.15].flatMap(z=>[['box','Urinal fixture',q.urinalFace+.17,.72,z,.34,.65,.4,'sanitary'],['box','Urinal drain',q.urinalFace+.14,.04,z,.28,.08,.34,'metal']]),
  ['box','Urinal divider',q.urinalFace+.2,.6,1.8,.4,1.2,.03,'partition'],
  ['box','Wash counter',basinX,.85,1.7,.6,.15,2.5,'stone'],
  ['box','Wash cabinet support',basinX,.385,1.7,.54,.77,2.45,'wood'],
  ...[.8,1.7,2.6].flatMap(z=>[['box','Wash basin',basinX-.06,.96,z,.46,.08,.5,'sanitary'],['box','Tap',basinX+.19,1.12,z,.03,.25,.03,'metal']]),
  ['desk',(q.outerFace+q.roomAWall-q.part)/2,1.25],['desk',(q.leftWcWall+q.roomBWall)/2,1.25],
  ['benches',[3,14.5],[5.6,8.1,11.6]]
 ];
}

// [text, x, z, kind, subtitle, priority]
export function planLabels(plan,level){
 if(plan.id==='B')return [
  ['PLAN B · MAIN HALL',9,7,'room',level?'FIRST FLOOR · ASSUMED REPEAT':'54′1″ × 34′6″ · PRINTED LABEL',0],
  ['REAR ROOM',1.3532,1.9],['WC × 3',1.4,4.9],['WC LOBBY',2.03,6.9],['URINAL',1.5,8.6],['HAND WASH',1.5,10.5],
  ['FRONT ROOM 1',3.3,12.7],['FRONT ROOM 2',7.75,12.7],[level?'STAIR LANDING':'ENTRY',14.6,16.6,'room','',1]
 ];
 const q=planAGrid;
 return [
  ['MAIN HALL',8.2,8,'room',level?'FIRST FLOOR · ASSUMED REPEAT':'GROUND FLOOR · 54′1″ × 34′6″ LABEL',0],
  ['ROOM A',(q.outerFace+q.roomAWall)/2,1.9],['ROOM B',(q.leftWcWall+q.roomBWall)/2,1.9],
  ['WD. PASS.',(q.passageStart+q.passageEnd)/2,1.4],['BASIN & URINAL',(q.passageStart+q.washWall)/2,2.9],
  [level?'STAIR LANDING':'ENTRY',14.3,15.8,'room','',1]
 ];
}

// Guards around the first-floor stair voids. [x1, z1, x2, z2]
export function planRails(plan){
 const rails=frontStairLayout(plan,3.3).guards;
 if(plan.rearStair)rails.push([11.65,.25,11.65,3.35],[12.9,1.5,15.2,1.5]);
 return rails;
}

// Sheet primitives, drawn in order. Walls, columns, the stair and the opening
// symbols are shared geometry and are not described here.
//  ['zone', id, x, z, w, d, fill, stroke]  selectable room fill
//  ['fill', x, z, w, d, fill, stroke]      plain fill, e.g. a toilet cell
//  ['text', x, z, value, size]
//  ['vtext', x, z, value, size]            rotated to read up the sheet
//  ['path', d, fill, stroke, width]
export function planSheet(plan,upper){
 const {width:W,depth:D,extension:E,extensionX:EX}=plan;
 const floor=upper?'FIRST FLOOR · ASSUMED REPEAT':'GROUND FLOOR';
 if(plan.id==='B')return [
  ['zone','hall',2.9,.15,W-3.05,11.25,'#f4f2e5','none'],
  ['zone','roomA',.064,.064,2.4384,3.6576,'#e2e9d8','none'],
  ...[[.064,3.8616],[1.4232,3.8616],[.064,5.8304]].map(([x,z])=>['fill',x,z,1.2192,1.8288,'#ccded3','none']),
  ['zone','wash',.16,7.7292,2.65,1.52,'#d9e5d7','none'],
  ['zone','wash',.16,9.2408,2.65,2.151,'#e1ead8','none'],
  ['zone','frontA',.064,11.437,6,2.45,'#e2e9d8','none'],
  ['zone','frontB',6.204,11.437,3.151,2.45,'#e2e9d8','none'],
  ['zone','stair',EX+.13,D+.13,W-EX-.26,E-.26,'#e7e8d9','none'],
  ['text',9,6.4,'PLAN B · MAIN HALL',.4],['text',9,7,'54′1″ × 34′6″ · printed label',.25],['text',9,7.5,floor,.22],
  ['text',1.3532,1.65,'ROOM',.28],['text',1.3532,2.1,'8′ × 12′',.23],
  ['text',.674,4.7,'TOI',.23],['text',2.033,4.7,'TOI (L)',.23],['text',.674,6.67,'TOI (G)',.23],
  ['text',2.033,6.6,'WC LOBBY',.18],['text',2.033,6.86,'inferred',.15],
  ['text',1.3532,8.5,'URINAL',.23],['text',1.3532,8.9,'8′ × 4′6″',.18],
  ['text',1.3532,10.25,'HAND WASH',.23],['text',1.3532,10.7,'8′5″ × 6′7″',.18],
  ['text',3.2,12.4,'FRONT ROOM 1',.28],['text',3.2,12.85,'6.000 × 2.450 m · use unspecified',.19],
  ['text',7.8,12.4,'FRONT ROOM 2',.25],['text',7.8,12.85,'use unspecified',.18],
  ['text',14.6,16.1,upper?'STAIR LANDING':'ENTRANCE',.28],['text',14.6,16.6,'4.600 m projection *',.2]
 ];
 const q=planAGrid;
 const roomAx=(q.outerFace+q.roomAWall-q.part)/2,roomBx=(q.leftWcWall+q.part+q.roomBWall-q.part)/2;
 const leftWcX=q.roomAWall+q.part+q.leftWc/2,rightWcX=q.roomBWall+q.part+q.rightWc/2;
 return [
  ['zone','hall',.15,q.hallWall,W-.3,D-q.hallWall-.15,'#f4f2e5','none'],
  ['zone','roomA',q.outerFace,q.outerFace,q.roomAWall-q.part-q.outerFace,q.hallFace-q.outerFace,'#e7ebdc','#536c5a'],
  ['zone','roomB',q.leftWcWall+q.part,q.outerFace,q.roomBWide,q.hallFace-q.outerFace,'#e7ebdc','#536c5a'],
  ['fill',q.roomAWall+q.part,q.outerFace,q.leftWc,q.wcUpper,'#cfded6','#536c5a'],
  ['fill',q.roomAWall+q.part,q.wcDivider+q.part,q.leftWc,q.wcLowerLeft,'#cfded6','#536c5a'],
  ['fill',q.roomBWall+q.part,q.outerFace,q.rightWc,q.wcUpper,'#cfded6','#536c5a'],
  ['fill',q.roomBWall+q.part,q.wcDivider+q.part,q.rightWc,q.rightWcLower,'#cfded6','#536c5a'],
  ['zone','wash',q.urinalFace,q.outerFace,q.washWall-q.part-q.urinalFace,q.hallFace-q.outerFace,'#e5eee2','#536c5a'],
  ['fill',q.urinalFace,q.outerFace,.4,q.hallFace-q.outerFace,'#d7e4dd','none'],
  ['fill',q.passageEnd,q.outerFace,q.washWall-q.part-q.passageEnd,q.hallFace-q.outerFace,'#d7e4dd','none'],
  ['zone','stair',EX+.12,D+.12,W-EX-.24,E-.24,'#ebecdf','#536c5a'],
  // Rear quarter-turn stair, drawn only where the plan has one.
  ['path','M11.65 .25H15.2V1.5H12.9V3.35H11.65Z','#d9ddcf','#71836b',.035],
  ...Array.from({length:10},(_,i)=>['path',`M11.65 ${(1.5+i*.185).toFixed(4)}h1.25 M${(12.9+i*.23).toFixed(4)} .25v1.25`,'none','#71836b',.025]),
  ['text',8.2,7.7,'MAIN HALL',.42],['text',8.2,8.3,'54′1″ × 34′6″ printed label',.27],['text',8.2,8.85,floor,.2],
  ['text',roomAx,1.6,'ROOM A',.3],['text',roomAx,2,'11′0″ × 10′1″',.19],
  ['text',roomBx,1.6,'ROOM B',.3],['text',roomBx,2,'10′0″ × 10′1″',.19],
  ['text',leftWcX,.9,'WC',.2],['text',leftWcX,1.12,'3′11″×4′10″',.13],
  ['text',leftWcX,2.22,'WC',.2],['text',leftWcX,2.44,'3′11″×2′10″',.13],
  ['text',rightWcX,.9,'WC',.2],['text',rightWcX,1.12,'3′7″×4′10″',.13],
  ['text',rightWcX,2.5,'WC',.2],['text',rightWcX,2.72,'3′7″×4′10″',.13],
  ['vtext',q.urinalFace+.2,1.7,'URINAL',.19],
  ['vtext',(q.passageStart+q.passageEnd)/2,1.7,'3′2″ WD. PASS.',.19],
  ['vtext',(q.passageEnd+q.washWall)/2,1.7,'BASIN',.19],
  ['text',14.2,15.6,upper?'STAIR LANDING':'ENTRANCE',.3],['text',14.2,16.1,upper?'ENTRY TO HALL':'& STAIR LOBBY',.2]
 ];
}
export function planSheetNotes(plan,stair){
 if(plan.id==='B')return ['* 3 flights + 2 landings. 4.600 m projection; 3722.57 mm is a partial left dimension.','* Upper floor assumed to repeat; single stair and no lift are unresolved design questions.'];
 return ['* 3 flights + 2 landings. Full projection ~4.85 m and flight widths traced; verify dimensions.','* 16.740 m outer width and the 54′1″ hall label conflict by about 205 mm.'];
}

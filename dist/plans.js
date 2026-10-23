// Metres. Printed dimensions take priority; unresolved readings stay explicit.
export const plans={
 A:{id:'A',drawing:'218129',name:'Plan A',width:16.94,depth:13.951,extension:3.773,extensionX:8.65,entryCenter:14.5,
  stair:{x:8.9,z:14.131,width:2.18,depth:2.6},rearStair:true,
  widthBasis:'16.4846 m hall clear width + assumed 230 mm walls',
  readings:[['Hall','54′1″ × 34′6″'],['Rear room A','11′0″ × 10′1″'],['Rear room B','10′0″ × 10′1″'],['Left toilets (×2)','3′11″ × 4′10″'],['Right toilets (×2)','3′7″ × 4′10″'],['Wash passage','3′2″ wide (appears)'],['Main block depth','45′9″ / 13.951 m'],['Front projection','3.773 m'],['Wider site dimension','18.540 m']],
  notes:['First-floor rooms repeat this plan as a concept; no separate upper-floor drawing was supplied.','Upper hall entry is from the internal stair landing. Ground exterior doors become windows upstairs.','The hall width plus assumed outer walls gives approximately 16.94 m; 18.540 m is treated as a site dimension.','Four toilets, staggered rear partitions, rear wash passage and both stair areas follow drawing 218129.'],
  rooms:{hall:{title:'The main hall',desc:'Open hall with the column grid retained. Furniture is illustrative.',size:'54′1″ × 34′6″',area:'173.4 m²',x:8.5,z:8.5},roomA:{title:'Rear room A',desc:'The stepped left toilet partition is retained.',size:'11′0″ × 10′1″',area:'10.3 m²*',x:2,z:1.65},roomB:{title:'Rear room B',desc:'Rear room between the two toilet groups.',size:'10′0″ × 10′1″',area:'9.4 m²',x:6.6,z:1.65},wash:{title:'Toilets & wash passage',desc:'Four toilet compartments and a narrow wash passage.',size:'4 toilets',area:'~0.97 m passage',x:10.3,z:2.4},stair:{title:'Front entrance & stair',desc:'Front-right extension. Stair geometry is conceptual.',size:'3.773 m projection',area:'G + 1',x:13.5,z:15.7}}},
 B:{id:'B',drawing:'218124',name:'Plan B',width:16.74,depth:13.951,extension:4.6,extensionX:8.65,entryCenter:15.05,
  stair:{x:8.9,z:14.171,width:3.45,depth:3.85},rearStair:false,
  widthBasis:'16.740 m upper main-block dimension (54′11″); outer walls assumed 230 mm',
  readings:[['Main block','16.740 × 13.951 m'],['Hall label','54′1″ × 34′6″ (printed)'],['Rear-left room','8′0″ × 12′0″'],['Toilets (×3)','4′0″ × 6′0″ each'],['Urinal area','8′0″ × 4′6″'],['Hand wash','8′5″ × 6′7″'],['Front-left room','6.000 × 2.450 m; use unlabeled'],['Front second room','Width inferred; use unlabeled'],['Front projection','4.600 m right / 3.773 m left — conflict'],['Wider site dimension','18.540 m']],
  notes:['Front projection is provisionally 4.600 m from the right annotation. The left annotation reads approximately 3.773 m and conflicts; verify before technical use.','Only one floor is drawn. The first floor repeats Plan B as a concept, with the hall entry on its supported internal stair landing.','Three 4′ × 6′ toilets, a separate urinal zone and an L-shaped basin/hand-wash area are arranged along the left side.','The two front rooms have no legible use labels. The left room is marked 6.000 × 2.450 m; the second width and door locations are inferred. They are not labeled as a kitchen or store.','The 16.740 m main-block width is used. The printed hall label does not define the net usable hall area around the service rooms; no exact hall area is claimed.','A front stair is shown; no rear stair is drawn in Plan B. Rear and front ground entries become glazing upstairs.','The original photograph remains on your device. Neither drawing is bundled with the public app.'],
  rooms:{hall:{title:'Plan B · banquet hall',desc:'Open hall to the right of the service strip and above the two front rooms. Printed hall dimensions are retained as a drawing label, not a measured clear rectangle.',size:'54′1″ × 34′6″ label',area:'Area unverified',x:8,z:7.6},roomA:{title:'Rear-left room',desc:'The 8′ × 12′ room shown at the upper left. Door location is inferred.',size:'8′0″ × 12′0″',area:'8.9 m² nominal',x:1.45,z:1.9},wash:{title:'Toilets, urinal & hand wash',desc:'Three toilet compartments, a separate urinal zone and L-shaped basin counters along the left side.',size:'3 toilets + urinal',area:'Separate hand wash',x:1.5,z:10.25},frontA:{title:'Front room 1 · use unspecified',desc:'The drawing gives a 6.000 × 2.450 m rectangle but no room-use label. Door location is inferred.',size:'6.000 × 2.450 m',area:'14.7 m² nominal',x:3.2,z:12.55},frontB:{title:'Front room 2 · use unspecified',desc:'The second front room is retained. Its width and doorway are inferred from the adjoining dimensions.',size:'~3.1 × 2.450 m',area:'Width inferred',x:7.7,z:12.55},stair:{title:'Front lobby & single stair',desc:'The right-side 4.600 m projection is used provisionally. The conflicting 3.773 m annotation needs confirmation.',size:'4.600 m provisional',area:'G + 1',x:14.5,z:16.7}}}
};

export function planBPartitions(){return [
 ['Rear-left room divider','z',0,3.89,2.68,[{a:2.65,b:3.55,door:true}]],
 ['Rear-left room front','x',0,2.68,3.89,[{a:.4,b:1.15,door:true,inward:true}]],
 ['Toilet centre divider','z',3.89,7.83,1.45,[{a:6.3,b:7.1,door:true}]],
 ['Toilet upper division','x',0,1.45,5.86,[]],
 ['Toilet service front','x',0,2.81,7.83,[]],
 ['Toilet L rear','x',1.45,2.81,3.89,[]],
 ['Toilet service screen','z',3.89,7.83,2.81,[{a:4.55,b:5.3,door:true},{a:6.3,b:7.1,door:true}]],
 ['Upper WC entry','x',1.45,2.81,5.86,[]],
 ['Urinal screen','z',7.83,9.35,2.81,[{a:8.1,b:9.05,door:true}]],
 ['Wash rear screen','x',0,2.81,9.35,[]],
 ['Front room partitions','x',0,9.425,11.501,[{a:4.6,b:5.6,door:true,inward:true},{a:7.3,b:8.3,door:true,inward:true}]],
 ['Front room divider','z',11.501,13.951,6.23,[]],
 ['Front room end','z',11.501,13.951,9.425,[]]
]}

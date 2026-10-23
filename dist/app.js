import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { responsiveFov, setupDrawer } from './mobile-ui.js';
import {plans,planAGrid,planColumns,planShell,planFixtures,planLabels,planRails,planSheet,planSheetNotes,stairMetrics,TARGET_GOING,PLAN_VIEWBOX} from './plans.js';

const $=id=>document.getElementById(id);
const touchDevice=window.matchMedia('(pointer:coarse)').matches;
import {createPlanViewport,bindPlanNavigation} from './plan-navigation.js';
const SLAB=.18;let T=.23;
const planViewport=createPlanViewport();
let selectedRoom='';
const applyPlanViewport=bindPlanNavigation($('planView'),planViewport);
let plan=plans.A,W=plan.width,D=plan.depth,E=plan.extension,EX=plan.extensionX,rooms=plan.rooms;
const state={mode:'exterior',floor:'both',explode:0,height:3.3,roof:true,labels:true,dimensions:false,furniture:true,grid:false,style:'material',light:'day',units:'m',section:100};
const drawingURLs={};
function columnPoints(){return planColumns(plan)}
function columnSize(){return plan.columnSize}
let toastTimer;function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3800)}
const scene=new THREE.Scene();scene.background=new THREE.Color('#e7ebe1');
const canvas=$('scene');let renderer,webglAvailable=true;
// No preserveDrawingBuffer: the snapshot renders immediately before readback, so
// the per-frame buffer copy (and its ReadPixels stalls) is unnecessary.
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){webglAvailable=false;renderer={setPixelRatio(){},setSize(){},render(){},shadowMap:{}};state.mode='plan';state.floor='0';}
renderer.setPixelRatio(Math.min(devicePixelRatio,touchDevice?1.5:2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const camera=new THREE.PerspectiveCamera(43,1,.05,250);const ortho=new THREE.OrthographicCamera(-20,20,20,-20,.1,200);let activeCamera=camera,orthoMode=false;
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=2;controls.maxDistance=90;controls.maxPolarAngle=Math.PI*.485;controls.target.set(W/2,2,8.6);controls.autoRotateSpeed=.6;
// Render on demand. A static view costs no GPU work, which matters most on phones.
let needsRender=true,labelsDirty=true;
function invalidate(){needsRender=true;labelsDirty=true}
controls.addEventListener('change',invalidate);
scene.add(new THREE.HemisphereLight(0xf8fcf0,0x8b9a82,2.3));const sun=new THREE.DirectionalLight(0xfff6dc,3.1);sun.position.set(-8,27,16);sun.castShadow=true;sun.shadow.mapSize.set(touchDevice?1024:2048,touchDevice?1024:2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:1,far:90});sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;sun.target.position.set(8,0,7);scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xdbeeff,1.25);fill.position.set(24,12,-16);scene.add(fill);
// A banquet hall is sold on its lighting, so the interior has its own fittings
// rather than relying on ambient hemisphere light alone.
const interiorLights=Array.from({length:4},()=>{const l=new THREE.PointLight(0xffd9a8,0,12,2);scene.add(l);return l});
function hallLightPoints(){return plan.hallLights}
const globalClip=new THREE.Plane(new THREE.Vector3(0,0,-1),100);
const palette={wall:0xf4ead8,partition:0xe7e4d7,slab:0xd9cbb5,stone:0xc7b89f,wood:0x96765a,metal:0x514238,glass:0x77b3bb,tile:0xc9d6ce,sanitary:0xf9f8ee,seat:0xa9b89a};
const materials=[],model=new THREE.Group(),roofGroup=new THREE.Group(),dimGroup=new THREE.Group();dimGroup.name='Dimensions';scene.add(model);let floors=[],labelDefs=[],colliders=[],openingsDrawn=[],furnitureObstacles=[],modelObjects=[],cutMaterials=[];
const floorTexture=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#e6e4d9';g.fillRect(0,0,256,256);g.strokeStyle='#d1d3c7';g.lineWidth=2;g.strokeRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1.25,1.25);t.colorSpace=THREE.SRGBColorSpace;return t})();
function mat(key,extra={}){const m=new THREE.MeshStandardMaterial({color:palette[key]||key,roughness:.78,metalness:key==='metal'?.25:0,...extra});m.userData={base:m.color.clone(),originalOpacity:m.opacity,originalTransparent:m.transparent};m.clippingPlanes=[globalClip];materials.push(m);return m}
const mats={};Object.keys(palette).forEach(k=>mats[k]=mat(k));mats.glass=mat('glass',{transparent:true,opacity:.52,roughness:.16,metalness:.25,depthWrite:false});mats.floor=mat(0xffffff,{map:floorTexture});
mats.diagram=mat(0xd9a961,{roughness:.62});
const exteriorMats={bronze:mat(0xa48452,{metalness:.65,roughness:.3}),dark:mat(0x343c3a),paving:mat(0xe1d4bc),soil:mat(0x514737),grass:mat(0x667e47),leaf:mat(0x426248),leafLight:mat(0x728653),flower:mat(0xecc6af),bark:mat(0x766047),glow:mat(0xffe3a6,{emissive:0xffbe62,emissiveIntensity:.25})};
function box(g,name,x,y,z,w,h,d,material=mats.wall,kind='structure'){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.name=name;m.userData.kind=kind;m.castShadow=true;m.receiveShadow=true;g.add(m);modelObjects.push(m);if(kind==='furniture'&&y-h/2<1.7&&y+h/2>.1){let parent=g;while(parent&&parent.userData.level===undefined)parent=parent.parent;if(parent)furnitureObstacles.push({floor:parent.userData.level,x,z,w,d})}return m}
function line(g,pts,color=0x4f6853,overlay=false){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color,transparent:true,opacity:overlay?.9:.6,depthTest:!overlay,depthWrite:!overlay}));if(overlay)l.renderOrder=999;g.add(l);return l}
// Lower priority wins the overlap contest, so the hall label is never the one dropped.
function label(g,text,x,y,z,kind='room',sub='',priority=2){const el=document.createElement('div');el.className='model-label'+(kind==='dim'?' dim':'');el.style.display='none';el.textContent=text;if(sub){const s=document.createElement('small');s.textContent=sub;el.append(s)}$('labelLayer').append(el);labelDefs.push({g,pos:new THREE.Vector3(x,y,z),el,kind,priority:priority+(g.userData.level||0)*.5})}
function slab(g,y,holes=false,roof=false){const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(W,0);shape.lineTo(W,D+E);shape.lineTo(EX,D+E);shape.lineTo(EX,D);shape.lineTo(0,D);shape.closePath();if(holes){for(const [x,z,w,d] of [[plan.stair.x,plan.stair.z,plan.stair.width,plan.stair.depth]]){const p=new THREE.Path();p.moveTo(x,z);p.lineTo(x,z+d);p.lineTo(x+w,z+d);p.lineTo(x+w,z);p.closePath();shape.holes.push(p)}if(plan.rearStair){const rear=new THREE.Path();rear.moveTo(11.65,.25);rear.lineTo(11.65,3.35);rear.lineTo(12.9,3.35);rear.lineTo(12.9,1.5);rear.lineTo(15.2,1.5);rear.lineTo(15.2,.25);rear.closePath();shape.holes.push(rear)}}const geo=new THREE.ExtrudeGeometry(shape,{depth:SLAB,bevelEnabled:false});geo.rotateX(Math.PI/2);const mesh=new THREE.Mesh(geo,roof?mats.slab:mats.floor);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=roof?'Roof slab':'Floor slab';mesh.userData.kind='slab';g.add(mesh);modelObjects.push(mesh)}
// Each opening is a genuine gap, with lintel and sill constructed around it.
function wall(g,name,axis,a,b,c,h,openings=[],outer=false,cut=false){let cursor=a;const thick=outer?T:.14;const material=mats[outer?'wall':'partition'];const group=new THREE.Group();group.name=name;group.userData={kind:'wall',cut};g.add(group);const add=(s,e,y,ht)=>{if(e-s<.005||ht<.005)return;const x=axis==='x'?(s+e)/2:c,z=axis==='x'?c:(s+e)/2;const m=box(group,name,x,y,z,axis==='x'?e-s:thick,ht,axis==='x'?thick:e-s,material,'wall');colliders.push({floor:g.userData.level,axis,a:s,b:e,c,yMin:y-ht/2,yMax:y+ht/2,thick})};for(const o of [...openings].sort((a,b)=>a.a-b.a)){openingsDrawn.push({floor:g.userData.level,axis,c,...o});add(cursor,o.a,h/2,h);const sill=o.window?(o.sill??(o.tall?.24:.92)):0,head=o.window?(o.head??(o.tall?h-.22:2.42)):2.38;add(o.a,o.b,sill/2,sill);add(o.a,o.b,(head+h)/2,h-head);if(o.window){colliders.push({floor:g.userData.level,axis,a:o.a,b:o.b,c,yMin:sill,yMax:head,thick});const x=axis==='x'?(o.a+o.b)/2:c,z=axis==='x'?c:(o.a+o.b)/2,w=o.b-o.a,cy=(sill+head)/2,gh=head-sill;box(group,o.tall?'Tall banquet glazing':'Assumed window glass',x,cy,z,axis==='x'?w:.04,gh,axis==='x'?.04:w,mats.glass,'window');[o.a,o.b,(o.a+o.b)/2].forEach(p=>box(group,'Window frame',axis==='x'?p:c,cy,axis==='x'?c:p,axis==='x'?.045:.06,gh+.04,axis==='x'?.06:.045,mats.metal,'window'));[sill,head].forEach(y=>box(group,'Window frame',x,y,z,axis==='x'?w:.06,.045,axis==='x'?.06:w,mats.metal,'window'))}else if(o.door){const w=o.b-o.a;const pivot=new THREE.Group();pivot.position.set(axis==='x'?o.a:c,0,axis==='x'?c:o.a);pivot.rotation.y=axis==='x'?(o.inward?Math.PI*.34:-Math.PI*.34):-Math.PI/2-Math.PI*.16;box(pivot,'Open door leaf',w/2,1.17,0,w,2.34,.045,o.glazed?mats.glass:mats.wood,'door');if(o.glazed){for(const edge of [0,w])box(pivot,'Bronze entrance stile',edge,1.17,0,.065,2.34,.065,exteriorMats.bronze,'door');for(const y of [.035,2.305])box(pivot,'Bronze entrance rail',w/2,y,0,w,.07,.065,exteriorMats.bronze,'door');box(pivot,'Entrance pull handle',w-.16,1.15,.08,.035,.62,.035,exteriorMats.bronze,'door')}pivot.userData.kind='doorAssembly';group.add(pivot);for(const edge of [o.a,o.b])box(group,'Door jamb',axis==='x'?edge:c,1.19,axis==='x'?c:edge,axis==='x'?.07:thick+.025,2.38,axis==='x'?thick+.025:.07,mats.wood,'door');box(group,'Door frame header',axis==='x'?(o.a+o.b)/2:c,2.38,axis==='x'?c:(o.a+o.b)/2,axis==='x'?w+.07:thick+.025,.07,axis==='x'?thick+.025:w+.07,mats.wood,'door');box(group,'Door threshold',axis==='x'?(o.a+o.b)/2:c,.012,axis==='x'?c:(o.a+o.b)/2,axis==='x'?w:.22,.024,axis==='x'?.22:w,mats.stone,'door')}cursor=o.b;}add(cursor,b,h/2,h);return group}
function toilet(g,x,z){const base=box(g,'WC pedestal',x,.22,z,.35,.44,.5,mats.sanitary,'furniture');const seat=new THREE.Mesh(new THREE.TorusGeometry(.21,.065,8,22),mats.sanitary);seat.rotation.x=Math.PI/2;seat.scale.y=1.3;seat.position.set(x,.48,z+.04);seat.name='Toilet seat';seat.userData.kind='furniture';g.add(seat);modelObjects.push(seat);box(g,'WC cistern',x,.66,z-.26,.44,.5,.15,mats.sanitary,'furniture')}
function rail(g,x1,z1,x2,z2,y1,y2){const n=Math.max(2,Math.ceil(Math.hypot(x2-x1,z2-z1)/.5)),rise=stairMetrics(plan.stair.depth,state.height).rise;for(let i=0;i<=n;i++){const t=i/n,top=y1+(y2-y1)*t+1,base=y1===y2?y1:Math.floor((y1+(y2-y1)*t)/rise)*rise;box(g,'Baluster',x1+(x2-x1)*t,(base+top)/2,z1+(z2-z1)*t,.035,top-base,.035,mats.metal)}const from=new THREE.Vector3(x1,y1+1,z1),to=new THREE.Vector3(x2,y2+1,z2),v=to.clone().sub(from);const m=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,v.length(),8),mats.metal);m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.name='Stair handrail';g.add(m);modelObjects.push(m)}
function stairWaist(g,name,c,start,end,y0,y1,width,alongX=false){
 const length=Math.hypot(end-start,y1-y0),m=box(g,name,alongX?(start+end)/2:c,(y0+y1)/2-.12,alongX?c:(start+end)/2,alongX?length:width,.24,alongX?width:length,mats.stone);
 if(alongX)m.rotation.z=Math.atan2(y1-y0,end-start);else m.rotation.x=-Math.atan2(y1-y0,end-start);
}
// Riser count follows the storey height so the slider can never exceed a 190 mm rise.
// Where the drawn well is too shallow for a usable going the treads are tinted as
// diagrammatic rather than quietly presented as buildable.
function treadMaterial(going){return going<TARGET_GOING?mats.diagram:mats.stone}
function stairs(g,x,z,w,depth,h,name){const sm=stairMetrics(depth,h),n=sm.perFlight,run=sm.going,tm=treadMaterial(run);for(let i=0;i<n;i++){box(g,name+' lower flight',x+w*.25,(i+1)*h/4/n,z+depth-(i+.5)*run,w*.49,(i+1)*h/2/n,run,tm);box(g,name+' upper flight',x+w*.75,h/2+(i+1)*h/4/n,z+.88+(i+.5)*run,w*.49,(i+1)*h/2/n,run,tm)}stairWaist(g,name+' upper waist',x+w*.75,z+.88,z+depth,h/2,h,w*.49);box(g,name+' mid landing',x+w/2,h/2-.09,z+.44,w,.18,.88,mats.stone);rail(g,x+.04,z+depth,x+.04,z+.88,0,h/2);rail(g,x+w-.04,z+.88,x+w-.04,z+depth,h/2,h);rail(g,x+.04,z+.05,x+w-.04,z+.05,h/2,h/2)}

function rearStairs(g,h){const sm=stairMetrics(2.73,h),n=sm.perFlight,tm=treadMaterial(1.85/n);for(let i=0;i<n;i++){box(g,'Rear L stair lower flight',12.275,(i+1)*h/4/n,3.35-(i+.5)*1.85/n,1.25,(i+1)*h/2/n,1.85/n,tm);box(g,'Rear L stair upper flight',12.9+(i+.5)*2.3/n,h/2+(i+1)*h/4/n,.875,2.3/n,(i+1)*h/2/n,1.25,tm)}stairWaist(g,'Rear upper waist',.875,12.9,15.2,h/2,h,1.25,true);box(g,'Rear quarter-turn landing',12.275,h/2-.09,.875,1.25,.18,1.25,mats.stone);rail(g,11.7,3.35,11.7,1.5,0,h/2);rail(g,11.7,.3,12.9,.3,h/2,h/2);rail(g,12.9,.3,15.2,.3,h/2,h)}
function deskSet(f,x,z){box(f,'Room desk',x,.75,z,1.5,.09,.7,mats.wood,'furniture');for(const dx of [-.65,.65])box(f,'Desk leg',x+dx,.36,z,.06,.72,.5,mats.metal,'furniture');box(f,'Chair seat',x,.48,z+.65,.48,.1,.48,mats.seat,'furniture');box(f,'Chair back',x,.78,z+.87,.48,.55,.06,mats.seat,'furniture');for(const dx of [-.18,.18])for(const dz of [-.18,.18])box(f,'Chair leg',x+dx,.215,z+.65+dz,.045,.43,.045,mats.metal,'furniture')}
function benches(f,xs,zs){for(const z of zs)for(const x of xs){box(f,'Hall bench',x,.46,z,1.8,.11,.5,mats.wood,'furniture');for(const dx of [-.65,.65])box(f,'Bench support',x+dx,.22,z,.09,.44,.4,mats.metal,'furniture')}}
function diningTable(f,x,z){box(f,'Round table top',x,.74,z,1.3,.07,1.3,mats.wood,'furniture');box(f,'Table pedestal',x,.37,z,.22,.68,.22,mats.metal,'furniture');for(const [dx,dz] of [[-.85,0],[.85,0],[0,-.85],[0,.85]]){box(f,'Dining chair seat',x+dx,.45,z+dz,.45,.1,.45,mats.seat,'furniture');box(f,'Dining chair back',x+dx*1.26,.75,z+dz*1.26,dz?.45:.06,.5,dz?.06:.45,mats.seat,'furniture')}}
// Fixture descriptors are interpreted here so the layout data stays free of
// three.js objects and remains serialisable.
function buildFixtures(g){const f=new THREE.Group();f.name=plan.name+' fixtures';f.userData.kind='fixtures';g.add(f);
 for(const item of planFixtures(plan)){
  if(item[0]==='wc')toilet(f,item[1],item[2]);
  else if(item[0]==='desk')deskSet(f,item[1],item[2]);
  else if(item[0]==='table')diningTable(f,item[1],item[2]);
  else if(item[0]==='benches')benches(f,item[1],item[2]);
  else box(f,item[1],item[2],item[3],item[4],item[5],item[6],item[7],mats[item[8]],'furniture');
 }
 return f}

function banquetFacade(g,level,h){
 const f=new THREE.Group();f.name='Banquet facade';f.userData.cut=true;g.add(f);
 for(const [x,z,w,d] of [[EX/2,D+.13,EX+.3,.3],[(EX+W)/2,D+E+.13,W-EX+.3,.3],[W+.13,(D+E)/2,.3,D+E],[EX-.13,D+E/2,.3,E]]){
  box(f,'Ivory cornice',x,h-.04,z,w,.2,d,mats.wall);
  box(f,'Bronze reveal',x,h-.19,z,w,.035,d+.015,exteriorMats.bronze);
  box(f,'Warm facade light',x,h-.23,z,w,.025,d+.02,exteriorMats.glow);
 }
 for(const x of plan.facadePiers){box(f,'Front stone pier',x,h/2,D+.15,.34,h,.28,mats.stone);box(f,'Pier bronze inlay',x,h/2,D+.3,.055,h-.15,.025,exteriorMats.bronze)}
 for(const x of [EX+.2,12.72,W-.2])box(f,'Entrance stone pier',x,h/2,D+E+.15,.34,h,.28,mats.stone);
 for(let z=D+.3;z<D+E-.15;z+=.24)box(f,'Vertical bronze screen',EX-.17,h/2,z,.16,h-.3,.065,exteriorMats.bronze);
 // The canopy is carried by two columns, with a clear approach between them.
 if(level===0){const z=D+E,c=plan.entryCenter,cy=Math.min(2.78,state.height-.3);
  box(f,'Entrance canopy',c,cy,z+.7,3.8,.18,1.9,exteriorMats.dark);
  box(f,'Canopy bronze fascia',c,cy+.03,z+1.66,3.85,.23,.07,exteriorMats.bronze);
  box(f,'Canopy soffit light',c,cy-.1,z+1.35,3.35,.025,.055,exteriorMats.glow);
  for(const x of [c-1.75,c+1.75])box(f,'Canopy support',x,(cy-.08)/2,z+1.38,.12,cy-.08,.12,exteriorMats.bronze);
 }
}

function fillList(id,items){const el=$(id);el.textContent='';for(const text of items){const li=document.createElement('li');li.textContent=text;el.append(li)}}
function fillRows(id,rows){const el=$(id);el.textContent='';for(const [k,v] of rows){const tr=document.createElement('tr');for(const value of [k,v]){const td=document.createElement('td');td.textContent=value;tr.append(td)}el.append(tr)}}
function stairReview(){const st=plan.stair,sm=stairMetrics(st.depth,state.height);
 return {front:{risers:sm.risers,rise:sm.rise,tread:sm.going,wellDepth:st.depth,requiredWellDepth:sm.requiredDepth,shortfall:sm.shortfall,verdict:sm.verdict,upperLandingClear:D+E-T/2-(st.z+st.depth)},
  rear:plan.rearStair?{risers:sm.risers,rise:sm.rise,lowerTread:1.85/sm.perFlight,upperTread:2.3/sm.perFlight}:null,
  status:'Concept only. Risers are capped at 190 mm by raising the riser count; the going is limited by the drawn well depth and cannot be fixed without redesign. Verify treads, risers, headroom, handrails, accessibility and evacuation with an architect.'}}
function refreshPlanUI(){
 $('planSelect').value=plan.id;$('projectDrawing').textContent=plan.name+' · Drawing '+plan.drawing+' · G + 1';
 $('planDescription').textContent=plan.tagline;
 // Built as DOM rather than innerHTML: plan data is trusted today, but the CSP
 // and this code should not depend on that staying true.
 const list=$('roomList');list.textContent='';
 Object.entries(rooms).forEach(([id,r],i)=>{const b=document.createElement('button');b.dataset.room=id;const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');const s=document.createElement('small');s.textContent=r.size;b.append(n,document.createTextNode(r.title),s);b.onclick=()=>focusRoom(id);list.append(b)});
 fillRows('sourceReadings',plan.readings);
 fillList('sourceConflicts',plan.conflicts||[]);
 fillList('sourceNotes',[...plan.notes,'Heights, structure, openings, materials and landscaping are conceptual. No elevations, structural design or site survey supplied.']);
 $('sourceDrawingTitle').textContent=plan.name+' · drawing '+plan.drawing;
 $('sourcePreview').hidden=!drawingURLs[plan.id];$('sourcePreview').src=drawingURLs[plan.id]||'';$('sourceUpload').value='';
 $('sourcePrivacy').textContent='Open drawing '+plan.drawing+' from your device. It stays local and is associated only with '+plan.name+'.';
 $('spaceTitle').textContent=plan.name+' · A place to celebrate.';$('spaceDesc').textContent=plan.blurb;
 $('statOne').style.fontSize='';$('statTwo').style.fontSize='';$('statOne').textContent='2';$('statOneLabel').textContent='FLOORS';$('statTwo').textContent=W.toFixed(2)+' m';$('statTwoLabel').textContent='BLOCK WIDTH';$('enter').dataset.room='hall';$('enter').textContent='Enter hall ↗';
 $('exportDescription').textContent='Export '+plan.name+' · drawing '+plan.drawing+'. All exports use the selected plan.';
}
function switchPlan(id,persist=true){
 if(!plans[id])return;
 plan=plans[id];T=plan.wallThickness;selectedRoom='';planViewport.reset([...PLAN_VIEWBOX]);({width:W,depth:D,extension:E,extensionX:EX,rooms}=plan);
 keys.clear();drag=null;clearMeasure();measureActive=false;$('measureInfo').hidden=true;$('measure').classList.remove('active');
 state.explode=0;state.section=100;state.floor='both';$('explode').value=0;$('section').value=100;
 refreshPlanUI();build();setMode(webglAvailable?'exterior':'plan');
 if(persist){try{window.localStorage.setItem('plan-atlas-plan',id)}catch{}syncURL()}
 toast(plan.name+' · Drawing '+plan.drawing);
}

function build(){cutMaterials.forEach(m=>m.dispose());cutMaterials=[];model.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isLine)o.material.dispose()});model.clear();floors=[];colliders=[];openingsDrawn=[];furnitureObstacles=[];modelObjects=[];labelDefs.forEach(l=>l.el.remove());labelDefs=[];const h=state.height-SLAB;
for(let level=0;level<2;level++){const g=new THREE.Group();g.name=level?'First floor (assumed repeat)':'Ground floor';g.userData.level=level;model.add(g);floors.push(g);slab(g,0,level===1);
// One renderer, driven by the plan descriptors in plans.js, so an alternative
// is a data entry instead of a second code path.
for(const [name,axis,a,b,c,openings,outer,cut] of planShell(plan,level))wall(g,name,axis,a,b,c,h,openings,outer,cut);
for(const [x,z] of columnPoints())box(g,'Column',x,h/2,z,columnSize(),h,columnSize(),mats.stone);
for(const x of [EX+.11,12.72,W-.11])box(g,'Entrance column',x,h/2,D+E-.11,.28,h,.28,mats.stone);
const st=plan.stair;
if(level===0){if(plan.rearStair)rearStairs(g,state.height);stairs(g,st.x,st.z,st.width,st.depth,state.height,'Front stair')}
else for(const [x1,z1,x2,z2] of planRails(plan))rail(g,x1,z1,x2,z2,0,0);
banquetFacade(g,level,h);
g.userData.fixtures=buildFixtures(g);
for(const [text,x,z,kind='room',sub='',priority=2] of planLabels(plan,level))label(g,text,x,.16,z,kind,sub,priority);
const fit=new THREE.Group();fit.userData.cut=true;g.add(fit);for(const [x,z] of hallLightPoints())box(fit,'Ceiling light fitting',x,h-.05,z,.7,.1,.7,exteriorMats.glow,'fixture');
const clipPlane=new THREE.Plane(new THREE.Vector3(0,-1,0),1.15);g.userData.cutPlane=clipPlane;const variants=new Map();g.traverse(o=>{if(!o.isMesh)return;let parent=o.parent,cut=false;while(parent&&parent!==g){cut ||= !!parent.userData.cut;parent=parent.parent}if(cut){const original=o.material;let variant=variants.get(original);if(!variant){variant=original.clone();variant.clippingPlanes=[globalClip,clipPlane];variant.clipShadows=true;variants.set(original,variant);cutMaterials.push(variant)}o.userData.fullMaterial=original;o.userData.cutMaterial=variant;}});
}
roofGroup.traverse(o=>o.geometry?.dispose());roofGroup.clear();slab(roofGroup,0,false,true);for(const [a,b,c,axis] of [[0,W,0,'x'],[0,D,0,'z'],[0,D+E,W,'z'],[0,EX,D,'x'],[EX,W,D+E,'x'],[D,D+E,EX,'z']]){box(roofGroup,'Roof parapet',axis==='x'?(a+b)/2:c,.4,axis==='x'?c:(a+b)/2,axis==='x'?b-a:.14,.8,axis==='x'?.14:b-a,mats.wall)}model.add(roofGroup);
// One annotation layer for the whole model, not a copy per storey, drawn as an
// overlay so a dimension line and its value are never separated.
dimGroup.clear();model.add(dimGroup);
const dim=pts=>line(dimGroup,pts,0x2f5a46,true);
dim([[0,.04,-1],[W,.04,-1]]);for(const x of [0,W])dim([[x,.04,-.75],[x,.04,-1.25]]);
label(dimGroup,W.toFixed(3)+' m overall width',W/2,.08,-1.05,'dim','',3);
dim([[-1,.04,0],[-1,.04,D]]);for(const z of [0,D])dim([[-.75,.04,z],[-1.25,.04,z]]);
label(dimGroup,D.toFixed(3)+' m block depth',-1.1,.08,D/2,'dim','',3);
dim([[W+1,.04,D],[W+1,.04,D+E]]);for(const z of [D,D+E])dim([[W+.75,.04,z],[W+1.25,.04,z]]);
label(dimGroup,E.toFixed(4)+' m projection'+(plan.projectionProvisional?' *':''),W+1.35,.08,D+E/2,'dim','',3);
const rearZ=Math.min(...columnPoints().map(([,z])=>z)),bays=[...new Set(columnPoints().filter(([,z])=>Math.abs(z-rearZ)<1e-6).map(([x])=>x))].sort((a,b)=>a-b);
for(let i=0;i<bays.length-1;i++){dim([[bays[i],.04,-2],[bays[i+1],.04,-2]]);for(const x of [bays[i],bays[i+1]])dim([[x,.04,-1.8],[x,.04,-2.2]]);label(dimGroup,(bays[i+1]-bays[i]).toFixed(3),(bays[i]+bays[i+1])/2,.08,-2.05,'dim','',4)}
buildSite();update();}
// Landscape is an illustrative proposal, not a surveyed site boundary.
const site=new THREE.Group();site.name='Proposed banquet garden';scene.add(site);
const landscape=new THREE.Group(),gardenLights=[],siteBaseMaterial=mat(0xc6ceba);
function foliage(name,x,y,z,rx,ry,rz,material){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),material);m.name=name;m.position.set(x,y,z);m.scale.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;landscape.add(m);return m}
function gardenBed(x,z,w,d){box(landscape,'Garden stone border',x,.12,z,w,.24,d,mats.stone,'site');box(landscape,'Planted soil',x,.23,z,w-.16,.08,d-.16,exteriorMats.soil,'site');box(landscape,'Garden lawn',x,.278,z,w-.3,.025,d-.3,exteriorMats.grass,'site');}
function buildSite(){site.traverse(o=>o.geometry?.dispose());landscape.clear();site.clear();site.add(landscape);gardenLights.length=0;
box(site,'Presentation base',W/2,-.4,(D+E)/2,24,.4,D+E+10,siteBaseMaterial,'site');
box(site,'Entrance terrace',W/2,-.1,(D+E+2.5)/2,19.5,.2,D+E+4.5,exteriorMats.paving,'site');
gardenBed(3.9,17.1,6.6,4.7);gardenBed(18.25,8.8,1.25,16.2);
for(const x of [1.2,2.3,3.4,4.5,5.6,6.7])for(const z of [15.15,19.05]){foliage('Low garden hedge',x,.52,z,.5,.29,.32,exteriorMats.leaf);for(let j=0;j<3;j++)foliage('Flower border',x-.25+j*.25,.76,z,.095,.08,.095,exteriorMats.flower)}
for(const z of [2,4,6,8,10,12,14,16])foliage('Side garden shrub',18.25,.59,z,.43,.35,.65,exteriorMats.leafLight);
for(const [x,z] of [[1.6,16.5],[6.1,17.3],[18.3,3],[18.3,12.4]]){
 box(landscape,'Garden tree trunk',x,1.24,z,.14,2,.14,exteriorMats.bark,'site');
 foliage('Garden tree crown',x,2.45,z,.78,1,.78,exteriorMats.leaf);
 foliage('Garden tree crown',x+.42,2.25,z+.15,.55,.68,.55,exteriorMats.leafLight);
}
// Broad, flush paving keeps the route to the ground-floor door clear.
for(let z=D+E+.25;z<=D+E+3.1;z+=.6)box(site,'Entrance paving joint',plan.entryCenter,.006,z,3.2,.012,.025,mats.stone,'site');
for(const x of [8,plan.entryCenter-2.7,plan.entryCenter+2.7])for(const z of [D+E+.7,D+E+2.7]){box(site,'Garden bollard',x,.3,z,.12,.6,.12,exteriorMats.dark,'site');box(site,'Bollard lantern',x,.61,z,.15,.12,.15,exteriorMats.glow,'site')}
for(const x of [3.2,5.2]){box(landscape,'Garden bench seat',x,.52,18.1,1.55,.12,.48,mats.wood,'site');for(const dx of [-.6,.6])box(landscape,'Garden bench support',x+dx,.37,18.1,.08,.28,.38,exteriorMats.dark,'site')}
for(const [x,z] of [[plan.entryCenter-1.4,D+E+.8],[plan.entryCenter+1.5,D+E+.8],[4,17]]){const l=new THREE.PointLight(0xffc783,state.light==='evening'?14:0,8,2);l.position.set(x,2.5,z);site.add(l);gardenLights.push(l)}
}
const grid=new THREE.GridHelper(50,50,0x9aa58f,0xc3ccba);grid.position.set(W/2,.018,8.8);scene.add(grid);
const measureGroup=new THREE.Group();scene.add(measureGroup);
let measureActive=false,measurePoints=[],walkYaw=0,walkPitch=0,walkY=0,drag=null,lastTime=performance.now();const keys=new Set();
const drawer=setupDrawer({onPause:()=>{keys.clear();drag=null;controls.autoRotate=false;$('rotate').classList.remove('active')}});
function update(){$('main').dataset.mode=state.mode;$('labelLayer').hidden=state.mode==='plan'||state.mode==='walk';site.visible=state.mode!=='plan'&&state.floor!=='1';
// Style/cutaway sync happens in one traversal per storey, not two.
materials.forEach(m=>{m.wireframe=state.style==='wire';m.color.copy(state.style==='clay'?new THREE.Color(0xf1f0e9):m.userData.base);m.map=m===mats.floor&&state.style==='material'?floorTexture:null;m.needsUpdate=true});
floors.forEach((g,i)=>{g.position.y=i*(state.height+explodedOffset());g.userData.cutPlane.constant=g.position.y+1.15;g.visible=state.mode==='walk'||state.floor==='both'||state.floor===String(i);g.userData.fixtures.visible=state.furniture;g.traverse(o=>{if(o.isMesh&&o.userData.fullMaterial){o.visible=true;const original=o.userData.fullMaterial,variant=o.userData.cutMaterial;variant.color.copy(original.color);variant.map=original.map;variant.wireframe=original.wireframe;variant.needsUpdate=true;o.material=state.mode==='cutaway'?variant:original;}})});
dimGroup.visible=state.dimensions&&state.mode!=='plan'&&state.mode!=='walk';
const lit=state.light==='evening'?17:state.mode==='walk'?6:0,litY=(state.floor==='1'?state.height+explodedOffset():0)+state.height-.45;
hallLightPoints().forEach(([x,z],i)=>{interiorLights[i].position.set(x,litY,z);interiorLights[i].intensity=state.mode==='plan'?0:lit});
roofGroup.position.y=state.height*2+explodedOffset();roofGroup.visible=state.roof&&(state.mode==='walk'||state.floor!=='0')&&state.mode!=='plan';grid.visible=state.grid;globalClip.constant=state.section===100?100:(D+E)*state.section/100;$('explodeOut').textContent=explodedOffset()>0?explodedOffset().toFixed(1)+' m':'Assembled';$('heightOut').textContent=state.height.toFixed(1)+' m';const sr=stairReview().front;$('stairReview').textContent='Front stair: '+Math.round(sr.rise*1000)+' mm rise / '+Math.round(sr.tread*1000)+' mm going · '+sr.upperLandingClear.toFixed(2)+' m upper landing. '+(sr.shortfall>.01?'Well is '+sr.shortfall.toFixed(2)+' m too shallow for a '+Math.round(TARGET_GOING*1000)+' mm going — treads shown in amber are diagrammatic.':'Meets the '+Math.round(TARGET_GOING*1000)+' mm going target; headroom and width still need review.');$('stairReview').classList.toggle('warn',sr.shortfall>.01);$('sectionOut').textContent=state.section===100?'Full':Math.round(state.section)+'%';document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('active',b.dataset.floor===state.floor));document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));$('walkControls').hidden=state.mode!=='walk';$('planView').hidden=state.mode!=='plan';canvas.style.visibility=state.mode==='plan'?'hidden':'visible';$('explode').disabled=state.mode!=='cutaway'||state.floor!=='both';$('roof').disabled=state.mode==='plan';for(const id of ['labels','dimensions','furniture','grid','section','style','light'])$(id).disabled=state.mode==='plan';
// Room labels only read inside the cutaway, so the toggle says so instead of doing nothing.
$('labels').disabled=state.mode!=='cutaway';$('dimensions').disabled=state.mode==='plan'||state.mode==='walk';
for(const id of ['bird','top','front','rotate'])$(id).disabled=!webglAvailable;document.querySelectorAll('[data-mode]').forEach(b=>{b.disabled=!webglAvailable&&b.dataset.mode!=='plan';b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode))});document.querySelectorAll('[data-floor]').forEach(b=>{b.disabled=state.mode==='plan'&&b.dataset.floor==='both';b.setAttribute('aria-pressed',String(b.dataset.floor===state.floor))});$('viewChip').innerHTML='<i></i>'+(!webglAvailable?'2D · NO WEBGL':({walk:'INTERIOR',plan:'2D PLAN',cutaway:explodedOffset()>0?'EXPLODED VIEW':state.floor==='both'?'ASSEMBLED 3D':'ISOLATED FLOOR',exterior:'ASSEMBLED 3D'}[state.mode]));$('viewTitle').textContent={cutaway:'A new perspective.',exterior:'Outside, all around.',walk:'Step into the space.',plan:'Every line has a place.'}[state.mode];$('interactionHint').textContent=!webglAvailable?'2D fallback · drag to pan · pinch / + − to zoom':state.mode==='walk'?(touchDevice?'Drag to look · Hold arrows to walk':'Drag to look · WASD to move'):state.mode==='plan'?'Drag to pan · pinch / scroll / + − to zoom · Fit to reset':(touchDevice?'Drag to orbit · Pinch to zoom':'Drag to orbit · Scroll to zoom · Right-drag to pan');document.querySelector('.walk-hint').textContent=touchDevice?'Drag to look · Hold arrows to walk · the stairs carry you between floors':'Drag to look · WASD / arrows to move · Q and E turn · walk up the stairs to change floor';$('compass').hidden=state.mode==='walk';$('spaceCard').style.display=state.mode==='plan'?'none':'';if(state.mode==='plan')renderPlan();invalidate();syncURL();}
function explodedOffset(){return state.mode==='cutaway'&&state.floor==='both'?state.explode:0}
function floorY(){return state.floor==='1'?state.height:0}
// Camera presets are fitted to the model instead of trusting hand-placed
// coordinates. On a 390-wide portrait viewport the fixed positions sat about a
// quarter too far back, which is where the dead space above and below came from.
const fitSphere=new THREE.Sphere(),fitBox=new THREE.Box3();
function frameRadius(includeSite=false){
 fitBox.setFromCenterAndSize(new THREE.Vector3(W/2,(state.height*2+.8)/2,(D+E)/2),new THREE.Vector3(W,state.height*2+.8,D+E));
 if(includeSite)fitBox.expandByScalar(3);
 return fitBox.getBoundingSphere(fitSphere).radius;
}
function fitDistance(radius){const v=camera.fov*Math.PI/180,h=2*Math.atan(Math.tan(v/2)*Math.max(.1,camera.aspect));return radius*1.05/Math.sin(Math.max(.05,Math.min(v,h))/2)}
let autoFit=null,fitting=false;
function placeView({pos,target,fitRadius}){
 let p=new THREE.Vector3(...pos);
 if(fitRadius>0){const t=new THREE.Vector3(...target);p=t.clone().add(p.clone().sub(t).normalize().multiplyScalar(fitDistance(fitRadius)))}
 camera.position.copy(p);controls.target.set(...target);camera.lookAt(...target);ortho.position.copy(p);ortho.lookAt(...target);
}
function view(pos,target,orthographic=false,fitRadius=0){ortho.zoom=1;orthoMode=orthographic;activeCamera=orthographic?ortho:camera;controls.enabled=!orthographic&&state.mode!=='walk';
 autoFit=fitRadius>0&&!orthographic?{pos:[...pos],target:[...target],fitRadius}:null;
 resize();if(!autoFit)placeView({pos,target,fitRadius:0});invalidate()}
function bird(){if(!webglAvailable){setMode('plan');return}if(state.mode==='walk'||state.mode==='plan')setMode('cutaway');const y=state.floor==='1'?state.height+explodedOffset():2;view([30,29,36],[W/2,y,8.1],false,frameRadius());}
function setMode(mode){if(!webglAvailable&&mode!=='plan'){toast('3D requires WebGL. This browser can use the 2D plan and all model exports.');mode='plan'}state.mode=mode;keys.clear();clearMeasure();canvas.style.cursor='';measureActive=false;$('measure').classList.remove('active');$('measureInfo').hidden=true;controls.autoRotate=false;$('rotate').classList.remove('active');if(mode==='exterior'){state.roof=true;$('roof').checked=true;state.explode=0;$('explode').value=0;state.floor='both';state.section=100;$('section').value=100;view([31,15,39],[W/2,2.3,10],false,frameRadius(true))}if(mode==='cutaway'){state.roof=false;$('roof').checked=false;view([29,28,36],[W/2,2.5,8.4],false,frameRadius())}if(mode==='walk'){state.floor=state.floor==='1'?'1':'0';state.explode=0;$('explode').value=0;state.roof=true;$('roof').checked=true;state.section=100;$('section').value=100;walkY=floorY();view([rooms.hall.x,floorY()+1.65,rooms.hall.z],[rooms.hall.x,floorY()+1.65,3]);walkYaw=0;walkPitch=0;controls.enabled=false}if(mode==='plan'){state.floor=state.floor==='both'?'0':state.floor;controls.enabled=false}update();drawer.close()}
function focusRoom(id){const r=rooms[id];if(!r)return;selectedRoom=id;$('spaceTitle').textContent=r.title;$('spaceDesc').textContent=r.desc;$('statOne').textContent=r.size;$('statOne').style.fontSize='11px';$('statOneLabel').textContent='PLAN READING';$('statTwo').textContent=r.area;$('statTwo').style.fontSize='11px';$('statTwoLabel').textContent=r.areaLabel||'DRAWING AREA';$('enter').textContent='Step inside ↗';$('enter').dataset.room=id;document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('active',b.dataset.room===id));if(state.mode==='walk'){const target=safeWalkTarget(r);camera.position.set(target.x,floorY()+1.65,target.z);walkYaw=id==='hall'?0:Math.PI;walkPitch=0}else if(state.mode!=='plan'){const y=state.floor==='0'?0:state.height+explodedOffset();view([r.x+9,y+12,r.z+11],[r.x,y+1,r.z],false,6.5)}else{renderPlan(id)}drawer.close()}
function clearMeasure(){measurePoints=[];if(measureActive)$('measureInfo').textContent='Click two points on any visible surface to measure.';measureGroup.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});measureGroup.clear()}
function formatDistance(v){if(state.units==='m')return v.toFixed(2)+' m';const total=Math.round(v/.0254);return Math.floor(total/12)+'′ '+total%12+'″'}
function download(name,data,type){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
const xmlText=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function svgText(x,z,s,size=.23,color='#42604a',anchor='middle'){return `<text x="${x}" y="${z}" text-anchor="${anchor}" font-size="${size}" fill="${color}" font-family="Arial,sans-serif">${xmlText(s)}</text>`}
// Scale bar, north arrow, dimension chains and a title block, shared by both plans
// so an exported sheet can actually be checked against the drawing it came from.
function svgAnnotations(floorLabel,footnotes=[]){
 const a=[],line=(d,sw=.03,color='#6d8468')=>a.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}"/>`);
 const t=(x,z,s,size=.23,color='#5d7059',anchor='middle')=>a.push(svgText(x,z,s,size,color,anchor));
 line(`M0 -1H${W}M0 -.75V-1.25M${W} -.75V-1.25`);t(W/2,-1.32,W.toFixed(3)+' m overall width · printed 54′11″',.25);
 line(`M-1 0V${D}M-1.25 0h.5M-1.25 ${D}h.5`);
 a.push(`<text x="-1.32" y="${D/2}" transform="rotate(-90 -1.32 ${D/2})" text-anchor="middle" font-size=".25" fill="#5d7059" font-family="Arial,sans-serif">${D.toFixed(3)} m printed block depth</text>`);
 line(`M${W+1} ${D}V${D+E}M${W+.75} ${D}h.5M${W+.75} ${D+E}h.5`);
 a.push(`<text x="${W+1.32}" y="${D+E/2}" transform="rotate(-90 ${W+1.32} ${D+E/2})" text-anchor="middle" font-size=".24" fill="#5d7059" font-family="Arial,sans-serif">${E.toFixed(4)} m projection${plan.projectionProvisional?' *':''}</text>`);
 // Bay chain traced from the same column grid the 3D model uses.
 const rearZ=Math.min(...columnPoints().map(([,z])=>z)),bays=[...new Set(columnPoints().filter(([,z])=>Math.abs(z-rearZ)<1e-6).map(([x])=>x))].sort((x,y)=>x-y);
 for(let i=0;i<bays.length-1;i++){line(`M${bays[i]} -2H${bays[i+1]}M${bays[i]} -1.82V-2.18M${bays[i+1]} -1.82V-2.18`,.025);t((bays[i]+bays[i+1])/2,-2.26,(bays[i+1]-bays[i]).toFixed(3),.21)}
 t(-2.3,-2.26,'BAYS',.19,'#8b9a86','start');
 // North arrow: the drawing gives no true north, so it is labelled as drawing-up.
 const nx=W+1.1,nz=1.6;
 a.push(`<circle cx="${nx}" cy="${nz}" r=".82" fill="none" stroke="#8b9a86" stroke-width=".03"/>`,`<path d="M${nx} ${nz-.62}L${nx+.26} ${nz+.28}L${nx} ${nz+.08}L${nx-.26} ${nz+.28}Z" fill="#4f6853"/>`);
 t(nx,nz+.68,'UP',.2,'#5d7059');t(nx,nz+1.18,'DRAWING TOP',.18,'#8b9a86');t(nx,nz+1.44,'true north unverified',.15,'#8b9a86');
 // Graphic scale, so the sheet stays measurable at any print size or zoom.
 const sz=D+E+1.4;
 for(let i=0;i<5;i++)a.push(`<rect x="${i}" y="${sz}" width="1" height=".22" fill="${i%2?'#fafbf5':'#4f6853'}" stroke="#4f6853" stroke-width=".02"/>`);
 for(let i=0;i<=5;i++)t(i,sz-.12,String(i),.2,'#5d7059');
 t(2.5,sz+.62,'METRES · 1 : 100 at A3',.21);
 const ty=D+E+2.3;
 a.push(`<rect x="7" y="${ty}" width="${Math.max(9,W-7)}" height="2.5" fill="#f4f6ec" stroke="#4f6853" stroke-width=".04"/>`);
 t(7.3,ty+.52,'PLAN ATLAS · BANQUET HALL',.32,'#2f4738','start');
 t(7.3,ty+1,'Drawing '+plan.drawing+' · '+plan.name+' · '+floorLabel,.23,'#5d7059','start');
 t(7.3,ty+1.42,'Concept reconstruction from a photograph. Not a surveyed or construction drawing.',.2,'#7d8a76','start');
 t(7.3,ty+1.82,'Dimensions in millimetres on the source; metres here. Verify on site before use.',.2,'#7d8a76','start');
 footnotes.forEach((note,i)=>t(7.3,ty+2.22+i*.3,note,.19,'#8a6a3c','start'));
 return a.join('');
}
// One sheet renderer for every plan. Walls come from the collision set, columns
// from the shared grid, and the stair from the shared metrics, so the 2D sheet
// and the 3D model cannot describe different buildings.
function svgPlan(highlight=''){
 const upper=state.floor==='1',floor=upper?'FIRST FLOOR · ASSUMED REPEAT':'GROUND FLOOR';
 const st=plan.stair,sm=stairMetrics(st.depth,state.height),parts=[];
 const rect=(x,z,w,d,fill,stroke='none',sw=.035)=>`<rect x="${x}" y="${z}" width="${w}" height="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
 parts.push(`<path d="M0 0H${W}V${D+E}H${EX}V${D}H0Z" fill="#f8f7ec" stroke="#3f5747" stroke-width=".15"/>`);
 for(const item of planSheet(plan,upper)){
  if(item[0]==='zone')parts.push(rect(item[2],item[3],item[4],item[5],highlight===item[1]?'#cfe3bd':item[6],item[7]));
  else if(item[0]==='fill')parts.push(rect(item[1],item[2],item[3],item[4],item[5],item[6]));
  else if(item[0]==='text')parts.push(svgText(item[1],item[2],item[3],item[4]));
  else if(item[0]==='vtext')parts.push(`<text x="${item[1]}" y="${item[2]}" transform="rotate(-90 ${item[1]} ${item[2]})" text-anchor="middle" font-size="${item[4]}" fill="#42604a" font-family="Arial,sans-serif">${xmlText(item[3])}</text>`);
  else parts.push(`<path d="${item[1]}" fill="${item[2]}" stroke="${item[3]}" stroke-width="${item[4]}"/>`);
 }
 parts.push(rect(st.x,st.z,st.width,st.depth,sm.going<TARGET_GOING?'#efdcc0':'#d9ddcf','#71836b',.03));
 for(let i=0;i<sm.perFlight;i++)parts.push(`<path d="M${st.x} ${st.z+.88+i*(st.depth-.88)/sm.perFlight}h${st.width}" fill="none" stroke="#71836b" stroke-width=".03"/>`);
 parts.push(`<path d="M${st.x+st.width/2} ${st.z+.88}v${st.depth-.88}" fill="none" stroke="#71836b" stroke-width=".05"/>`);
 for(const c of colliders.filter(c=>c.floor===(upper?1:0)&&c.yMin<.1&&c.yMax>2))parts.push(rect(c.axis==='x'?c.a:c.c-c.thick/2,c.axis==='x'?c.c-c.thick/2:c.a,c.axis==='x'?c.b-c.a:c.thick,c.axis==='x'?c.thick:c.b-c.a,'#536556'));
 for(const [x,z] of columnPoints())parts.push(rect(x-columnSize()/2,z-columnSize()/2,columnSize(),columnSize(),'#3c5944'));
 const [vx,vy,vw,vh]=PLAN_VIEWBOX;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${plan.name} drawing ${plan.drawing} ${floor.toLowerCase()}"><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="#fafbf5"/>${parts.join('')}${svgOpenings()}${svgAnnotations(floor,planSheetNotes(plan,sm))}</svg>`;
}

function svgOpenings(){
 const selected=state.floor==='1'?1:0;
 return openingsDrawn.filter(o=>o.floor===selected).map(o=>{
  const a=o.axis==='x'?[o.a,o.c]:[o.c,o.a],b=o.axis==='x'?[o.b,o.c]:[o.c,o.b];
  if(o.window)return `<path data-opening="window" d="M${a.join(' ')}L${b.join(' ')}" stroke="#519bb1" stroke-width=".055"/>`;
  if(!o.door)return '';
  const w=o.b-o.a,angle=o.axis==='x'?(o.inward?Math.PI*.34:-Math.PI*.34):-Math.PI/2-Math.PI*.16;
  const x=a[0]+w*Math.cos(angle),z=a[1]-w*Math.sin(angle);
  return `<path data-opening="door" d="M${a.join(' ')}L${x} ${z} M${b.join(' ')}A${w} ${w} 0 0 ${o.axis==='x'&&!o.inward?1:0} ${x} ${z}" fill="none" stroke="#957451" stroke-width=".035"/>`;
 }).join('');
}
function renderPlan(highlight=selectedRoom){$('planView').innerHTML=svgPlan(highlight);applyPlanViewport()}

function resize(){const w=Math.max(1,$('canvasWrap').clientWidth),h=Math.max(1,$('canvasWrap').clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=responsiveFov(camera.aspect);camera.updateProjectionMatrix();const span=14/Math.min(1,w/h);ortho.left=-span*w/h;ortho.right=span*w/h;ortho.top=span;ortho.bottom=-span;ortho.updateProjectionMatrix();
// Re-fit after an aspect change, but only while the user has not taken over.
if(autoFit&&!fitting){fitting=true;placeView(autoFit);fitting=false}
invalidate()}
new ResizeObserver(resize).observe($('canvasWrap'));
// User controls
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{clearMeasure();state.floor=b.dataset.floor;if(state.mode==='walk'&&state.floor==='both'){state.mode='cutaway';state.roof=false;$('roof').checked=false;controls.enabled=true}if(state.mode==='plan'&&state.floor==='both')state.floor='0';if(state.mode==='walk'){walkY=floorY();camera.position.y=walkY+1.65;if(!canWalk(camera.position.x,camera.position.z,walkY))camera.position.set(rooms.hall.x,walkY+1.65,rooms.hall.z);}update();if(state.mode==='cutaway')bird()});document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>focusRoom(b.dataset.room));
for(const k of ['roof','labels','dimensions','furniture','grid'])$(k).onchange=e=>{state[k]=e.target.checked;if(k==='furniture'&&state.mode==='walk'&&!canWalk(camera.position.x,camera.position.z)){const p=safeWalkTarget(camera.position);camera.position.set(p.x,floorY()+1.65,p.z)}update()};
for(const k of ['explode','section'])$(k).oninput=e=>{state[k]=Number(e.target.value);clearMeasure();update()};// A full rebuild per input event stalled the main thread; coalesce to one per frame.
let heightFrame=0;
$('height').oninput=e=>{state.height=Number(e.target.value);$('heightOut').textContent=state.height.toFixed(1)+' m';if(heightFrame)return;heightFrame=requestAnimationFrame(()=>{heightFrame=0;build();if(state.mode==='walk'){walkY=floorY();camera.position.y=walkY+1.65;if(!canWalk(camera.position.x,camera.position.z,walkY))camera.position.set(rooms.hall.x,walkY+1.65,rooms.hall.z);}clearMeasure()})};
$('style').onchange=e=>{state.style=e.target.value;update()};$('units').onchange=e=>{state.units=e.target.value;if(measurePoints.length===2)$('measureInfo').textContent='Distance: '+formatDistance(measurePoints[0].distanceTo(measurePoints[1]))+' · click to measure again';toast('Measurements now use '+(state.units==='m'?'metres':'feet and inches'))};$('light').onchange=e=>{state.light=e.target.value;const evening=state.light==='evening';sun.color.set(evening?0xffc28e:0xfff6dc);sun.position.set(evening?-20:-8,evening?8:27,16);scene.background.set(evening?'#536171':'#e7ebe1');sun.intensity=evening?.7:3.1;fill.intensity=evening?.45:1.25;exteriorMats.glow.emissiveIntensity=evening?4:.25;gardenLights.forEach(l=>l.intensity=evening?14:0);renderer.toneMappingExposure=evening?1.05:1.25;update()};
function openDialog(id){keys.clear();drag=null;controls.autoRotate=false;$('rotate').classList.remove('active');$(id).showModal()}
$('sourceBtn').onclick=()=>openDialog('sourceDialog');$('exportBtn').onclick=()=>openDialog('exportDialog');document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('bird').onclick=bird;$('top').onclick=()=>{if(state.mode==='walk'||state.mode==='plan')setMode('cutaway');view([W/2,45,8.8+.001],[W/2,0,8.8],true);toast('Orthographic top view · use + / − to zoom')};$('front').onclick=()=>{setMode('exterior');view([W/2,3.5,49],[W/2,3.5,0],true);toast('Orthographic front elevation')};$('fit').onclick=()=>{if(state.mode==='plan'){planViewport.reset();applyPlanViewport()}else bird()};
function zoom(f){if(state.mode==='plan'){planViewport.zoom(f);applyPlanViewport();return}if(state.mode==='walk'){toast('Use the arrow controls to move inside');return}if(orthoMode){ortho.zoom=THREE.MathUtils.clamp(ortho.zoom*f,.4,5);ortho.updateProjectionMatrix()}else{const offset=camera.position.clone().sub(controls.target);offset.multiplyScalar(1/f);camera.position.copy(controls.target).add(offset)}invalidate()}$('zoomIn').onclick=()=>zoom(1.2);$('zoomOut').onclick=()=>zoom(1/1.2);$('rotate').onclick=()=>{if(state.mode==='walk'||state.mode==='plan')setMode('cutaway');if(orthoMode)bird();controls.autoRotate=!controls.autoRotate;$('rotate').classList.toggle('active',controls.autoRotate)};
$('enter').onclick=()=>{const id=$('enter').dataset.room||'hall';setMode('walk');focusRoom(id)};
$('reset').onclick=()=>{selectedRoom='';planViewport.reset();refreshPlanUI();Object.assign(state,{mode:'exterior',floor:'both',explode:0,height:3.3,roof:true,labels:true,dimensions:false,furniture:true,grid:false,style:'material',light:'day',units:'m',section:100});for(const k of ['roof','labels','dimensions','furniture','grid'])$(k).checked=state[k];for(const k of ['explode','height','style','light','units','section'])$(k).value=state[k];$('light').onchange({target:{value:'day'}});clearMeasure();measureActive=false;$('measureInfo').hidden=true;$('measure').classList.remove('active');ortho.zoom=1;build();setMode('exterior');toast('Workspace reset')};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('main').requestFullscreen()}catch{toast('Fullscreen is unavailable in this browser')}};
$('capture').onclick=()=>{if(state.mode==='plan'){download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-'+(state.floor==='1'?'first':'ground')+'-floor-plan.svg',svgPlan(),'image/svg+xml');toast('Floor plan downloaded as SVG');return}renderer.render(scene,activeCamera);const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const ctx=out.getContext('2d');ctx.drawImage(canvas,0,0);ctx.fillStyle='#17362dd9';ctx.fillRect(0,out.height-70,out.width,70);ctx.fillStyle='#f2f6e9';ctx.font='18px Arial';ctx.fillText('PLAN ATLAS · '+plan.name+' · G + 1',25,out.height-39);ctx.font='12px Arial';ctx.fillText('Drawing '+plan.drawing+' · First floor and elevations are assumed',25,out.height-17);out.toBlob(b=>{if(b)download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-view.png',b,'image/png')});toast('Snapshot downloaded')};
$('measure').onclick=()=>{if(state.mode==='plan')setMode('cutaway');if(state.mode==='walk')setMode('cutaway');measureActive=!measureActive;clearMeasure();$('measure').classList.toggle('active',measureActive);$('measureInfo').hidden=!measureActive;$('measureInfo').textContent='Click two points on any visible surface — floor, wall, column or fixture. Points within 280 mm of a corner snap to it. Third click starts again.';canvas.style.cursor=measureActive?'crosshair':''};
$('svgExport').onclick=()=>{download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-'+(state.floor==='1'?'first':'ground')+'-floor-plan.svg',svgPlan(),'image/svg+xml');toast('Vector floor plan exported')};
// DXF R12 ASCII. For a tool called CAD this is more useful than SVG: it opens in
// AutoCAD, LibreCAD and QCAD with real layers. DXF Y is up, so plan z maps to -z.
function dxfPlan(){
 const out=[];const p=(code,value)=>out.push(String(code),String(value));
 const line=(layer,x1,z1,x2,z2)=>{p(0,'LINE');p(8,layer);p(10,x1.toFixed(4));p(20,(-z1).toFixed(4));p(30,'0.0');p(11,x2.toFixed(4));p(21,(-z2).toFixed(4));p(31,'0.0')};
 const rect=(layer,x,z,w,d)=>{line(layer,x,z,x+w,z);line(layer,x+w,z,x+w,z+d);line(layer,x+w,z+d,x,z+d);line(layer,x,z+d,x,z)};
 const arc=(layer,cx,cz,r,a1,a2)=>{p(0,'ARC');p(8,layer);p(10,cx.toFixed(4));p(20,(-cz).toFixed(4));p(30,'0.0');p(40,r.toFixed(4));p(50,a1.toFixed(2));p(51,a2.toFixed(2))};
 const text=(layer,x,z,height,value)=>{p(0,'TEXT');p(8,layer);p(10,x.toFixed(4));p(20,(-z).toFixed(4));p(30,'0.0');p(40,height.toFixed(3));p(1,value)};
 p(0,'SECTION');p(2,'HEADER');p(9,'$INSUNITS');p(70,6);p(0,'ENDSEC');
 p(0,'SECTION');p(2,'TABLES');p(0,'TABLE');p(2,'LAYER');p(70,6);
 for(const [name,colour] of [['A-WALL',7],['A-COLS',8],['A-GLAZ',4],['A-DOOR',3],['A-ANNO',2],['A-GRID',9],['A-STRS',6]]){p(0,'LAYER');p(2,name);p(70,0);p(62,colour);p(6,'CONTINUOUS')}
 p(0,'ENDTAB');p(0,'ENDSEC');
 p(0,'SECTION');p(2,'ENTITIES');
 const level=state.floor==='1'?1:0;
 // Outline
 for(const [x1,z1,x2,z2] of [[0,0,W,0],[W,0,W,D+E],[W,D+E,EX,D+E],[EX,D+E,EX,D],[EX,D,0,D],[0,D,0,0]])line('A-WALL',x1,z1,x2,z2);
 for(const c of colliders.filter(c=>c.floor===level&&c.yMin<.1&&c.yMax>2))rect('A-WALL',c.axis==='x'?c.a:c.c-c.thick/2,c.axis==='x'?c.c-c.thick/2:c.a,c.axis==='x'?c.b-c.a:c.thick,c.axis==='x'?c.thick:c.b-c.a);
 for(const [x,z] of columnPoints())rect('A-COLS',x-columnSize()/2,z-columnSize()/2,columnSize(),columnSize());
 for(const o of openingsDrawn.filter(o=>o.floor===level)){
  const ax=o.axis==='x'?o.a:o.c,az=o.axis==='x'?o.c:o.a,bx=o.axis==='x'?o.b:o.c,bz=o.axis==='x'?o.c:o.b;
  if(o.window){line('A-GLAZ',ax,az,bx,bz);continue}
  if(!o.door)continue;
  const w=o.b-o.a,angle=o.axis==='x'?(o.inward?Math.PI*.34:-Math.PI*.34):-Math.PI/2-Math.PI*.16;
  const lx=ax+w*Math.cos(angle),lz=az-w*Math.sin(angle);
  line('A-DOOR',ax,az,lx,lz);
  const start=Math.atan2(-(lz-az),lx-ax)*180/Math.PI,end=Math.atan2(-(bz-az),bx-ax)*180/Math.PI;
  arc('A-DOOR',ax,az,w,Math.min(start,end),Math.max(start,end));
 }
 const st=plan.stair,sm=stairMetrics(st.depth,state.height);
 rect('A-STRS',st.x,st.z,st.width,st.depth);
 for(let i=0;i<sm.perFlight;i++)line('A-STRS',st.x,st.z+.88+i*(st.depth-.88)/sm.perFlight,st.x+st.width,st.z+.88+i*(st.depth-.88)/sm.perFlight);
 if(plan.rearStair)rect('A-STRS',11.65,.25,3.55,3.1);
 line('A-GRID',0,-1,W,-1);text('A-ANNO',W/2-1.4,-1.35,.28,W.toFixed(3)+' m overall width');
 line('A-GRID',-1,0,-1,D);text('A-ANNO',-2.9,D/2,.28,D.toFixed(3)+' m depth');
 const rearZ=Math.min(...columnPoints().map(([,z])=>z)),bays=[...new Set(columnPoints().filter(([,z])=>Math.abs(z-rearZ)<1e-6).map(([x])=>x))].sort((a,b)=>a-b);
 for(let i=0;i<bays.length-1;i++){line('A-GRID',bays[i],-2,bays[i+1],-2);text('A-ANNO',(bays[i]+bays[i+1])/2-.4,-2.3,.24,(bays[i+1]-bays[i]).toFixed(3))}
 text('A-ANNO',0,D+E+1.6,.4,'PLAN ATLAS - DRAWING '+plan.drawing+' - '+plan.name);
 text('A-ANNO',0,D+E+2.2,.26,(level?'FIRST FLOOR (ASSUMED REPEAT)':'GROUND FLOOR')+' - CONCEPT, NOT A CONSTRUCTION DRAWING');
 text('A-ANNO',0,D+E+2.7,.26,'Stair is diagrammatic: '+Math.round(sm.going*1000)+' mm going, needs '+sm.requiredDepth.toFixed(2)+' m well depth');
 p(0,'ENDSEC');p(0,'EOF');
 return out.join('\r\n')+'\r\n';
}
$('dxfExport').onclick=()=>{download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-'+(state.floor==='1'?'first':'ground')+'-floor-plan.dxf',dxfPlan(),'application/dxf');toast('DXF floor plan exported with layers')};
// Minimal glTF 2.0 binary writer. Vendoring GLTFExporter would add roughly 90 KB
// of runtime for a model that is only indexed triangles with flat PBR colours.
function glbModel(){
 const prior={...state};Object.assign(state,{floor:'both',mode:'exterior',explode:0,roof:true,section:100});update();
 model.updateMatrixWorld(true);site.updateMatrixWorld(true);
 const names=materialLibrary(),parts=[],accessors=[],bufferViews=[],meshes=[],nodes=[],materials=[],materialIndex=new Map();
 let offset=0;const align=n=>(4-n%4)%4;
 const push=(data,target)=>{const pad=align(offset);if(pad){parts.push(new Uint8Array(pad));offset+=pad}
  parts.push(new Uint8Array(data.buffer,data.byteOffset,data.byteLength));
  bufferViews.push({buffer:0,byteOffset:offset,byteLength:data.byteLength,target});
  offset+=data.byteLength;return bufferViews.length-1};
 const v=new THREE.Vector3(),n=new THREE.Vector3(),nm=new THREE.Matrix3();
 for(const root of [model,site])root.traverse(o=>{
  if(!o.isMesh||!o.geometry)return;let p=o;while(p&&p!==root){if(!p.visible)return;p=p.parent}
  const geom=o.geometry,pos=geom.attributes.position,nrm=geom.attributes.normal,count=pos.count;
  const positions=new Float32Array(count*3),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);positions.set([v.x,v.y,v.z],i*3);
   for(let a=0;a<3;a++){const c=v.getComponent(a);if(c<min[a])min[a]=c;if(c>max[a])max[a]=c}}
  const posAcc=accessors.length;accessors.push({bufferView:push(positions,34962),componentType:5126,count,type:'VEC3',min,max});
  let normalAcc;
  if(nrm){const normals=new Float32Array(count*3);nm.getNormalMatrix(o.matrixWorld);
   for(let i=0;i<count;i++){n.fromBufferAttribute(nrm,i).applyMatrix3(nm).normalize();normals.set([n.x,n.y,n.z],i*3)}
   normalAcc=accessors.length;accessors.push({bufferView:push(normals,34962),componentType:5126,count,type:'VEC3'})}
  const index=geom.index?Uint32Array.from(geom.index.array):Uint32Array.from({length:count},(_,i)=>i);
  const indexAcc=accessors.length;accessors.push({bufferView:push(index,34963),componentType:5125,count:index.length,type:'SCALAR'});
  if(!materialIndex.has(o.material)){const c=o.material.userData?.base||o.material.color;materialIndex.set(o.material,materials.length);
   materials.push({name:names.get(o.material)||'mat_'+o.material.color.getHexString(),doubleSided:true,
    ...(o.material.transparent?{alphaMode:'BLEND'}:{}),
    pbrMetallicRoughness:{baseColorFactor:[c.r,c.g,c.b,o.material.transparent?o.material.opacity:1],metallicFactor:o.material.metalness||0,roughnessFactor:o.material.roughness??.8}})}
  nodes.push({name:o.name,mesh:meshes.length});
  meshes.push({name:o.name,primitives:[{attributes:{POSITION:posAcc,...(normalAcc===undefined?{}:{NORMAL:normalAcc})},indices:indexAcc,material:materialIndex.get(o.material)}]});
 });
 Object.assign(state,prior);update();
 const bin=new Uint8Array(offset);let at=0;for(const part of parts){bin.set(part,at);at+=part.length}
 const json=new TextEncoder().encode(JSON.stringify({
  asset:{version:'2.0',generator:'Plan Atlas · '+plan.name+' · drawing '+plan.drawing+' · concept model, metres, Y up'},
  scene:0,scenes:[{name:plan.name,nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,accessors,bufferViews,buffers:[{byteLength:bin.length}]}));
 const jsonPad=align(json.length),binPad=align(bin.length),total=12+8+json.length+jsonPad+8+bin.length+binPad;
 const out=new Uint8Array(total),dv=new DataView(out.buffer);let at2=0;
 const u32=value=>{dv.setUint32(at2,value,true);at2+=4};
 u32(0x46546C67);u32(2);u32(total);
 u32(json.length+jsonPad);u32(0x4E4F534A);out.set(json,at2);at2+=json.length;for(let i=0;i<jsonPad;i++)out[at2++]=0x20;
 u32(bin.length+binPad);u32(0x004E4942);out.set(bin,at2);
 return out;
}
$('glbExport').onclick=()=>{download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-two-floors.glb',glbModel(),'model/gltf-binary');toast('glTF binary exported with materials')};
$('jsonExport').onclick=()=>{download('plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-specification.json',JSON.stringify({name:'Plan Atlas '+plan.name,drawing:plan.drawing,plan:plan.id,units:'metres',levels:2,mainBlock:{width:W,depth:D,widthBasis:plan.widthBasis},frontExtension:{startsAtX:EX,projection:E,provisional:!!plan.projectionProvisional},stairs:{front:plan.stair,rear:plan.rearStair},floorToFloor:state.height,outerWall:T,slab:SLAB,stairReview:stairReview(),readings:plan.readings,source:'User-provided drawing '+plan.drawing+'; photograph kept local',assumptions:[...plan.notes,'Floor height, structure, elevations, door locations, furniture and landscaping are illustrative. Not construction documentation.']},null,2),'application/json');toast(plan.name+' specification exported')};
// Stable material names so the OBJ can carry a companion MTL; without it every
// colour was lost on import and the whole model arrived flat grey.
function materialLibrary(){const names=new Map();
 const add=(prefix,source)=>{for(const [key,value] of Object.entries(source))if(value&&value.isMaterial&&!names.has(value))names.set(value,(prefix+key).replace(/[^a-zA-Z0-9_]/g,'_'))};
 add('',mats);add('ext_',exteriorMats);if(!names.has(siteBaseMaterial))names.set(siteBaseMaterial,'site_base');
 return names}
$('objExport').onclick=()=>{const prior={...state};Object.assign(state,{floor:'both',mode:'exterior',explode:0,roof:true,section:100});update();model.updateMatrixWorld(true);site.updateMatrixWorld(true);
 const base='plan-'+plan.id.toLowerCase()+'-'+plan.drawing+'-two-floors',names=materialLibrary(),used=new Set();
 const output=['# Plan Atlas · '+plan.name+' · drawing '+plan.drawing,'# Units: metres. Two-floor conceptual reconstruction. First floor repeated.','# Y is up. Rotate -90 degrees about X for Z-up CAD systems.','mtllib '+base+'.mtl'];
 let offset=1,normalOffset=1;const v=new THREE.Vector3(),n=new THREE.Vector3(),nm=new THREE.Matrix3();
 [model,site].forEach(root=>root.traverse(o=>{if(!o.isMesh||!o.geometry)return;let p=o;while(p&&p!==root){if(!p.visible)return;p=p.parent}
  const geom=o.geometry,pos=geom.attributes.position,nrm=geom.attributes.normal;
  const name=names.get(o.material)||'mat_'+o.material.color.getHexString();used.add(o.material);
  output.push('o '+o.name.replace(/[^a-zA-Z0-9_]/g,'_'),'usemtl '+name);
  for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);output.push(`v ${v.x.toFixed(5)} ${v.y.toFixed(5)} ${v.z.toFixed(5)}`)}
  if(nrm){nm.getNormalMatrix(o.matrixWorld);for(let i=0;i<nrm.count;i++){n.fromBufferAttribute(nrm,i).applyMatrix3(nm).normalize();output.push(`vn ${n.x.toFixed(4)} ${n.y.toFixed(4)} ${n.z.toFixed(4)}`)}}
  const face=(a,b,c)=>output.push(nrm?`f ${a+offset}//${a+normalOffset} ${b+offset}//${b+normalOffset} ${c+offset}//${c+normalOffset}`:`f ${a+offset} ${b+offset} ${c+offset}`);
  const idx=geom.index;
  if(idx)for(let i=0;i<idx.count;i+=3)face(idx.getX(i),idx.getX(i+1),idx.getX(i+2));
  else for(let i=0;i<pos.count;i+=3)face(i,i+1,i+2);
  offset+=pos.count;if(nrm)normalOffset+=nrm.count}));
 const mtl=['# Plan Atlas materials · '+plan.name];
 for(const material of used){const c=material.userData?.base||material.color;
  mtl.push('newmtl '+(names.get(material)||'mat_'+material.color.getHexString()),`Kd ${c.r.toFixed(4)} ${c.g.toFixed(4)} ${c.b.toFixed(4)}`,'Ka 0.0000 0.0000 0.0000',`Ks ${(material.metalness||0).toFixed(3)} ${(material.metalness||0).toFixed(3)} ${(material.metalness||0).toFixed(3)}`,'Ns 24',`d ${material.transparent?material.opacity.toFixed(3):'1.000'}`,'illum 2')}
 Object.assign(state,prior);update();
 download(base+'.obj',output.join('\n'),'text/plain');download(base+'.mtl',mtl.join('\n'),'text/plain');
 toast('OBJ and MTL exported in metres')};
// Touch-compatible first-person movement with horizontal wall/column collision.
canvas.addEventListener('pointerdown',e=>{if(drag)return;drag={pointerId:e.pointerId,x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY};if(state.mode==='walk')canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointerId||state.mode!=='walk')return;walkYaw-=(e.clientX-drag.px)*.005;walkPitch=THREE.MathUtils.clamp(walkPitch-(e.clientY-drag.py)*.005,-1.2,1.2);drag.px=e.clientX;drag.py=e.clientY});canvas.addEventListener('pointerup',e=>{if(drag&&e.pointerId!==drag.pointerId)return;if(measureActive&&drag&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8){const r=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(mouse,activeCamera);// Measuring was limited to floor slabs, which excluded the wall-to-wall reading
// people actually want. Any solid surface now works, with a short-range snap to
// the nearest geometry corner so wall faces and openings read cleanly.
const hits=ray.intersectObjects(floors.filter(g=>g.visible),true).filter(h=>h.point.z<=globalClip.constant&&h.object.userData.kind!=='window'&&h.object.visible);if(hits.length){const hit=hits[0];let point=hit.point.clone();
const geom=hit.object.geometry,corner=new THREE.Vector3();let snapped=false;
if(hit.face&&geom?.attributes?.position){let best=.28;for(const index of [hit.face.a,hit.face.b,hit.face.c]){corner.fromBufferAttribute(geom.attributes.position,index).applyMatrix4(hit.object.matrixWorld);const d=corner.distanceTo(hit.point);if(d<best){best=d;point=corner.clone();snapped=true}}}
if(hit.face)point.add(hit.face.normal.clone().transformDirection(hit.object.matrixWorld).multiplyScalar(.03));else point.y+=.04;
if(measurePoints.length===2)clearMeasure();measurePoints.push(point);const marker=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),new THREE.MeshBasicMaterial({color:0x216b51}));marker.position.copy(point);measureGroup.add(marker);if(measurePoints.length===2){line(measureGroup,measurePoints.map(v=>v.toArray()),0x136b4c,true);const d=measurePoints[0].distanceTo(measurePoints[1]),flat=Math.hypot(measurePoints[1].x-measurePoints[0].x,measurePoints[1].z-measurePoints[0].z);$('measureInfo').textContent='Distance: '+formatDistance(d)+(Math.abs(d-flat)>.02?' · plan '+formatDistance(flat):'')+' · click to measure again'}else $('measureInfo').textContent='First point set'+(snapped?' (snapped to a corner)':'')+'. Click the second point on any surface.';invalidate()}else toast('Click a visible surface: floor, wall, column or fixture')}drag=null});canvas.addEventListener('pointercancel',e=>{if(drag?.pointerId===e.pointerId)drag=null});canvas.addEventListener('lostpointercapture',e=>{if(drag?.pointerId===e.pointerId)drag=null});
// Keyboard parity for the 3D view. OrbitControls' own key handling only pans and
// was never enabled, so there was previously no keyboard route to orbit or zoom.
const spherical=new THREE.Spherical();
function orbitBy(dTheta,dPhi){const offset=camera.position.clone().sub(controls.target);spherical.setFromVector3(offset);spherical.theta-=dTheta;spherical.phi=THREE.MathUtils.clamp(spherical.phi-dPhi,.08,controls.maxPolarAngle);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));camera.lookAt(controls.target);invalidate()}
function panBy(dx,dy){const right=new THREE.Vector3().setFromMatrixColumn(camera.matrix,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrix,1);const reach=camera.position.distanceTo(controls.target)*.06;const move=right.multiplyScalar(dx*reach).add(up.multiplyScalar(-dy*reach));camera.position.add(move);controls.target.add(move);camera.lookAt(controls.target);invalidate()}
canvas.addEventListener('keydown',e=>{
 if(e.metaKey||e.ctrlKey||e.altKey||state.mode==='plan')return;
 if(state.mode==='walk'){const turn={q:.14,Q:.14,e:-.14,E:-.14}[e.key];if(turn===undefined)return;walkYaw+=turn;invalidate();e.preventDefault();return}
 const nudge={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
 if(nudge&&!orthoMode){e.shiftKey?panBy(nudge[0]*2,nudge[1]*2):orbitBy(nudge[0]*.09,nudge[1]*.07)}
 else if(e.key==='+'||e.key==='=')zoom(1.2);
 else if(e.key==='-'||e.key==='_')zoom(1/1.2);
 else if(e.key==='Home')bird();
 else return;
 e.preventDefault();
});
window.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea,[contenteditable=true],#planView')||document.querySelector('dialog[open]')||drawer.isOpen())return;if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){if(state.mode==='walk')e.preventDefault();keys.add(e.key)}if(e.key==='Escape'){clearMeasure();measureActive=false;$('measureInfo').hidden=true;$('measure').classList.remove('active');if(state.mode==='walk')setMode('cutaway')}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>{keys.clear();drag=null});document.addEventListener('visibilitychange',()=>{keys.clear();drag=null});
document.querySelectorAll('[data-move]').forEach(b=>{const k={forward:'w',back:'s',left:'a',right:'d'}[b.dataset.move];b.onpointerdown=e=>{e.preventDefault();keys.add(k);b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(k)});
function safeWalkTarget(r){
 if(canWalk(r.x,r.z))return r;
 for(let radius=.25;radius<=1.5;radius+=.25)for(let i=0;i<16;i++){const x=r.x+radius*Math.cos(i*Math.PI/8),z=r.z+radius*Math.sin(i*Math.PI/8);if(canWalk(x,z))return {x,z}}
 return rooms.hall;
}
// Each flight is a continuous ramp in plan, so the walking surface can be
// evaluated analytically rather than by ray-casting individual treads. The same
// function gives stair traversal and the upper-void block: a point on a flight
// is only reachable when its surface is near the walker's current elevation.
function stairSurface(x,z){
 const st=plan.stair,h=state.height,pad=.12,run=st.depth-.88;
 if(x>=st.x-pad&&x<=st.x+st.width+pad&&z>=st.z-pad&&z<=st.z+st.depth+pad){
  if(z<=st.z+.88)return h/2;
  const t=Math.max(0,Math.min(1,(z-(st.z+.88))/run));
  return x<=st.x+st.width/2?h/2*(1-t):h/2*(1+t);
 }
 if(plan.rearStair&&x>=11.65-pad&&x<=15.2+pad&&z>=.25-pad&&z<=3.35+pad){
  if(x<=12.9)return z>=1.5?h/2*Math.max(0,Math.min(1,(3.35-z)/1.85)):h/2;
  if(z<=1.5)return h/2*(1+Math.max(0,Math.min(1,(x-12.9)/2.3)));
 }
 return null;
}
function walkElevation(){return state.mode==='walk'&&stairSurface(camera.position.x,camera.position.z)!==null?walkY:floorY()}
function canWalk(x,z,y=walkElevation()){if(x<.35||x>W-.35||z<.35||z>D+E-.35||(x<EX+.3&&z>D-.35))return false;
 const surface=stairSurface(x,z);
 if(surface!==null)return Math.abs(surface-y)<=.5;
 // Off a flight you must be standing at a storey level, never part-way up one.
 if(Math.abs(y)>.5&&Math.abs(y-state.height)>.5)return false;
 const level=Math.abs(y-state.height)<.5?1:0;if(state.furniture&&furnitureObstacles.some(o=>o.floor===level&&Math.abs(x-o.x)<o.w/2+.18&&Math.abs(z-o.z)<o.d/2+.18))return false;for(const c of colliders){if(c.floor!==level||c.yMin>1.7||c.yMax<1.7)continue;const along=c.axis==='x'?x:z,cross=c.axis==='x'?z:x;if(along>c.a-.16&&along<c.b+.16&&Math.abs(cross-c.c)<c.thick/2+.18)return false}for(const [cx,cz] of [...columnPoints(),...[EX+.11,12.72,W-.11].map(cx=>[cx,D+E-.11])])if(Math.abs(x-cx)<columnSize()/2+.18&&Math.abs(z-cz)<columnSize()/2+.18)return false;for(const o of openingsDrawn.filter(o=>o.floor===level&&o.door)){const angle=o.axis==='x'?(o.inward?Math.PI*.34:-Math.PI*.34):-Math.PI/2-Math.PI*.16,px=o.axis==='x'?o.a:o.c,pz=o.axis==='x'?o.c:o.a,w=o.b-o.a,dx=x-px,dz=z-pz,along=dx*Math.cos(angle)-dz*Math.sin(angle),cross=dx*Math.sin(angle)+dz*Math.cos(angle);if(along>-.16&&along<w+.16&&Math.abs(cross)<.19)return false}return true}
const labelRay=new THREE.Raycaster();const labelBounds=[];let lastLabelTime=0;
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;if(document.hidden)return;const paused=!!document.querySelector('dialog[open]')||drawer.isOpen();if(paused)keys.clear();if(state.mode==='walk'){const f=(keys.has('w')||keys.has('ArrowUp')?1:0)-(keys.has('s')||keys.has('ArrowDown')?1:0),s=(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0);const norm=f&&s?Math.SQRT1_2:1,dx=(-Math.sin(walkYaw)*f+Math.cos(walkYaw)*s)*dt*2.5*norm,dz=(-Math.cos(walkYaw)*f-Math.sin(walkYaw)*s)*dt*2.5*norm;if(canWalk(camera.position.x+dx,camera.position.z,walkY))camera.position.x+=dx;if(canWalk(camera.position.x,camera.position.z+dz,walkY))camera.position.z+=dz;
// Follow the stair surface, and snap to the nearest storey once off a flight.
const surface=stairSurface(camera.position.x,camera.position.z);
walkY=surface!==null?surface:(Math.abs(walkY-state.height)<.5?state.height:0);
camera.position.y=walkY+1.65;
const reached=Math.abs(walkY-state.height)<.5?'1':'0';
if(state.floor!==reached&&surface===null){state.floor=reached;update();toast(reached==='1'?'First floor · assumed repeat':'Ground floor')}
camera.rotation.order='YXZ';camera.rotation.set(walkPitch,walkYaw,0);if(f||s||drag||surface!==null)invalidate()}else if(!orthoMode&&state.mode!=='plan'){controls.update();if(controls.autoRotate)invalidate()}
if(state.mode!=='plan'&&needsRender){renderer.render(scene,activeCamera);needsRender=false}if(!labelsDirty||now-lastLabelTime<120)return;lastLabelTime=now;labelsDirty=false;const width=$('canvasWrap').clientWidth,height=$('canvasWrap').clientHeight;labelBounds.length=0;
// Sort so the hall keeps its label and a secondary caption is the one dropped.
for(const l of [...labelDefs].sort((a,b)=>a.priority-b.priority)){const show=l.g.visible&&(l.kind==='dim'?state.dimensions&&(state.mode==='cutaway'||state.mode==='exterior'):state.labels&&state.mode==='cutaway');if(!show){l.el.style.display='none';continue}const p=l.pos.clone().applyMatrix4(l.g.matrixWorld);if(p.z>globalClip.constant){l.el.style.display='none';continue}const world=p.clone(),delta=world.clone().sub(activeCamera.position),distance=delta.length();labelRay.set(activeCamera.position,delta.normalize());const blocked=l.kind!=='dim'&&labelRay.intersectObjects([model],true).some(hit=>{if(hit.distance>distance-.2||hit.point.z>globalClip.constant)return false;let parent=hit.object;while(parent){if(!parent.visible)return false;parent=parent.parent}return !(hit.object.material.clippingPlanes||[]).some(plane=>plane.distanceToPoint(hit.point)<0)});p.project(activeCamera);const x=(p.x*.5+.5)*width,y=(-p.y*.5+.5)*height;const rect={x:x-55,y:y-14,w:110,h:28};const overlap=labelBounds.some(b=>rect.x<b.x+b.w&&rect.x+rect.w>b.x&&rect.y<b.y+b.h&&rect.y+rect.h>b.y);const occluded=blocked||overlap;if(!occluded)labelBounds.push(rect);l.el.style.display=p.z<1&&p.z>-1&&x>0&&x<width&&y>15&&y<height-15&&!occluded?'block':'none';l.el.style.left=x+'px';l.el.style.top=y+'px'}
}
// The whole view is shareable, not just the plan choice.
const LAYERS=['roof','labels','dimensions','furniture','grid'];
let urlTimer;
function syncURL(){try{clearTimeout(urlTimer);urlTimer=setTimeout(()=>{try{const url=new URL(window.location.href),p=url.searchParams;
 p.set('plan',plan.id);p.set('view',state.mode);p.set('floor',state.floor);p.set('h',state.height.toFixed(1));p.set('light',state.light);p.set('style',state.style);p.set('units',state.units);p.set('layers',LAYERS.filter(k=>state[k]).join(',')||'none');
 window.history.replaceState(null,'',url)}catch{}},400)}catch{}}
function applyURLState(){
 const p=new URLSearchParams(window.location.search);
 const height=Number(p.get('h'));if(height>=2.8&&height<=4.5){state.height=height;$('height').value=String(height)}
 for(const key of ['light','style','units']){const value=p.get(key);if(value&&[...$(key).options].some(o=>o.value===value)){state[key]=value;$(key).value=value}}
 if(p.has('layers')){const on=new Set(p.get('layers').split(','));for(const key of LAYERS){state[key]=on.has(key);$(key).checked=state[key]}}
 $('light').onchange({target:{value:state.light}});
 build();
 const view=p.get('view');if(['cutaway','exterior','walk','plan'].includes(view))setMode(view);
 const floor=p.get('floor');
 if(['both','0','1'].includes(floor)&&!(floor==='both'&&(state.mode==='plan'||state.mode==='walk'))){state.floor=floor;if(p.has('layers')){const on=new Set(p.get('layers').split(','));state.roof=on.has('roof');$('roof').checked=state.roof}update()}
}
$('planSelect').onchange=e=>switchPlan(e.target.value);let initialPlan='A';try{initialPlan=new URLSearchParams(window.location.search).get('plan')||window.localStorage.getItem('plan-atlas-plan')||'A'}catch{}switchPlan(plans[initialPlan]?initialPlan:'A',false);
try{applyURLState()}catch{}
resize();if(!webglAvailable){for(const id of ['bird','top','front','rotate','measure','labels','dimensions','grid','section','style','light'])$(id).disabled=true;$('interactionHint').textContent='2D fallback · drag to pan · pinch / + − to zoom'}requestAnimationFrame(animate);

$('sourceUpload').onchange=e=>{const file=e.target.files?.[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('Choose a JPEG, PNG or WebP drawing');return}if(file.size>20*1024*1024){toast('Choose a drawing smaller than 20 MB');return}if(drawingURLs[plan.id])URL.revokeObjectURL(drawingURLs[plan.id]);const url=URL.createObjectURL(file);drawingURLs[plan.id]=url;$('sourcePreview').src=url;$('sourcePreview').hidden=false;$('sourcePrivacy').textContent='This drawing stays on your device. It is not uploaded, saved to GitHub, or shared with Vercel.'};

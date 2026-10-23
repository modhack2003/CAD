import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const temp=await fs.mkdtemp(path.join(tmpdir(),'plan-atlas-test-'));
const testModule=path.join(temp,'model-under-test.mjs');
const elements=new Map();
function el(id=''){return {id,style:{},dataset:{},children:[],clientWidth:1100,clientHeight:850,classList:{add(){},remove(){},toggle(){}},append(x){this.children.push(x)},appendChild(x){this.children.push(x)},remove(){},focus(){},removeAttribute(){},querySelectorAll(){return []},querySelector(){return null},click(){},addEventListener(){},getRootNode(){return {addEventListener(){}}},getContext(type){return type==='2d'?{fillRect(){},strokeRect(){}}:null},setAttribute(){}}}
globalThis.document={getElementById(id){if(!elements.has(id))elements.set(id,el(id));return elements.get(id)},createElement:el,querySelectorAll(){return []},querySelector(){return el()},addEventListener(){},body:el()};
globalThis.window={addEventListener(){},matchMedia(){return {matches:false,addEventListener(){}}}};globalThis.devicePixelRatio=1;globalThis.requestAnimationFrame=()=>{};globalThis.ResizeObserver=class{observe(){}};
const downloads=[];URL.createObjectURL=b=>{downloads.push(b);return 'blob:test'};URL.revokeObjectURL=()=>{};
let source=await fs.readFile(root+'app.js','utf8');
source=source.replace("from 'three'",`from 'file://${root}vendor/three.module.js'`).replace("import { OrbitControls } from './vendor/OrbitControls.js';",`class OrbitControls { constructor(){this.target=new THREE.Vector3()}update(){} }`);
source=source.replace("from './mobile-ui.js'",`from 'file://${root}mobile-ui.js'`).replace("from './plans.js'",`from 'file://${root}plans.js'`).replace("from './plan-navigation.js'",`from 'file://${root}plan-navigation.js'`);
source+='\nexport {model,state,floors,colliders,build,canWalk,update,roofGroup,slab,site,switchPlan,plan,svgPlan,rooms,stairReview,openingsDrawn,planViewport,camera,focusRoom,clearMeasure,measureGroup,keys};';
await fs.writeFile(testModule,source);
const m=await import(testModule);
assert.equal(m.floors.length,2);let vertices=0,meshes=0;for(const f of m.floors)f.traverse(o=>{if(!o.isMesh)return;meshes++;const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x),'non-finite geometry')});
assert.ok(meshes>350);assert.ok(m.colliders.length>100);
assert.ok(m.canWalk(8,11.8));assert.ok(!m.canWalk(-1,8));assert.ok(!m.canWalk(8.13,1.5));
document.getElementById('objExport').onclick();
const obj=await downloads.at(-1).text();assert.ok(obj.length>100000);assert.ok(!obj.includes('NaN'));assert.ok(!obj.includes('Infinity'));
const lines=obj.split('\n'),v=lines.filter(l=>l.startsWith('v ')).map(l=>l.split(' ').slice(1).map(Number)),faces=lines.filter(l=>l.startsWith('f '));
for(const f of faces)for(const n of f.slice(2).split(' ').map(Number))assert.ok(n>=1&&n<=v.length,'invalid OBJ face');
assert.ok(Math.max(...v.map(x=>x[1]))>=7.39&&Math.max(...v.map(x=>x[1]))<=7.7,'roof and handrail height');

document.getElementById('svgExport').onclick();const svg=await downloads.at(-1).text();assert.ok(svg.includes('GROUND FLOOR'));assert.ok(svg.includes('54′1″'));
m.state.height=4.1;m.build();assert.equal(m.floors.length,2);assert.ok(Math.abs(m.floors[1].position.y-4.1)<.001);
console.log(JSON.stringify({meshes,vertices,objVertices:v.length,objFaces:faces.length,objBytes:obj.length,geometry:'finite',objIndices:'valid',heightRebuild:'passed',collisionChecks:'passed'}));

const THREE=await import('file://'+root+'vendor/three.module.js');
m.state.height=3.3;m.state.floor='both';m.state.mode='cutaway';m.state.explode=0;m.build();m.model.updateMatrixWorld(true);
assert.equal(m.floors[1].position.y,3.3,'assembled floor alignment');
const first=m.floors[1],gate=first.getObjectByName('First-floor landing entry');assert.ok(gate);
assert.ok(!first.getObjectByName('Entrance front'),'no unsupported upper exterior entrance');
const leaf=gate.getObjectByName('Open door leaf');const bounds=new THREE.Box3().setFromObject(leaf);
assert.ok(bounds.max.z<=13.951+.03,'gate swings onto the hall floor');
assert.ok(Math.abs(bounds.min.y-3.3)<.001,'gate rests at first-floor elevation');
const slabMesh=first.children.find(o=>o.name==='Floor slab');const ray=new THREE.Raycaster();
for(const x of [bounds.min.x+.04,bounds.max.x-.04])for(const z of [bounds.min.z+.04,bounds.max.z-.04]){ray.set(new THREE.Vector3(x,3.5,z),new THREE.Vector3(0,-1,0));assert.ok(ray.intersectObject(slabMesh).length,'door corners supported by landing slab')}
for(const o of [leaf,gate.getObjectByName('Door jamb'),gate.getObjectByName('Door frame header')])assert.equal(o.material.clippingPlanes[1],first.userData.cutPlane,'same cutaway for frame and leaf');
assert.ok(Math.abs(first.userData.cutPlane.constant-4.45)<1e-8);
m.state.explode=2;m.update();assert.equal(m.floors[1].position.y,5.3);assert.ok(Math.abs(first.userData.cutPlane.constant-6.45)<1e-8);
m.state.floor='1';m.update();assert.equal(m.floors[1].position.y,3.3,'isolated level has no explode gap');
assert.ok(!m.canWalk(10,15),'walk cannot float over stair opening');assert.ok(m.canWalk(13.5,15.7),'landing remains accessible');
Object.assign(m.state,{floor:'both',mode:'exterior',explode:0});m.update();m.model.updateMatrixWorld(true);
assert.equal(leaf.material.clippingPlanes.length,1,'full gate restored outside cutaway');
console.log('Regression checks passed: supported upper gate, shared cutaway, assembled/exploded isolation, stair void collision.');

assert.ok(!m.floors[1].getObjectByName('Front stair upper flight'),'no unsupported roof-bound stair');console.log('Roof access regression: no unrequested second stair flight.');

// Glazing blocks walking, and the decorative canopy is supported from the terrace.
for(const height of [2.8,4.5]){m.state.height=height;m.build();m.model.updateMatrixWorld(true);for(const floor of m.floors){const glass=floor.getObjectByName('Tall banquet glazing');assert.ok(glass);assert.ok(new THREE.Box3().setFromObject(glass).getSize(new THREE.Vector3()).y>2,'tall glass fits even minimum storey');}assert.ok(!m.canWalk(.1,5.5));assert.ok(!m.canWalk(1,13.951),'front glazing blocks walk-through');}
m.state.height=3.3;m.build();m.model.updateMatrixWorld(true);m.site.updateMatrixWorld(true);
const canopy=m.floors[0].getObjectByName('Entrance canopy');const support=m.floors[0].getObjectByName('Canopy support');assert.ok(canopy&&support);const supportBounds=new THREE.Box3().setFromObject(support);assert.ok(Math.abs(supportBounds.min.y)<1e-6);assert.ok(supportBounds.max.y>=new THREE.Box3().setFromObject(canopy).min.y,'column reaches canopy');
console.log('Banquet checks passed: glazing at height limits, glass collision, supported canopy.');
// Both alternatives must switch completely, with independent exports and voids.
m.switchPlan('B',false);assert.equal(m.plan.drawing,'218124');assert.equal(m.floors.length,2);
const count=(group,name)=>{let n=0;group.traverse(o=>{if(o.name===name)n++});return n};
for(const floor of m.floors){assert.equal(count(floor,'WC pedestal'),3);assert.equal(count(floor,'Urinal fixture'),3);assert.ok(floor.getObjectByName('Plan B Front room divider'));assert.ok(!floor.getObjectByName('Rear L stair lower flight'));assert.ok(!floor.getObjectByName('Rear room A / upper WC'));}
assert.equal(count(m.model,'Front stair lower flight'),10);
Object.assign(m.state,{floor:'1',mode:'exterior'});m.update();m.model.updateMatrixWorld(true);
assert.ok(!m.canWalk(10,16),'Plan B front stair void blocks walking');assert.ok(m.canWalk(12.2,2),'Plan B has no phantom rear stair void');
const bFirst=m.floors[1],bLeaf=bFirst.getObjectByName('First-floor landing entry').getObjectByName('Open door leaf');const bBounds=new THREE.Box3().setFromObject(bLeaf),bSlab=bFirst.children.find(o=>o.name==='Floor slab');
for(const x of [bBounds.min.x+.04,bBounds.max.x-.04])for(const z of [bBounds.min.z+.04,bBounds.max.z-.04]){ray.set(new THREE.Vector3(x,3.5,z),new THREE.Vector3(0,-1,0));assert.ok(ray.intersectObject(bSlab).length,'Plan B upper doorway supported');}
const footprint=new THREE.Box3().setFromObject(bSlab);assert.ok(Math.abs(footprint.max.x-16.74)<1e-5);assert.ok(Math.abs(footprint.max.z-18.551)<1e-5);
const bSvg=m.svgPlan();assert.ok(bSvg.includes('218124'));assert.ok(bSvg.includes('FRONT ROOM 2'));assert.ok(bSvg.includes('3.773 m'));assert.ok(!bSvg.includes('ROOM B'));
document.getElementById('jsonExport').onclick();const spec=JSON.parse(await downloads.at(-1).text());assert.equal(spec.plan,'B');assert.equal(spec.mainBlock.width,16.74);assert.equal(spec.frontExtension.provisional,true);assert.equal(spec.stairs.rear,false);
document.getElementById('objExport').onclick();const bObj=await downloads.at(-1).text();assert.ok(bObj.includes('drawing 218124'));assert.ok(!/NaN|Infinity/.test(bObj));assert.ok(bObj.includes('Plan_B_Front_room_divider'));assert.ok(!bObj.includes('Rear_L_stair'));
const bLines=bObj.split('\n'),bVertices=bLines.filter(l=>l.startsWith('v ')).length;for(const line of bLines.filter(l=>l.startsWith('f ')))for(const index of line.slice(2).split(' ').map(Number))assert.ok(index>=1&&index<=bVertices);
const tally=()=>{let n=0;m.model.traverse(o=>{if(o.isMesh)n++});return n};const bCount=tally();
for(const h of [2.8,4.5]){m.state.height=h;m.build();m.model.traverse(o=>{if(o.isMesh)for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value))});assert.equal(tally(),bCount)}
m.state.height=3.3;m.switchPlan('A',false);assert.equal(count(m.floors[0],'WC pedestal'),4);assert.ok(m.floors[0].getObjectByName('Rear L stair lower flight'));assert.ok(!m.floors[0].getObjectByName('Plan B fixtures'));
document.getElementById('sourceUpload').onchange({target:{files:[{type:'image/jpeg',size:100}]}});assert.equal(document.getElementById('sourcePreview').hidden,false);m.switchPlan('B',false);assert.equal(document.getElementById('sourcePreview').hidden,true,'Plan A photograph not shown for B');m.switchPlan('A',false);assert.equal(document.getElementById('sourcePreview').hidden,false);
// Drawing fidelity and interaction regressions found in the two-plan audit.
for(const id of ['A','B']){
 m.switchPlan(id,false);Object.assign(m.state,{mode:'walk',floor:'0',height:3.3,furniture:true});m.update();
 const st=m.plan.stair;assert.ok(!m.canWalk(st.x+st.width/2,st.z+1),'ground walk cannot penetrate solid stairs');
 for(const floor of ['0','1']){m.state.floor=floor;for(const room of Object.keys(m.rooms)){m.focusRoom(room);assert.ok(m.canWalk(m.camera.position.x,m.camera.position.z),id+' '+room+' safe walk spawn')}}
 for(const floor of ['0','1']){m.state.floor=floor;const svg=m.svgPlan();assert.ok(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(svg),'SVG text is XML escaped');assert.ok(svg.includes('data-opening="window"'));assert.ok(svg.includes('data-opening="door"'));}
 for(const h of [2.8,4.5]){m.state.height=h;m.build();m.model.updateMatrixWorld(true);const canopy=new THREE.Box3().setFromObject(m.floors[0].getObjectByName('Entrance canopy'));assert.ok(canopy.max.y<h-.18,'canopy stays below first-floor slab');}
 m.state.height=3.3;m.build();m.model.updateMatrixWorld(true);m.site.updateMatrixWorld(true);
 const terrace=new THREE.Box3().setFromObject(m.site.getObjectByName('Entrance terrace'));m.site.traverse(o=>{if(o.name==='Entrance paving joint'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.max.z<terrace.max.z,'paving stays over terrace')}});
}
m.switchPlan('A',false);m.state.floor='0';m.state.furniture=true;
assert.ok(!m.canWalk(1.8,1.25),'desk blocks walking');m.state.furniture=false;assert.ok(m.canWalk(1.8,1.25),'hidden furniture does not block walking');m.state.furniture=true;
const columns=m.floors[0].children.filter(o=>o.name==='Column');assert.ok(columns.some(o=>o.position.x===11.45&&o.position.z===.11));assert.ok(!columns.some(o=>o.position.x===12.72&&o.position.z===.11));
assert.ok(m.openingsDrawn.some(o=>o.floor===0&&o.c===0&&o.door),'rear ground entrance restored');assert.ok(!m.openingsDrawn.some(o=>o.floor===1&&o.c===0&&o.door),'upper rear facade has no floating door');
m.switchPlan('B',false);m.model.updateMatrixWorld(true);
const bColumns=m.floors[0].children.filter(o=>o.name==='Column');const topColumns=bColumns.filter(o=>o.position.z===.125).sort((a,b)=>a.position.x-b.position.x);assert.equal(topColumns.length,4);for(const [i,clear] of [[0,5.245],[1,5.25],[2,5.245]])assert.ok(Math.abs(topColumns[i+1].position.x-topColumns[i].position.x-.25-clear)<1e-6,'B clear column bays match drawing');
const walls=m.floors[0];
const bound=name=>new THREE.Box3().setFromObject(walls.getObjectByName('Plan B '+name).children[0]);
const left=bound('service exterior').max.x,rear=bound('rear exterior').max.z;
assert.ok(Math.abs(bound('Rear-left room divider').min.x-left-2.4384)<1e-5,'rear room clear width is 8 ft');assert.ok(Math.abs(bound('Rear-left room front').min.z-rear-3.6576)<1e-5,'rear room clear depth is 12 ft');
assert.ok(Math.abs(bound('Toilet centre divider').min.x-left-1.2192)<1e-5,'left WC clear width');assert.ok(Math.abs(bound('Toilet service screen').min.x-bound('Toilet centre divider').max.x-1.2192)<1e-5,'right WC clear width');assert.ok(Math.abs(bound('Toilet upper division').min.z-bound('Rear-left room front').max.z-1.8288)<1e-5,'upper WC clear depth');assert.ok(Math.abs(bound('Toilet service front').min.z-bound('Toilet upper division').max.z-1.8288)<1e-5,'lower WC clear depth');
assert.ok(Math.abs(bound('Front room divider').min.x-left-6)<1e-5,'front room clear width is 6 m');
assert.ok(Math.abs(bound('front room facade').min.z-bound('Front room partitions').max.z-2.45)<1e-5,'front room clear depth is 2.45 m');
assert.ok(m.stairReview().front.upperLandingClear>=.95,'upper exit has a usable conceptual landing');
assert.ok(Math.abs(m.stairReview().front.tread-.247)<1e-6);
let materialDisposed=false,geometryDisposed=false;const marker=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial());marker.material.addEventListener('dispose',()=>materialDisposed=true);marker.geometry.addEventListener('dispose',()=>geometryDisposed=true);m.measureGroup.add(marker);m.clearMeasure();assert.ok(materialDisposed&&geometryDisposed,'measurement resources disposed');
console.log('Audit regressions passed: drawing room sizes, column rows, rear entry, stair landing, canopy/paving support, safe walk targets, furniture collision and valid SVG text.');
m.switchPlan(process.env.CAD_RENDER_PLAN==='B'?'B':'A',false);Object.assign(m.state,{mode:'exterior',floor:process.env.CAD_RENDER_FLOOR||'both',roof:process.env.CAD_RENDER_ROOF!=='off'});m.update();m.model.updateMatrixWorld(true);m.site.updateMatrixWorld(true);
console.log('Plan B checks passed: distinct layout, three WCs, single stair, slab/entry support, height limits, exports and repeated plan switching.');
if(process.env.CAD_SVG_OUTPUT)await fs.writeFile(process.env.CAD_SVG_OUTPUT,m.svgPlan());
if(process.env.CAD_GEOMETRY_OUTPUT){const meshes=[];for(const group of [m.model,m.site])group.traverse(o=>{if(!o.isMesh)return;let p=o;while(p){if(!p.visible)return;p=p.parent}const pos=o.geometry.attributes.position;const vertices=[];const point=new THREE.Vector3();for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);vertices.push(point.toArray())}meshes.push({name:o.name,vertices,indices:o.geometry.index?Array.from(o.geometry.index.array):Array.from({length:pos.count},(_,i)=>i),color:o.material.color.getHexString()})});await fs.writeFile(process.env.CAD_GEOMETRY_OUTPUT,JSON.stringify(meshes));}
await fs.rm(temp,{recursive:true,force:true});

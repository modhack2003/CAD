import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const temp=await fs.mkdtemp(path.join(tmpdir(),'plan-atlas-test-'));
const testModule=path.join(temp,'model-under-test.mjs');
const elements=new Map();
function el(id=''){return {id,style:{},dataset:{},children:[],clientWidth:1100,clientHeight:850,classList:{add(){},remove(){},toggle(){}},append(x){this.children.push(x)},appendChild(x){this.children.push(x)},remove(){},focus(){},removeAttribute(){},querySelectorAll(){return []},click(){},addEventListener(){},getRootNode(){return {addEventListener(){}}},getContext(type){return type==='2d'?{fillRect(){},strokeRect(){}}:null},setAttribute(){}}}
globalThis.document={getElementById(id){if(!elements.has(id))elements.set(id,el(id));return elements.get(id)},createElement:el,querySelectorAll(){return []},querySelector(){return el()},addEventListener(){},body:el()};
globalThis.window={addEventListener(){},matchMedia(){return {matches:false,addEventListener(){}}}};globalThis.devicePixelRatio=1;globalThis.requestAnimationFrame=()=>{};globalThis.ResizeObserver=class{observe(){}};
const downloads=[];URL.createObjectURL=b=>{downloads.push(b);return 'blob:test'};URL.revokeObjectURL=()=>{};
let source=await fs.readFile(root+'app.js','utf8');
source=source.replace("from 'three'",`from 'file://${root}vendor/three.module.js'`).replace("import { OrbitControls } from './vendor/OrbitControls.js';",`class OrbitControls { constructor(){this.target=new THREE.Vector3()}update(){} }`);
source=source.replace("from './mobile-ui.js'",`from 'file://${root}mobile-ui.js'`);
source+='\nexport {model,state,floors,colliders,build,canWalk,update,roofGroup,slab,site};';
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
if(process.env.CAD_GEOMETRY_OUTPUT){const meshes=[];for(const group of [m.model,m.site])group.traverse(o=>{if(!o.isMesh)return;let p=o;while(p){if(!p.visible)return;p=p.parent}const pos=o.geometry.attributes.position;const vertices=[];const point=new THREE.Vector3();for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);vertices.push(point.toArray())}meshes.push({name:o.name,vertices,indices:o.geometry.index?Array.from(o.geometry.index.array):Array.from({length:pos.count},(_,i)=>i),color:o.material.color.getHexString()})});await fs.writeFile(process.env.CAD_GEOMETRY_OUTPUT,JSON.stringify(meshes));}
await fs.rm(temp,{recursive:true,force:true});

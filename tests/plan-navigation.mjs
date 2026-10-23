import assert from 'node:assert/strict';
import {createPlanViewport,bindPlanNavigation} from '../dist/plan-navigation.js';
import {PLAN_VIEWBOX} from '../dist/plans.js';
// Sheet extents come from the shared constant so the viewport and the exported
// viewBox cannot drift apart again.
const [bx,by,bw,bh]=PLAN_VIEWBOX;
const viewport=createPlanViewport(),handlers={};let current;
const container={addEventListener(name,fn){handlers[name]=fn},querySelector(){return {setAttribute(name,value){current=value}}},setPointerCapture(){},focus(){},getBoundingClientRect(){return {width:420,height:460}}};
bindPlanNavigation(container,viewport);
assert.deepEqual(viewport.value,PLAN_VIEWBOX,'viewport starts at the sheet extents');
handlers.wheel({deltaY:-1,preventDefault(){}});assert.ok(viewport.value[2]<bw);assert.ok(current);
const down=(id,x,y)=>handlers.pointerdown({pointerId:id,clientX:x,clientY:y,button:0});
const move=(id,x,y)=>handlers.pointermove({pointerId:id,clientX:x,clientY:y});
down(1,180,200);down(2,240,200);const before=viewport.value[2];move(2,300,200);assert.ok(viewport.value[2]<before,'pinch zooms');
handlers.pointerup({pointerId:2});const x=viewport.value[0];move(1,200,200);assert.notEqual(viewport.value[0],x,'one finger pans after pinch');handlers.pointercancel({pointerId:1});
const cancel=viewport.value;move(1,300,300);assert.deepEqual(viewport.value,cancel,'cancelled pointer cannot pan');
for(let i=0;i<100;i++)viewport.zoom(2);assert.equal(viewport.value[2],bw/8,'zoom bound');viewport.pan(-1e6,1e6);assert.equal(viewport.value[0],bx);assert.ok(viewport.value[1]+viewport.value[3]<=by+bh);
handlers.keydown({key:'Home',preventDefault(){}});assert.deepEqual(viewport.value,PLAN_VIEWBOX);handlers.keydown({key:'+',preventDefault(){}});assert.ok(viewport.value[2]<bw);
console.log('Plan navigation passed: wheel, pinch, drag, pointer cancellation, keyboard and zoom bounds.');

import assert from 'node:assert/strict';
import {responsiveFov,setupDrawer} from '../dist/mobile-ui.js';
// A portrait phone must preserve horizontal coverage; rotation must return to
// the normal lens without moving the user's camera target.
assert.equal(responsiveFov(1.7),43);
for(const aspect of [.45,.6,.8,1]){
 const horizontal=2*Math.atan(Math.tan(responsiveFov(aspect)*Math.PI/360)*aspect)*180/Math.PI;
 assert.ok(horizontal>=42.99,'portrait loses building width');
}
assert.ok(Number.isFinite(responsiveFov(0)));
const handlers={},elements={},media={matches:true,addEventListener(type,fn){handlers.media=fn}};
const doc={activeElement:null,getElementById(id){return elements[id]}};
for(const id of ['sidebar','panelBtn','closePanel','panelBackdrop','main','appHeader','lastControl']){
 elements[id]={attrs:{},hidden:false,inert:false,classList:{toggle(name,on){this[name]=on}},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},focus(){doc.activeElement=this},getClientRects(){return [{}]}};
}
elements.sidebar.querySelectorAll=()=>[elements.closePanel,elements.lastControl];
const win={matchMedia(){return media},addEventListener(type,fn){handlers[type]=fn}};
let paused=0;const drawer=setupDrawer({doc,win,onPause:()=>paused++});
elements.panelBtn.focus();elements.panelBtn.onclick();
assert.equal(paused,1);assert.equal(drawer.isOpen(),true);assert.equal(elements.main.inert,true);assert.equal(elements.appHeader.inert,true);assert.equal(elements.panelBackdrop.hidden,false);assert.equal(elements.panelBtn.attrs['aria-expanded'],'true');assert.equal(doc.activeElement,elements.closePanel);
function key(key,shiftKey=false){const e={key,shiftKey,preventDefault(){this.prevented=true},stopImmediatePropagation(){}};handlers.keydown(e);return e}
assert.equal(key('Tab',true).prevented,true);assert.equal(doc.activeElement,elements.lastControl);key('Tab');assert.equal(doc.activeElement,elements.closePanel);
key('Escape');assert.equal(drawer.isOpen(),false);assert.equal(elements.main.inert,false);assert.equal(elements.panelBackdrop.hidden,true);assert.equal(doc.activeElement,elements.panelBtn);
elements.panelBtn.onclick();elements.panelBackdrop.onclick();assert.equal(drawer.isOpen(),false);
elements.panelBtn.onclick();media.matches=false;handlers.media();assert.equal(drawer.isOpen(),false);assert.equal(elements.main.inert,false);assert.equal(elements.sidebar.attrs.role,undefined);
elements.panelBtn.onclick();assert.equal(drawer.isOpen(),false,'desktop cannot be locked by invisible drawer');
console.log('Mobile checks passed: portrait framing, drawer dismissal, focus trapping/restoration and orientation cleanup.');

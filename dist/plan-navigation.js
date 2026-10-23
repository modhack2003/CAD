// View-box navigation keeps SVG labels sharp at every zoom, including offline fallback.
export function createPlanViewport(initial=[-2,-2,21,23]){
 let base=[...initial],view=[...initial];
 return {
  get value(){return [...view]},
  reset(next=base){base=[...next];view=[...next]},
  zoom(factor,anchor=[.5,.5]){const w=Math.max(base[2]/8,Math.min(base[2],view[2]/factor)),ratio=w/view[2],h=view[3]*ratio;view=[view[0]+(view[2]-w)*anchor[0],view[1]+(view[3]-h)*anchor[1],w,h];this.clamp()},
  pan(dx,dy){view[0]+=dx;view[1]+=dy;this.clamp()},
  clamp(){view[0]=Math.max(base[0],Math.min(base[0]+base[2]-view[2],view[0]));view[1]=Math.max(base[1],Math.min(base[1]+base[3]-view[3],view[1]))}
 };
}
export function bindPlanNavigation(container,viewport){
 const points=new Map();let last;
 const apply=()=>container.querySelector('svg')?.setAttribute('viewBox',viewport.value.join(' '));
 const coords=()=>{const values=[...points.values()];return {x:values.reduce((s,p)=>s+p.x,0)/values.length,y:values.reduce((s,p)=>s+p.y,0)/values.length,d:values.length===2?Math.hypot(values[0].x-values[1].x,values[0].y-values[1].y):0}};
 container.addEventListener('pointerdown',e=>{if(points.size>=2||e.button>0)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});container.setPointerCapture(e.pointerId);last=coords();container.focus()});
 container.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});const now=coords(),r=container.getBoundingClientRect(),v=viewport.value,scale=Math.min(r.width/v[2],r.height/v[3]);if(scale>0)viewport.pan(-(now.x-last.x)/scale,-(now.y-last.y)/scale);if(now.d&&last.d)viewport.zoom(now.d/last.d);last=now;apply()});
 const release=e=>{points.delete(e.pointerId);last=points.size?coords():null};
 for(const event of ['pointerup','pointercancel','lostpointercapture'])container.addEventListener(event,release);
 container.addEventListener('wheel',e=>{e.preventDefault();viewport.zoom(e.deltaY<0?1.15:1/1.15);apply()},{passive:false});
 container.addEventListener('keydown',e=>{const shifts={ArrowLeft:[-.08,0],ArrowRight:[.08,0],ArrowUp:[0,-.08],ArrowDown:[0,.08]};if(shifts[e.key]){const v=viewport.value;viewport.pan(shifts[e.key][0]*v[2],shifts[e.key][1]*v[3])}else if(['+','=','-'].includes(e.key))viewport.zoom(e.key==='-'?1/1.2:1.2);else if(e.key==='Home')viewport.reset();else return;e.preventDefault();apply()});
 return apply;
}

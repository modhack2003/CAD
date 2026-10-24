// Shared three-flight setting-out for meshes, slab voids, walking and exports.
// x increases to drawing-right, z to drawing-bottom. The first flight starts
// at bottom-right, turns up the left side, then returns right at the top.
export function frontStairLayout(plan,height){
 const s=plan.stair,{x,z,width,depth,flightWidth:w}=s;
 if(!(w>0&&width>w&&depth>2*w&&height>0))throw new Error('Invalid three-flight stair envelope');
 const counts=[...s.drawnRisers];
 const lengths=[width-w,depth-2*w,width-w];
 // Counts are traced, not a dimensioned stair section. Keep the photograph's
 // distribution at the default height; add risers only when the height grows.
 while(height/counts.reduce((a,b)=>a+b,0)>.19+1e-9){
  let i=0;for(let j=1;j<3;j++)if(lengths[j]/counts[j]>lengths[i]/counts[i])i=j;
  counts[i]++;
 }
 const risers=counts.reduce((a,b)=>a+b,0),rise=height/risers;
 const y1=counts[0]*rise,y2=(counts[0]+counts[1])*rise;
 const flights=[
  {id:1,name:'lower',axis:'x',start:x+width,end:x+w,c:z+depth-w/2,width:w,y0:0,y1,count:counts[0]},
  {id:2,name:'middle',axis:'z',start:z+depth-w,end:z+w,c:x+w/2,width:w,y0:y1,y1:y2,count:counts[1]},
  {id:3,name:'upper',axis:'x',start:x+w,end:x+width,c:z+w/2,width:w,y0:y2,y1:height,count:counts[2]}
 ].map(f=>({...f,going:Math.abs(f.end-f.start)/f.count}));
 const landings=[{id:1,x,z:z+depth-w,width:w,depth:w,y:y1},{id:2,x,z,width:w,depth:w,y:y2}];
 const going=Math.min(...flights.map(f=>f.going));
 return {x,z,width,depth,flightWidth:w,flights,landings,risers,rise,going,
  exit:{x:x+width,z:z+w/2,width:w},
  // Right side is open only at the upper-flight arrival. The other edges
  // guard the actual opening, not an obsolete two-flight rectangle.
  guards:[[x,z,x+width,z],[x,z,x,z+depth],[x,z+depth,x+width,z+depth],[x+width,z+w,x+width,z+depth]],
  shortfall:Math.max(0,...flights.map(f=>f.count*.25-Math.abs(f.end-f.start))),
  dimensionalStatus:s.dimensionalStatus};
}

export function flightBounds(f){
 const a=Math.min(f.start,f.end),b=Math.max(f.start,f.end);
 return f.axis==='x'?{x:a,z:f.c-f.width/2,width:b-a,depth:f.width}:{x:f.c-f.width/2,z:a,width:f.width,depth:b-a};
}

export function frontStairSurface(layout,x,z){
 // No padding outside the envelope: it would allow walking into the adjacent
 // void or through its guard. Shared edges are continuous by construction.
 for(const l of layout.landings)if(x>=l.x&&x<=l.x+l.width&&z>=l.z&&z<=l.z+l.depth)return l.y;
 for(const f of layout.flights){const b=flightBounds(f);
  if(x>=b.x&&x<=b.x+b.width&&z>=b.z&&z<=b.z+b.depth){
   const p=f.axis==='x'?x:z,t=(p-f.start)/(f.end-f.start);
   return f.y0+(f.y1-f.y0)*Math.max(0,Math.min(1,t));
  }
 }
 return null;
}

export function frontStairLines(layout){
 const lines=[];
 for(const f of layout.flights){const b=flightBounds(f);
  lines.push([b.x,b.z,b.x+b.width,b.z],[b.x+b.width,b.z,b.x+b.width,b.z+b.depth],[b.x+b.width,b.z+b.depth,b.x,b.z+b.depth],[b.x,b.z+b.depth,b.x,b.z]);
  for(let i=1;i<f.count;i++){const p=f.start+(f.end-f.start)*i/f.count;
   lines.push(f.axis==='x'?[p,f.c-f.width/2,p,f.c+f.width/2,f.id]:[f.c-f.width/2,p,f.c+f.width/2,p,f.id]);
  }
 }
 for(const l of layout.landings)lines.push([l.x,l.z,l.x+l.width,l.z],[l.x,l.z+l.depth,l.x+l.width,l.z+l.depth]);
 return lines;
}

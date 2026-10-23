export const compactQuery='(max-width:760px), (max-width:1000px) and (max-height:500px)';

// A portrait viewport keeps the same horizontal field of view without moving
// the camera far away. Resize and orientation changes preserve the orbit target.
export function responsiveFov(aspect){
 const safeAspect=Math.max(.2,Number.isFinite(aspect)?aspect:1);
 return Math.min(100,2*Math.atan(Math.tan(43*Math.PI/360)/Math.min(1,safeAspect))*180/Math.PI);
}

export function setupDrawer({doc=document,win=window,onPause=()=>{}}={}){
 const panel=doc.getElementById('sidebar'),trigger=doc.getElementById('panelBtn');
 const close=doc.getElementById('closePanel'),backdrop=doc.getElementById('panelBackdrop');
 const background=[doc.getElementById('main'),doc.getElementById('appHeader')];
 const media=win.matchMedia(compactQuery);let opened=false,previousFocus;
 function setOpen(value,restoreFocus=true){
  const next=!!value&&media.matches;
  if(next&&!opened){previousFocus=doc.activeElement;onPause();}
  opened=next;panel.classList.toggle('open',next);backdrop.hidden=!next;
  trigger.setAttribute('aria-expanded',String(next));
  background.forEach(el=>{el.inert=next});
  if(next){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');close.focus();}
  else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');if(restoreFocus&&previousFocus){previousFocus.focus();previousFocus=null;}}
 }
 trigger.onclick=()=>setOpen(true);close.onclick=backdrop.onclick=()=>setOpen(false);
 win.addEventListener('keydown',e=>{
  if(!opened)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setOpen(false);return;}
  if(e.key!=='Tab')return;
  const focusable=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),summary,a[href]')].filter(el=>el.getClientRects().length);
  const first=focusable[0],last=focusable.at(-1);if(!first)return;
  if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first.focus();}
 },true);
 media.addEventListener('change',()=>{if(!media.matches)setOpen(false,false)});
 return {close:()=>setOpen(false),isOpen:()=>opened};
}

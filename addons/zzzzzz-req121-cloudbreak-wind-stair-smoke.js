(() => {
'use strict';

/* REQ-121 deterministic assembled-browser acceptance.
   Runs only under ?lqReq121Smoke=1 and exercises the canonical action wrapper. */
const params=new URLSearchParams(location.search);
if(params.get('lqReq121Smoke')!=='1')return;

const SADDLE='cloudbreakSaddle';
const WIND='windStairRidge';

function marker(data){
 const m=document.createElement('div');
 m.id='lqReq121TransitionSmokeMarker';
 m.hidden=true;
 for(const [k,v] of Object.entries(data))m.dataset[k]=String(v);
 document.body.appendChild(m);
}
function fail(error){
 marker({status:'FAIL',error:String(error?.message||error)});
 throw error;
}
function snapshotFlags(){
 try{return JSON.stringify(s.flags||{});}catch{return'__unserializable__';}
}
function assert(cond,msg){if(!cond)throw new Error(msg);}

setTimeout(()=>{
 try{
  assert(MAPS[SADDLE],'cloudbreakSaddle missing');
  assert(MAPS[WIND],'windStairRidge missing');
  const boundary=MAPS[SADDLE].npcs?.find(n=>n.kind==='lqCloudbreakBoundary');
  const back=MAPS[WIND].npcs?.find(n=>n.kind==='lqWindStairReturn');
  assert(boundary&&boundary.x===10&&boundary.y===1,'Cloudbreak boundary missing or moved');
  assert(back,'Wind Stair south return missing');

  const flagsBefore=snapshotFlags();
  s.screen='world';
  s.map=SADDLE;
  s.x=10;s.y=2;s.dir='up';s.dialog=null;
  render();
  action();

  const entered=s.map===WIND;
  const entry=[s.x,s.y];
  const row=MAPS[WIND].tiles?.[s.y]||'';
  const entryTile=row[s.x];
  const entryInBounds=s.x>=0&&s.y>=0&&s.x<MAPS[WIND].w&&s.y<MAPS[WIND].h;
  const entryWalkable=entryInBounds&&entryTile!=='#'&&entryTile!=='^';
  assert(entered,'one canonical Action did not enter windStairRidge');
  assert(entryWalkable,`Wind Stair entry is not walkable at ${entry.join(',')}`);
  assert(s.dialog?.name==='北尾根・風鳴りの石段','transition did not produce Wind Stair entry dialogue');

  s.dialog=null;
  s.x=10;s.y=17;s.dir='down';
  render();
  action();
  const returned=s.map===SADDLE&&s.x===10&&s.y===2&&s.dir==='down';
  assert(returned,'south return did not restore Cloudbreak safe spawn');
  assert(snapshotFlags()===flagsBefore,'REQ-121 transition unexpectedly mutated story flags');

  marker({
   status:'PASS',
   entered,
   entryX:entry[0],
   entryY:entry[1],
   entryWalkable,
   returned,
   flagsPreserved:true,
   sourceKind:boundary.kind,
   destination:WIND,
   newMapCreated:false
  });
 }catch(error){fail(error);}
},0);
})();

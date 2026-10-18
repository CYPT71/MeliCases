/* MeliCases ↔ Storyline 360
 * API tolérante : fonctionne dans un Web Object Storyline, une iframe ou en autonome.
 */
(function () {
  const VERSION='2.0.0';
  let lastSnapshot={status:'not-started',score:0,progress:0,safety:100,xp:0,completed:false,passed:false};

  function player(){
    try{if(window.parent&&typeof window.parent.GetPlayer==='function')return window.parent.GetPlayer();if(typeof window.GetPlayer==='function')return window.GetPlayer()}catch(_){}
    return null;
  }
  function setVar(name,value){try{const p=player();if(p&&typeof p.SetVar==='function')p.SetVar(name,value)}catch(_){}}
  function getVar(name,fallback=''){try{const p=player();if(p&&typeof p.GetVar==='function'){const value=p.GetVar(name);return value==null?fallback:value}}catch(_){}return fallback}
  function emit(type,detail={}){
    const payload={source:'melicases',version:VERSION,type,timestamp:new Date().toISOString(),...detail};
    window.dispatchEvent(new CustomEvent(`melicases:${type}`,{detail:payload}));
    try{if(window.parent&&window.parent!==window)window.parent.postMessage(payload,'*')}catch(_){}
    return payload;
  }
  function sync(snapshot={}){
    lastSnapshot={...lastSnapshot,...snapshot};
    const s=lastSnapshot;
    setVar('MeliStatus',String(s.status));setVar('MeliScore',Math.round(Number(s.score)||0));setVar('MeliProgress',Math.round(Number(s.progress)||0));setVar('MeliSafety',Math.round(Number(s.safety)||0));setVar('MeliXP',Math.round(Number(s.xp)||0));setVar('MeliTopic',String(s.topic||''));setVar('MeliCompleted',!!s.completed);setVar('MeliPassed',!!s.passed);
    setVar('EscapeScore',Math.round(Number(s.score)||0));setVar('EscapeCompleted',!!s.completed);
    return s;
  }
  const api={
    version:VERSION,
    isConnected(){return !!player()},
    getLaunchData(){return{learnerName:String(getVar('MeliLearnerName','')),difficulty:String(getVar('MeliDifficulty','standard')),seed:String(getVar('MeliSeed','')),suspendData:String(getVar('MeliSuspendData',''))}},
    ready(seed,meta={}){
      setVar('MeliVersion',VERSION);setVar('MeliSeed',String(seed||''));setVar('EscapeSeed',String(seed||''));setVar('EscapeSolved',0);setVar('EscapeLastCase','');
      sync({status:'in-progress',score:0,progress:0,safety:100,xp:0,completed:false,passed:false,...meta});
      return emit('ready',{seed:String(seed||''),connected:api.isConnected(),launch:api.getLaunchData()});
    },
    decision(data={}){
      setVar('MeliLastQuestion',String(data.questionId||''));setVar('MeliLastResult',data.correct?'correct':'incorrect');setVar('MeliConfidence',String(data.confidence||''));setVar('MeliAttempts',Number(data.attempts||0));
      sync(data);return emit('decision',data);
    },
    progress(data={}){
      const solved=Number(data.solved||0),total=Math.max(1,Number(data.total||20)),progress=Math.round(solved/total*100);
      setVar('EscapeSolved',solved);setVar('EscapeLastCase',String(data.questionId||''));sync({...data,progress});return emit('progress',{...data,progress});
    },
    caseSolved(id,solved,total,meta={}){return api.progress({questionId:id,solved,total,...meta})},
    suspend(data){const serialized=typeof data==='string'?data:JSON.stringify(data||{});setVar('MeliSuspendData',serialized);emit('suspend',{data:serialized});return serialized},
    completed(seed,meta={}){
      setVar('MeliSeed',String(seed||''));setVar('EscapeSeed',String(seed||''));setVar('EscapeSolved',Number(meta.solved||20));setVar('MeliSuspendData','');
      sync({status:'completed',progress:100,completed:true,passed:meta.passed!==false,score:Number(meta.score??100),...meta});return emit('completed',{seed:String(seed||''),...lastSnapshot});
    },
    snapshot(){return{...lastSnapshot}},
    reset(){setVar('MeliSuspendData','');sync({status:'not-started',score:0,progress:0,safety:100,xp:0,completed:false,passed:false});emit('reset')}
  };
  window.MeliCasesStoryline=api;

  window.addEventListener('message',event=>{
    const message=event.data;if(!message||message.source!=='storyline'||message.type!=='melicases:command')return;
    const allowed=['pause','resume','reset','request-state'];if(!allowed.includes(message.action))return;
    if(message.action==='request-state')emit('state',{snapshot:api.snapshot()});
    else if(message.action==='reset')api.reset();
    window.dispatchEvent(new CustomEvent('melicases:command',{detail:message}));
  });

  // Compatibilité du mode 3D dans les Web Objects qui refusent Pointer Lock.
  window.addEventListener('DOMContentLoaded',()=>{
    const start=document.getElementById('start'),options=document.getElementById('options'),openOptions=document.getElementById('startOptions'),closeOptions=document.getElementById('closeOptions');
    if(start&&options&&openOptions&&closeOptions){let returnToStart=false;openOptions.addEventListener('click',()=>{returnToStart=start.classList.contains('open');start.classList.remove('open');options.classList.add('open')});closeOptions.addEventListener('click',()=>{options.classList.remove('open');if(returnToStart)start.classList.add('open')})}
    const held=new Set();let previous=performance.now();addEventListener('keydown',event=>held.add(event.code));addEventListener('keyup',event=>held.delete(event.code));
    function keyboardFallback(now){const game=window.__MELI_TEST__,playing=start&&!start.classList.contains('open'),blocked=['modal','pause','options'].some(id=>document.getElementById(id)?.classList.contains('open'));if(game&&playing&&!blocked&&!document.pointerLockElement&&held.has(game.controls.forward)){const dt=Math.min((now-previous)/1000,.05),speed=held.has(game.controls.run)?5.2:3.1;game.teleport(game.position.x,game.position.z-speed*dt)}previous=now;requestAnimationFrame(keyboardFallback)}requestAnimationFrame(keyboardFallback);
  });
})();

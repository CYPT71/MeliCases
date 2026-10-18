(function(g){
const TOPICS=['gaz','electricite','eau','chauffage','ventilation'];
class AdaptiveDirector{
 constructor({seed='MISSION',cooldown=2}={}){this.seed=seed;this.cooldown=cooldown;this.turn=0;this.lastIntervention=-99;this.events=[];this.flags={};}
 evaluate(snapshot,context={}){this.turn++;const mastery=snapshot?.mastery||{},weak=this._weakest(mastery),weakScore=this._score(mastery,weak),avg=this._average(mastery),safety=context.safety??100,errors=context.consecutiveErrors??0,time=context.timeRemaining??999;
  let action={type:'maintain',topic:weak,reason:'stable',intensity:1};
  if(this.turn-this.lastIntervention<this.cooldown)return this._emit(action);
  if(safety<55)action={type:'safety-remediation',topic:weak,reason:'low-safety',intensity:3};
  else if(errors>=2)action={type:'remediation',topic:weak,reason:'repeated-errors',intensity:2};
  else if(time<180&&avg<60)action={type:'reduce-load',topic:weak,reason:'time-pressure',intensity:2};
  else if(avg>=82&&weakScore>=70)action={type:'escalate',topic:this._strongest(mastery),reason:'high-mastery',intensity:3};
  else if(weakScore<58||avg<58)action={type:'reinforce',topic:weak,reason:'fragile-mastery',intensity:2};
  if(action.type!=='maintain')this.lastIntervention=this.turn;return this._emit(action);
 }
 plan(action,bank=[]){const topic=action.topic||TOPICS[0],pool=bank.filter(q=>q.topic===topic);return{...action,questionIds:pool.slice(0,Math.max(1,action.intensity)).map(q=>q.id),mutations:this._mutations(action)}}
 _mutations(a){if(a.type==='escalate')return['hide-obvious-clue','add-dependent-fault','shorten-feedback'];if(a.type==='safety-remediation')return['freeze-dangerous-action','show-safety-clue','require-safe-sequence'];if(a.type==='remediation'||a.type==='reinforce')return['add-context-clue','simplify-distractors','repeat-in-new-room'];if(a.type==='reduce-load')return['remove-secondary-fault','extend-clue-visibility'];return[]}
 _score(m,t){return m[t]?.seen?m[t].score:50}
 _scores(m){return TOPICS.map(t=>[t,this._score(m,t)])}
 _weakest(m){return this._scores(m).sort((a,b)=>a[1]-b[1])[0][0]}
 _strongest(m){return this._scores(m).sort((a,b)=>b[1]-a[1])[0][0]}
 _average(m){const seen=TOPICS.filter(t=>m[t]?.seen).map(t=>m[t].score);const x=seen.length?seen:this._scores(m).map(v=>v[1]);return x.reduce((a,b)=>a+b,0)/x.length}
 _emit(a){const e={...a,turn:this.turn,at:Date.now()};this.events.push(e);this.events=this.events.slice(-100);return e}
 snapshot(){return{seed:this.seed,turn:this.turn,lastIntervention:this.lastIntervention,events:[...this.events],flags:{...this.flags}}}
}
g.MeliAdaptiveDirector=AdaptiveDirector;
})(window);
(function(g){
class AdaptiveRuntime{
 constructor({seed,director,mastery,questions=[]}){this.seed=seed;this.director=director;this.mastery=mastery;this.questions=questions;this.mutations=new Map;this.overrides=[];this.log=[];this.lastPlan=null;this.state=this.restore()||{version:1,seed,completed:[],faults:[],hints:{},sequence:{},savedAt:0}}
 decide(context={}){const action=this.director.evaluate(this.mastery.snapshot(),context),plan=this.director.plan(action,this.questions);this.lastPlan=plan;this.apply(plan);this.log.push({type:'decision',plan,at:Date.now()});this.persist();return plan}
 apply(plan){for(const m of plan.mutations||[])this.mutations.set(m,(this.mutations.get(m)||0)+1);if(plan.mutations?.includes('add-dependent-fault'))this.state.faults.push({id:`adaptive-${this.state.faults.length+1}`,topic:plan.topic,active:true,dependent:true});if(plan.mutations?.includes('show-safety-clue'))this.state.hints[plan.topic]=(this.state.hints[plan.topic]||0)+1;return this.snapshot()}
 override(command,payload={}){const e={command,payload,at:Date.now()};this.overrides.push(e);if(command==='force-topic')this.lastPlan={type:'trainer-override',topic:payload.topic,intensity:payload.intensity||2,mutations:payload.mutations||[]};if(command==='grant-hint')this.state.hints[payload.topic]=(this.state.hints[payload.topic]||0)+1;if(command==='clear-secondary-faults')this.state.faults=this.state.faults.filter(f=>!f.dependent);this.log.push({type:'override',...e});this.persist();return this.lastPlan}
 complete(id){if(!this.state.completed.includes(id))this.state.completed.push(id);this.persist()}
 key(){return`meli.adaptive.${this.seed}`}
 persist(){this.state.savedAt=Date.now();try{localStorage.setItem(this.key(),JSON.stringify({state:this.state,mutations:[...this.mutations],overrides:this.overrides,log:this.log.slice(-200)}))}catch{}}
 restore(){try{const x=JSON.parse(localStorage.getItem(this.key())||'null');if(x?.state?.seed===this.seed){this.mutations=new Map(x.mutations||[]);this.overrides=x.overrides||[];this.log=x.log||[];return x.state}}catch{}return null}
 reset(){localStorage.removeItem(this.key())}
 snapshot(){return{seed:this.seed,state:this.state,mutations:Object.fromEntries(this.mutations),overrides:this.overrides,lastPlan:this.lastPlan,log:this.log}}
}
g.MeliAdaptiveRuntime=AdaptiveRuntime;
})(window);
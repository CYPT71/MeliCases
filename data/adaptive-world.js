(function(g){
const TOPIC_FAULT={eau:'fuite_eau',gaz:'fuite_gaz',electricite:'circuit_dangereux',ventilation:'vmc_obstruee',chauffage:'radiateur_froid'};
class AdaptiveWorld{
 constructor({sim,interactions,questionObjects=[],seed='MISSION'}={}){this.sim=sim;this.interactions=interactions;this.questionObjects=questionObjects;this.seed=seed;this.applied=[];this.hidden=new Set;this.secondary=[];}
 apply(plan){if(!plan)return null;const event={type:plan.type,topic:plan.topic,mutations:[...(plan.mutations||[])],at:Date.now()};for(const m of event.mutations)this.mutate(m,plan);this.applied.push(event);this.applied=this.applied.slice(-100);return event}
 mutate(name,plan){if(name==='hide-obvious-clue')return this.hideClue(plan.topic);if(name==='add-dependent-fault')return this.addFault(plan.topic);if(name==='add-context-clue')return this.revealTopic(plan.topic);if(name==='repeat-in-new-room')return this.revealTopic(plan.topic);if(name==='remove-secondary-fault')return this.clearSecondary();if(name==='show-safety-clue')return this.revealTopic(plan.topic);}
 hideClue(topic){const o=this.questionObjects.find(x=>x.userData?.topic===topic&&x.visible);if(!o)return false;o.visible=false;this.hidden.add(o.name);this.interactions?.setEnabled(o.name,false);return true}
 revealTopic(topic){const o=this.questionObjects.find(x=>x.userData?.topic===topic);if(!o)return false;o.visible=true;this.hidden.delete(o.name);this.interactions?.setEnabled(o.name,true);return true}
 addFault(topic){const type=TOPIC_FAULT[topic];if(!type||!this.sim?.command)return false;const fault=this.sim.command({type:'spawnFault',fault:type});this.secondary.push({topic,type,fault});return true}
 clearSecondary(){this.secondary.length=0;return true}
 snapshot(){return{seed:this.seed,applied:[...this.applied],hidden:[...this.hidden],secondary:[...this.secondary]}}
}
g.MeliAdaptiveWorld=AdaptiveWorld;
})(window);
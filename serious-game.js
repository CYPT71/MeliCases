const topics=[
  {id:'gaz',label:'Gaz',icon:'G',situation:'Lors de l’état des lieux, vous contrôlez l’alimentation gaz et les appareils de combustion.'},
  {id:'electricite',label:'Électricité',icon:'E',situation:'Le tableau et les équipements visibles soulèvent des questions de sécurité électrique.'},
  {id:'eau',label:'Eau',icon:'O',situation:'Vous examinez l’eau potable, les risques sanitaires et les réseaux d’évacuation.'},
  {id:'chauffage',label:'Chauffage',icon:'C',situation:'Vous devez qualifier les équipements de chauffage et de production d’eau chaude.'},
  {id:'ventilation',label:'Ventilation',icon:'V',situation:'Des traces d’humidité imposent d’analyser ventilation, occupation et condensation.'}
];
const state={topic:0,index:0,answered:new Set(),attempts:0,successes:0,selected:new Set(),started:false};
const $=s=>document.querySelector(s);
const questionsByTopic=Object.fromEntries(topics.map(t=>[t.id,MELI_QUIZ_BANK.filter(q=>q.topic===t.id)]));
function current(){return questionsByTopic[topics[state.topic].id][state.index]}
function totalDone(){return state.answered.size}
function renderRail(){
  $('.topics').innerHTML=topics.map((t,i)=>{const qs=questionsByTopic[t.id],done=qs.filter(q=>state.answered.has(q.id)).length;return `<div class="topic ${i===state.topic?'active':''} ${done===qs.length?'done':''}"><i>${done===qs.length?'✓':t.icon}</i><span>${t.label}</span><small>${done}/${qs.length}</small></div>`}).join('');
  $('#progress').textContent=`${totalDone()} / ${MELI_QUIZ_BANK.length}`;
  $('#safety').textContent=`${Math.max(0,100-(state.attempts-state.successes)*4)}%`;
}
function renderPins(){
  document.querySelectorAll('.pin').forEach((pin,i)=>{const qs=questionsByTopic[topics[i].id],done=qs.every(q=>state.answered.has(q.id));pin.textContent=done?'✓':String(i+1);pin.className=`pin ${done?'done':''} ${i>state.topic?'locked':''}`;pin.disabled=i>state.topic;pin.onclick=()=>{state.topic=i;state.index=Math.max(0,qs.findIndex(q=>!state.answered.has(q.id)));render()}})
}
function renderIntro(){
  $('.case').innerHTML=`<div class="intro"><div class="eyebrow">Briefing de mission</div><h2>Mandat n° ML-204</h2><p>Un logement doit être remis en location. En tant que gestionnaire, vous réalisez un pré-diagnostic visuel et qualifiez les actions à engager.</p><ul><li>Explorez cinq domaines techniques.</li><li>Analysez 20 situations issues du support métier.</li><li>Une question peut comporter plusieurs bonnes réponses.</li><li>La rapidité ne compte pas : justifiez une décision sûre.</li></ul><button class="validate" id="startMission">Commencer l’inspection</button><a href="game.html" class="source">Mode 3D immersif disponible</a></div>`;
  $('#startMission').onclick=()=>{state.started=true;render()};
}
function toggle(i){state.selected.has(i)?state.selected.delete(i):state.selected.add(i);renderQuestion()}
function renderQuestion(){
  const q=current(),t=topics[state.topic],multi=q.correct.length>1;
  $('.case').innerHTML=`<div class="eyebrow">Dossier ${state.topic+1}/5 · Situation ${state.index+1}/${questionsByTopic[t.id].length}</div><h2>${t.label}</h2><div class="case-meta"><span class="tag">${q.room.join(' · ')}</span><span class="tag">${multi?'Plusieurs réponses':'Une réponse'}</span></div><div class="situation">${t.situation}</div><div class="question">${q.question}</div><div class="answers">${q.choices.map((c,i)=>`<button class="answer ${state.selected.has(i)?'selected':''}" data-choice="${i}"><span class="mark">${state.selected.has(i)?'✓':''}</span><span>${c}</span></button>`).join('')}</div><button class="validate" id="validate" ${state.selected.size?'':'disabled'}>Valider ma décision</button><div id="feedback"></div>`;
  document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const i=+b.dataset.choice;if(!multi)state.selected.clear();toggle(i)});
  $('#validate').onclick=validate;
}
function validate(){
  const q=current(),chosen=[...state.selected].sort((a,b)=>a-b),expected=[...q.correct].sort((a,b)=>a-b),ok=chosen.length===expected.length&&chosen.every((v,i)=>v===expected[i]),fb=MELI_FEEDBACK[q.id];
  state.attempts++; if(ok){state.successes++;state.answered.add(q.id);MeliCasesStoryline.caseSolved(q.id,totalDone(),MELI_QUIZ_BANK.length)}
  const correct=q.correct.map(i=>q.choices[i]).join(' + ');
  $('#feedback').className=`feedback ${ok?'ok':'bad'}`;
  $('#feedback').innerHTML=`<h3>${ok?'Décision sûre':'Décision à revoir'}</h3><p>${ok?fb.explanation:fb.error}</p>${ok?'':`<p><strong>Réponse attendue :</strong> ${correct}</p><p>${fb.explanation}</p>`}<p class="source">Référence métier : support « Connaissance technique du logement », ${fb.source}</p><button class="next" id="next">${ok?'Poursuivre l’inspection':'Réessayer'}</button>`;
  document.querySelectorAll('.answer').forEach(b=>b.disabled=true);$('#validate').disabled=true;
  $('#next').onclick=()=>ok?advance():(state.selected.clear(),renderQuestion());renderRail();renderPins();
}
function advance(){
  const list=questionsByTopic[topics[state.topic].id];state.selected.clear();
  if(state.index<list.length-1){state.index++}else if(state.topic<topics.length-1){state.topic++;state.index=0}else{return renderSummary()}
  render();
}
function renderSummary(){
  MeliCasesStoryline.completed('ML-204');
  const pct=Math.round(state.successes/state.attempts*100);$('.case').innerHTML=`<div class="summary"><div class="eyebrow">Rapport de mission</div><h2>Inspection terminée</h2><div class="score-ring" style="--score:${pct}%"><strong>${pct}%</strong></div><p>${MELI_QUIZ_BANK.length} situations traitées · ${state.attempts-state.successes} erreur(s) corrigée(s)</p><p class="muted">Vous avez parcouru les cinq domaines : gaz, électricité, eau, chauffage et ventilation.</p><button class="restart" onclick="location.reload()">Nouvelle mission</button></div>`;
}
function render(){renderRail();renderPins();state.started?renderQuestion():renderIntro()}
MeliCasesStoryline.ready('ML-204');
render();

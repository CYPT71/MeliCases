/* Schémas vectoriels animés : aucune aide n’est injectée dans la finale. */
(function(g){
 const diagrams={
 ventilation:{title:'Comment l’air traverse le logement',caption:'L’air entre dans les pièces principales, circule entre les pièces puis est extrait dans les pièces de service.',nodes:['Entrées d’air','Pièces principales','Pièces de service','Extraction'],flow:'air'},
 humidite:{title:'Humidité : relier les indices au contexte',caption:'Traces, température et renouvellement de l’air sont des informations à croiser. Une trace seule ne démontre pas une cause.',nodes:['Usages rapportés','Air intérieur','Paroi / fenêtre','Indices visibles'],flow:'humidity'},
 eau:{title:'De la distribution à l’évacuation',caption:'Le compteur mesure un volume sur l’alimentation. Après utilisation, l’eau rejoint un réseau d’évacuation distinct.',nodes:['Alimentation','Compteur','Point de puisage','Évacuation'],flow:'water'},
 chauffage:{title:'De la production à l’émetteur',caption:'La chaleur est produite, distribuée, puis transmise à la pièce par l’émetteur. Le radiateur seul ne révèle pas l’énergie de production.',nodes:['Production','Distribution','Radiateur','Pièce chauffée'],flow:'heat'},
 gaz:{title:'Observer les éléments d’une installation de gaz',caption:'Repérez l’alimentation, le raccordement et l’appareil. Relevez les signes visibles ; une intervention technique relève du professionnel compétent.',nodes:['Alimentation','Raccordement','Appareil','Signalement'],flow:'gas'},
 electricite:{title:'Identifier le circuit concerné',caption:'Reliez le tableau et les équipements visibles au signalement. Le schéma ne constitue pas une consigne de manipulation.',nodes:['Tableau','Circuit','Équipement','Signalement'],flow:'electric'},
 reseaux:{title:'Des réseaux aux fonctions distinctes',caption:'La distribution apporte l’eau ; l’évacuation la collecte après utilisation. L’alimentation électrique est un réseau distinct.',nodes:['Distribution d’eau','Point d’usage','Évacuation','Électricité'],flow:'networks'}
 };
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function icon(flow,index){
  const inlet='<path d="M-17 -9 H17 V9 H-17 Z M-12 -4 H12 M-12 1 H12 M-12 6 H12"/>';
  const room='<path d="M-18 10 V-7 L0 -17 L18 -7 V10 Z M-6 10 V-2 H6 V10"/>';
  const fan='<circle r="14"/><g class="motion-fan"><path d="M0 0 Q-18 -17 -4 -12 Z M0 0 Q18 -17 12 -4 Z M0 0 Q18 17 4 12 Z M0 0 Q-18 17 -12 4 Z"/></g>';
  const boiler='<rect x="-13" y="-16" width="26" height="29" rx="4"/><path d="M-7 14 V20 M7 14 V20 M-7 3 H7"/>';
  const radiator='<rect x="-19" y="-11" width="38" height="24" rx="3"/><path d="M-11 -10 V12 M-3 -10 V12 M5 -10 V12 M13 -10 V12"/>';
  const pipes='<path d="M-22 -8 H22 M-22 8 H22"/><path class="motion-flow" d="M-22 -8 H22"/>';
  const tap='<path d="M-18 12 V-5 H8 V5 H17 M-7 -5 V-14 M-15 -14 H1"/><path class="motion-drip" d="M17 8 V16"/>';
  const meter='<circle r="15"/><rect x="-10" y="-5" width="20" height="9" rx="2"/><path d="M-24 0 H-15 M15 0 H24"/>';
  const note='<path d="M-12 -16 H7 L15 -8 V16 H-12 Z M-6 -2 H8 M-6 5 H8 M-6 11 H4"/>';
  const choices={air:[inlet,room,fan,inlet],water:[pipes,meter,tap,pipes],heat:[boiler,pipes,radiator,room],gas:[pipes,pipes,boiler,note],electric:[boiler,pipes,room,note],humidity:[room,fan,inlet,note]};
  return (choices[flow]||choices.air)[index];
 }
 function render(q){
  const d=diagrams[q.topic]||diagrams.reseaux,id='motion-'+q.id;
  let nodes=d.nodes.map((label,i)=>`<g class="motion-node" style="--step:${i}"><rect x="${20+i*150}" y="58" width="130" height="72" rx="12"/><g class="motion-symbol" transform="translate(${85+i*150} 81)">${icon(d.flow,i)}</g><text x="${85+i*150}" y="119" text-anchor="middle">${label}</text></g>`).join('');
  let links=[0,1,2].map(i=>`<path class="motion-flow motion-link-${i}" d="M${150+i*150} 94 H${170+i*150}"/>`).join('');
  let returnCircuit=d.flow==='heat'?'<path class="motion-return" d="M385 134 V170 H85 V134"/><text class="motion-note" x="310" y="194" text-anchor="middle">Retour du circuit d’eau depuis l’émetteur</text>':'';
  if(d.flow==='networks'){nodes='<g class="motion-node"><rect x="250" y="70" width="120" height="65" rx="12"/><text x="310" y="108" text-anchor="middle">Logement</text></g><text x="20" y="32">Distribution d’eau</text><text x="410" y="32">Électricité</text><text x="440" y="180">Évacuation</text>';links='<path class="motion-flow" d="M20 45 H200 V90 H245"/><path class="motion-flow motion-power" d="M600 45 H400 V90 H375"/><path class="motion-flow motion-drain" d="M375 120 H400 V165 H600"/>';returnCircuit='';}

  return `<figure class="motion-design" data-motion="${d.flow}"><figcaption id="${id}">${d.title}</figcaption><svg class="motion-diagram" viewBox="0 0 620 210" role="img" aria-labelledby="${id} ${id}-desc"><desc id="${id}-desc">${safe(d.caption)}</desc>${nodes}${links}${returnCircuit}<circle class="motion-particle" r="4" cx="0" cy="94"/></svg><p>${safe(d.caption)}</p><div class="motion-controls"><button type="button" class="secondary" data-motion-toggle aria-pressed="false">METTRE EN PAUSE</button><button type="button" class="secondary" data-motion-replay>REVOIR L’ANIMATION</button></div></figure>`;
 }
 function wire(container){
  container.querySelectorAll('[data-motion-toggle]').forEach(button=>button.onclick=()=>{const figure=button.closest('.motion-design'),paused=figure.classList.toggle('motion-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'REPRENDRE L’ANIMATION':'METTRE EN PAUSE';});
  container.querySelectorAll('[data-motion-replay]').forEach(button=>button.onclick=()=>{const figure=button.closest('.motion-design');figure.classList.remove('motion-paused');figure.querySelectorAll('[data-motion-toggle]').forEach(b=>{b.textContent='METTRE EN PAUSE';b.setAttribute('aria-pressed','false');});figure.querySelectorAll('svg *').forEach(el=>el.getAnimations().forEach(animation=>{animation.currentTime=0;}));});
 }
 g.MeliMotion={render,wire};
})(window);

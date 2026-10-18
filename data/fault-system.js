(function(g){
  const TYPES={
    gaz:{label:'Suspicion gaz',category:'Sécurité',urgency:'Immédiat',action:'Couper le gaz, aérer et interdire toute flamme',keywords:['couper','gaz','aérer'],visual:'gas',color:0xff6b52},
    electricite:{label:'Défaut électrique',category:'Sécurité',urgency:'Immédiat',action:'Isoler le circuit au tableau et baliser la zone',keywords:['isoler','circuit','tableau'],visual:'spark',color:0xffbd45},
    eau:{label:'Fuite ou défaut sanitaire',category:'Eau',urgency:'Prioritaire',action:'Couper l’arrivée d’eau et protéger les biens',keywords:['couper','eau'],visual:'water',color:0x45b8ff},
    chauffage:{label:'Défaut de chauffage',category:'Confort',urgency:'À planifier',action:'Relever les symptômes et faire contrôler l’équipement',keywords:['contrôler','équipement'],visual:'cold',color:0x7dd3fc},
    ventilation:{label:'Défaut de ventilation',category:'Confort',urgency:'Prioritaire',action:'Dégager les entrées d’air et demander un contrôle VMC',keywords:['air','vmc'],visual:'humidity',color:0x66d39e}
  };
  function enrich(question,index){const type=TYPES[question.topic]||TYPES.ventilation;return{...question,fault:{id:question.faultId||`PANNE-${index+1}`,topic:question.topic,room:question.room,label:type.label,category:type.category,urgency:type.urgency,action:type.action,keywords:type.keywords,visual:type.visual,color:type.color}}}
  function actionsFor(fault){const alternatives=Object.values(TYPES).map(type=>type.action).filter(action=>action!==fault.action),offset=parseInt(String(fault.id).replace(/\D/g,''),10)||0;return[fault.action,alternatives[offset%alternatives.length],alternatives[(offset+2)%alternatives.length]].sort((a,b)=>((a.length+offset)%7)-((b.length+offset)%7))}
  function evaluate(report,faults){
    const observation=String(report.observation||'').trim(),action=String(report.action||'').toLocaleLowerCase('fr');
    const roomNames={sdb:'salle de bains',entree:'entrée',wc:'wc',cuisine:'cuisine',salon:'salon',chambre:'chambre'},reportedRoom=String(report.room||'').toLocaleLowerCase('fr');
    const candidates=faults.filter(f=>(roomNames[f.room]||f.room).toLocaleLowerCase('fr')===reportedRoom&&f.category===report.type);
    const match=candidates.find(f=>f.urgency===report.urgency)||candidates[0];
    const checks={roomAndType:!!candidates.length,urgency:!!match&&match.urgency===report.urgency,observation:observation.length>=25,action:!!match&&match.keywords.some(keyword=>action.includes(keyword))};
    const score=Object.values(checks).filter(Boolean).length*25,errors=[];
    if(!checks.roomAndType)errors.push('La pièce et la nature ne correspondent à aucune panne constatée.');if(!checks.urgency)errors.push(`Le niveau d’urgence attendu est « ${match?.urgency||faults[0]?.urgency} ».`);if(!checks.observation)errors.push('Le constat doit décrire des faits observables en au moins 25 caractères.');if(!checks.action)errors.push(`La mesure conservatoire doit notamment prévoir : ${match?.action||faults[0]?.action}.`);
    return{valid:score===100,score,checks,errors,matchedFault:match?.id||null};
  }
  g.MeliFaultSystem={TYPES,enrich,actionsFor,evaluate};
})(window);

(function(g){
  const LEVELS={
    1:{id:1,label:'Tutoriel',subtitle:'Prendre en main le diagnostic',minutes:8},
    2:{id:2,label:'Parcours par pièce',subtitle:'Sécurité · Eau · Confort',minutes:25},
    3:{id:3,label:'Logement surprise',subtitle:'Pannes aléatoires · Fiche d’incident',minutes:20}
  };
  const MISSIONS={
    securite:{id:'securite',label:'Sécurité',topics:['gaz','electricite'],color:'#ff7254'},
    eau:{id:'eau',label:'Eau',topics:['eau'],color:'#55b7ee'},
    confort:{id:'confort',label:'Confort',topics:['chauffage','ventilation'],color:'#7bd3a6'}
  };
  function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let a=hash(seed);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function shuffle(values,random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function missionFor(question){return Object.values(MISSIONS).find(mission=>mission.topics.includes(question.topic))?.id||'securite'}
  function build(level,seed,bank){
    const id=Math.min(3,Math.max(1,Number(level)||1)),random=rng(`${seed}:niveau:${id}`);
    let questions;
    if(id===1)questions=[bank.find(q=>q.id===6),bank.find(q=>q.id===10),bank.find(q=>q.id===18)].filter(Boolean);
    else if(id===2)questions=shuffle(bank,random);
    else questions=shuffle(bank,random).slice(0,6);
    questions=questions.map((question,index)=>({...question,room:question.room[Math.floor(random()*question.room.length)],order:index+1,mission:missionFor(question),faultId:`PANNE-${String(index+1).padStart(2,'0')}`}));
    if(id===3&&g.MeliFaultSystem)questions=questions.map(g.MeliFaultSystem.enrich);
    return{...LEVELS[id],seed:String(seed),questions,total:questions.length,missions:Object.values(MISSIONS).map(mission=>({...mission,total:questions.filter(q=>q.mission===mission.id).length})).filter(m=>m.total),requiresIncidentReport:id===3,randomized:id===3};
  }
  g.MeliCampaign={LEVELS,MISSIONS,build,missionFor};
})(window);

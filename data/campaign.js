(function(g){
 const LEVELS={
  1:{id:1,label:'Briefing',subtitle:'Votre mission commence ici !',minutes:10},
  2:{id:2,label:'Missions thématiques',subtitle:'Sécurité · Eau · Climat intérieur',minutes:95},
  3:{id:3,label:'Mission finale',subtitle:'À vous de jouer !',minutes:15}
 };
 const MISSIONS=g.MeliStory.missions;
 function build(level,seed){
  const id=Math.min(3,Math.max(1,Number(level)||1));
  const questions=(id===1?g.MeliStory.diagnostic:id===2?g.MeliStory.training:g.MeliStory.final).map((q,i)=>({...q,order:i+1}));
  return{...LEVELS[id],seed:String(seed),questions,total:questions.length,missions:Object.values(MISSIONS).map(m=>({...m,total:questions.filter(q=>q.mission===m.id).length})).filter(m=>m.total),requiresIncidentReport:id===3,randomized:false};
 }
 g.MeliCampaign={LEVELS,MISSIONS,build,missionFor:g.MeliStory.missionFor};
})(window);

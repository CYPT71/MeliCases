/* Extraits à copier dans des déclencheurs « Exécuter JavaScript » Storyline. */

// Demander au Web Object de renvoyer son état courant.
function requestMeliCasesState(frameSelector='iframe') {
  const frame=document.querySelector(frameSelector);
  frame?.contentWindow?.postMessage({source:'storyline',type:'melicases:command',action:'request-state'},'*');
}

// Réinitialiser la tentative depuis un bouton Storyline.
function resetMeliCases(frameSelector='iframe') {
  const frame=document.querySelector(frameSelector);
  frame?.contentWindow?.postMessage({source:'storyline',type:'melicases:command',action:'reset'},'*');
}

// Écouter les événements du jeu dans le document publié.
window.addEventListener('message',event=>{
  const data=event.data;
  if(!data||data.source!=='melicases')return;
  if(data.type==='completed'){
    const player=GetPlayer();
    player.SetVar('MeliCompleted',true);
    player.SetVar('MeliPassed',data.passed!==false);
    player.SetVar('MeliScore',Math.round(data.score||0));
  }
});

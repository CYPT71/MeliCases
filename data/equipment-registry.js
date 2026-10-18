/* Références partagées entre décor, activités et fiches. Les points sont locaux
 * au modèle : déplacer un équipement déplace aussi son point d’observation. */
(function(g){
 const equipment={
  stove:{label:'Raccordement de la cuisinière',room:'cuisine',kind:'stove',p:[4.95,1.03,.5],point:[0,.13,.35]},
  boiler:{label:'Chaudière murale',room:'cuisine',kind:'boiler',p:[6.48,1.8,5.65],yaw:-Math.PI/2,point:[0,0,.3]},
  kitchen_inlet:{label:'Grille d’amenée d’air',room:'cuisine',kind:'vent',p:[6.52,1.15,4.25],yaw:-Math.PI/2,point:[0,0,.22]},
  panel:{label:'Tableau électrique',room:'entree',kind:'panel',p:[1.12,1.95,6.5],yaw:Math.PI,point:[0,0,.25]},
  socket:{label:'Prise près du lavabo',room:'sdb',kind:'socket',p:[3.25,1.25,-6.52],point:[0,0,.22]},
  network_plan:{label:'Plan des réseaux',room:'entree',kind:'plan',p:[.35,1.95,6.52],yaw:Math.PI,point:[0,0,.2]},
  wc_pipe:{label:'Évacuation du WC',room:'wc',kind:'pipe',p:[5.15,.36,-1.12],point:[-.35,.12,.12]},
  meter:{label:'Compteur d’eau',room:'cuisine',kind:'meter',p:[6.49,.85,4.95],yaw:-Math.PI/2,point:[0,0,.26]},
  basin:{label:'Lavabo et évacuation',room:'sdb',kind:'tap',p:[2.45,1.02,-6.05],point:[0,.12,.34]},
  kitchen_sink:{label:'Point d’eau de la cuisine',room:'cuisine',kind:'tap',p:[3.55,1.02,.48],point:[0,.12,.34]},
  radiator:{label:'Radiateur du séjour',room:'salon',object:'living_radiator',point:[0,.1,.3]},
  bath_extract:{label:'Bouche d’extraction de la salle d’eau',room:'sdb',kind:'vent',p:[3.8,2.4,-6.52],point:[0,0,.22]},
  living_inlet:{label:'Entrée d’air du séjour',room:'salon',kind:'vent',p:[-6.52,2.5,3.25],yaw:Math.PI/2,point:[0,0,.22]},
  kitchen_extract:{label:'Bouche d’extraction de la cuisine',room:'cuisine',kind:'vent',p:[6.52,2.45,2.4],yaw:-Math.PI/2,point:[0,0,.22]},
  bedroom_window:{label:'Fenêtre et entrée d’air de la chambre',room:'chambre',kind:'window_inlet',p:[-4.35,2.42,-6.52],point:[0,-.45,.28]},
  bath_wall:{label:'Paroi de la salle d’eau',room:'sdb',kind:'wall',p:[6.52,1.8,-5.65],yaw:-Math.PI/2,point:[0,0,.22]}
 };
 const training=['stove','boiler','kitchen_inlet','panel','socket','panel','network_plan','wc_pipe','meter','basin','kitchen_sink','basin','wc_pipe','boiler','radiator','bath_extract','living_inlet','kitchen_extract','bedroom_window','bath_wall'];
 const final=['boiler','panel','basin','radiator','bedroom_window'];
 function bind(q,i,isFinal=false){const equipmentId=(isFinal?final:training)[i],item=equipment[equipmentId];if(!item||item.room!==q.room)throw new Error('Équipement incohérent pour la situation '+q.id);return {...q,equipmentId,equipmentLabel:item.label};}
 g.MeliEquipment={equipment,bind};
})(window);

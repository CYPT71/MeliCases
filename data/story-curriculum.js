/* Déclinaison jouable du synopsis Mission Logement. Les consignes métier
 * restent des propositions pédagogiques à valider avec les experts Foncia. */
(function(g){
 const missions={
  securite:{id:'securite',label:'Sécurité',topics:['gaz','electricite','reseaux'],minutes:35,color:'#ff7254',description:'Gaz · Électricité · Réseaux'},
  eau:{id:'eau',label:'Eau',topics:['eau'],minutes:25,color:'#55b7ee',description:'Distribution · Comptage · Risques sanitaires'},
  climat:{id:'climat',label:'Climat intérieur',topics:['chauffage','ventilation','humidite'],minutes:35,color:'#7bd3a6',description:'Chauffage · Ventilation · Humidité'}
 };
 const sequences=[
  ['gaz','Gaz : quels signes doivent m’alerter ?',15,'Observer les équipements sans intervenir dessus ; relever les signes visibles et transmettre.'],
  ['electricite','Électricité : quels risques visibles repérer ?',12,'Repérer les anomalies apparentes sans ouvrir ni démonter les équipements.'],
  ['reseaux','Réseaux : où se trouvent les réseaux techniques ?',8,'Distinguer alimentation, évacuation et énergie pour orienter le signalement.'],
  ['comptage','Eau et comptage : que faut-il relever ?',10,'Identifier les équipements et relever des informations datées et localisées.'],
  ['sanitaire','Risques sanitaires : quand faut-il alerter ?',15,'Recueillir les faits rapportés sans établir soi-même un diagnostic technique.'],
  ['chauffage','Chauffage : quel système reconnaître ?',12,'Distinguer production, distribution et émission de chaleur.'],
  ['ventilation','Ventilation : pourquoi renouveler l’air ?',13,'Relier entrées d’air, circulation et extraction dans le logement.'],
  ['humidite','Humidité : quelles questions poser ?',10,'Une trace ne prouve pas une cause unique ; distinguer faits et hypothèses.']
 ];
 // séquence, pièce, ancrage existant, constat, information utile, suite adaptée
 const rows=[
 [0,'cuisine','bouteille_gaz','Le raccordement de la cuisinière présente une dégradation visible.','Localisation, équipement et état visible du raccordement','Transmettre le point de vigilance sans démonter le raccordement'],
 [0,'cuisine','chauffe_eau','Un appareil de production d’eau chaude est raccordé au gaz.','Type d’appareil, localisation et informations disponibles','Décrire l’équipement et demander un contrôle adapté si nécessaire'],
 [0,'cuisine','grilles_air','Une grille d’amenée d’air est masquée par un rangement.','Emplacement et obstruction visible de la grille','Signaler le point de vigilance et demander une prise en charge adaptée'],
 [1,'entree','tableau','Le capot d’un équipement électrique est cassé.','Équipement concerné, localisation et dégradation visible','Signaler l’anomalie sans ouvrir l’équipement'],
 [1,'sdb','equipotentielle','Une prise proche du lavabo présente une dégradation apparente.','Position de la prise et description de son état visible','Faire orienter le signalement vers un professionnel habilité'],
 [1,'entree','mise_securite','L’occupant indique que le disjoncteur déclenche régulièrement.','Depuis quand, fréquence et appareils en fonctionnement','Transmettre les faits sans effectuer de réparation'],
 [2,'entree','consuel','Le plan distingue alimentation électrique et distribution d’eau.','Fonction de chaque réseau et repères du plan','Identifier le réseau concerné avant de transmettre'],
 [2,'wc','wc','Une canalisation évacue les eaux du WC.','Pièce, appareil et réseau d’évacuation concerné','Associer la canalisation à sa fonction d’évacuation'],
 [3,'cuisine','plomb','Le compteur porte un identifiant et un index lisible.','Identifiant, index, date et localisation du compteur','Consigner un relevé daté en identifiant le compteur'],
 [3,'sdb','douche','Le lavabo est alimenté en eau et raccordé à une évacuation.','Équipement concerné et circuit à décrire','Distinguer alimentation et évacuation dans le signalement'],
 [4,'cuisine','roai','L’occupante dit : « L’eau a changé de couleur depuis hier. »','Date d’apparition, points de puisage et circonstances','Transmettre les faits sans garantir la qualité sanitaire'],
 [4,'sdb','vmc_entretien','L’occupant signale une odeur inhabituelle près du lavabo.','Localisation, ancienneté et conditions d’apparition','Recueillir les faits et orienter la demande pour vérification'],
 [4,'wc','wc','Des gouttes sont visibles au sol près du WC.','Localisation, moment d’apparition et étendue visible','Signaler les faits sans attribuer d’emblée une cause'],
 [5,'cuisine','chaudiere','Une chaudière murale et des canalisations sont visibles.','Équipement de production et informations disponibles','Identifier la production de chaleur sans manipuler l’appareil'],
 [5,'salon','ventouse','Le radiateur est raccordé à deux canalisations.','Type d’émetteur et système de production à confirmer','Distinguer l’émetteur de l’énergie utilisée pour produire la chaleur'],
 [6,'sdb','vmc_hygro','Une bouche d’extraction est masquée.','Emplacement, obstruction visible et circonstances','Signaler l’obstruction et demander une vérification adaptée'],
 [6,'salon','fenetre','Des entrées d’air sont visibles au-dessus des fenêtres.','Localisation des entrées d’air et des bouches d’extraction','Identifier le trajet de l’air dans le logement'],
 [6,'cuisine','vmc_gaz','La cuisine possède une bouche d’extraction.','Pièce et fonction de la bouche','Expliquer son rôle dans le renouvellement de l’air'],
 [7,'chambre','humidite','Des traces sombres entourent une fenêtre.','Ancienneté, conditions de chauffage et usages rapportés','Distinguer les traces observées d’une hypothèse sur leur cause'],
 [7,'sdb','condensation','Des gouttelettes sont visibles sur une paroi après la douche.','Moment d’apparition, durée et conditions de renouvellement d’air','Recueillir les circonstances avant de transmettre']
 ];
 const missionFor=q=>Object.values(missions).find(m=>m.topics.includes(q.topic))?.id||'securite';
 function question(row,i,final=false){
  const [sequence,room,clue,observation,information,action]=row,seq=sequences[sequence];
  const topic=sequence===3||sequence===4?'eau':seq[0];
  const choices=[information,'Une cause technique certaine déduite de cette seule observation','Un avis général sans localisation ni contexte'];
  const correct=i%3;[choices[0],choices[correct]]=[choices[correct],choices[0]];
  return{id:(final?301:1)+i,topic,room,clue,sequence:seq[1],sequenceId:sequence,minutes:seq[2],explanation:seq[3],observation,information,action,choices,correct:[correct],question:final?'Quelles informations retenez-vous pour votre signalement ?':'Analyser : quelles informations faut-il relever ?',mission:missionFor({topic}),faultId:'SITUATION-'+(i+1)};
 }
 function place(q,i,final=false){return g.MeliEquipment.bind(q,i,final);}
 const training=rows.map((r,i)=>place(question(r,i),i));
 const diagnostic=training.filter((q,i)=>[0,3,8,13,15].includes(i)).map((q,i)=>({...q,id:101+i,question:'Faire le point : quelles informations sont utiles ?'}));
 const finalRows=[
 [0,'cuisine','chauffe_eau','Sur le raccordement de l’appareil à gaz, une zone paraît détériorée.','Équipement, emplacement et aspect visible de la zone','Transmettre pour vérification sans intervenir sur le raccordement'],
 [1,'entree','tableau','Une partie du capot du tableau est absente.','Localisation et état visible du capot','Faire prendre en charge l’anomalie par un professionnel habilité'],
 [4,'sdb','douche','L’occupante rapporte une eau trouble au lavabo depuis son retour de vacances.','Points concernés, ancienneté et conditions d’apparition','Transmettre les faits sans conclure à la potabilité'],
 [5,'salon','ventouse','L’occupant signale que le radiateur reste froid depuis la veille.','Émetteur, date d’apparition et autres pièces concernées','Transmettre les symptômes pour un contrôle adapté'],
 [7,'chambre','humidite','Des gouttelettes et des traces sombres sont visibles autour de la fenêtre ; l’entrée d’air est masquée.','Traces, entrée d’air, ancienneté et circonstances rapportées','Signaler les faits sans conclure à une cause unique']
 ];
 const final=finalRows.map((r,i)=>place(question(r,i,true),i,true));
 g.MeliStory={missions,sequences,training,diagnostic,final,missionFor};
})(window);

window.MELI_OBJECTS={
vanne_eau:{label:'Vanne d’arrêt eau',type:'switch',rooms:['cuisine','sdb','wc'],action:'vanne_eau',states:['ouverte','fermee'],hitbox:.18},
vanne_gaz:{label:'Robinet gaz',type:'switch',rooms:['cuisine'],action:'vanne_gaz',states:['ouvert','ferme'],hitbox:.16},
disjoncteur:{label:'Disjoncteur général',type:'switch',rooms:['entree'],action:'disjoncteur',states:['on','off'],hitbox:.14},
bouche_vmc:{label:'Bouche VMC',type:'inspect',rooms:['cuisine','sdb'],action:'bouche_vmc',states:['libre','obstruee'],hitbox:.18},
radiateur:{label:'Radiateur',type:'inspect',rooms:['salon','chambre'],action:'radiateur',states:['chaud','froid'],hitbox:.2},
tiroir:{label:'Tiroir',type:'container',rooms:['cuisine','sdb','chambre'],action:'open',states:['ferme','ouvert'],hitbox:.12},
placard:{label:'Placard',type:'container',rooms:['cuisine','chambre'],action:'open',states:['ferme','ouvert'],hitbox:.12},
cle:{label:'Clé',type:'pickup',rooms:['cuisine','salon','chambre'],action:'pickup',states:['world','inventory'],hitbox:.22},
document:{label:'Document technique',type:'pickup',rooms:['entree','salon','cuisine'],action:'pickup',states:['world','inventory'],hitbox:.2},
porte_sortie:{label:'Porte de sortie',type:'door',rooms:['entree'],action:'exit',states:['verrouillee','ouverte'],hitbox:.1}
};
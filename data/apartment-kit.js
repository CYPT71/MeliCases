window.MELI_APARTMENT_STYLE={palette:{bedroom:0x35b7a5,bathroom:0x3aa9d8,kitchen:0x414bb2,living:0xf0cfaa,hall:0xe7d47d,wall:0xf7f1e8,wood:0xa56b42,green:0x82a93e,purple:0x6652bd,coral:0xe58a67},rooms:{bedroom:{label:'Chambre',floor:0x76d4c7},bathroom:{label:'Salle de bains',floor:0xb8e3ee},kitchen:{label:'Cuisine',floor:0xaab1e4},living:{label:'Séjour',floor:0xf0d6b4},hall:{label:'Entrée',floor:0xe9dc9c}}};
window.MELI_ROOM_ZONES=[{id:'chambre',p:[-3.75,.01,-3.42],s:[5.9,.03,6.55],c:0x76d4c7,texture:'wood'},{id:'sdb',p:[3.82,.012,-4.98],s:[5.55,.035,3.35],c:0xb8e3ee,texture:'tile'},{id:'wc',p:[4.9,.013,-1.65],s:[3.45,.036,2.9],c:0xc7e8ed,texture:'tile'},{id:'couloir',p:[.1,.014,-3.4],s:[1.65,.04,6.5],c:0xe4d5a7,texture:'terrazzo'},{id:'salon',p:[-3.35,.015,3.4],s:[6.55,.04,6.4],c:0xf0d6b4,texture:'wood'},{id:'cuisine',p:[3.4,.016,3.4],s:[6.6,.045,6.4],c:0xaab1e4,texture:'tile'},{id:'entree',p:[.35,.018,5.75],s:[2.15,.05,1.65],c:0xe9dc9c,texture:'terrazzo'}];
// Implantation pensée par zones d'usage : aucun meuble ne flotte au milieu
// d'une circulation et les ensembles fonctionnels restent alignés.
window.MELI_FURNITURE=[
{id:'bed_main',kind:'bed',room:'chambre',p:[-4.25,.38,-5.78],s:[2.5,.75,1.7],c:0x86a238,solid:true,facing:'south',mount:'north'},{id:'bed_pillow',kind:'pillow',room:'chambre',p:[-4.25,.82,-6.12],s:[1.15,.16,.42],c:0xf2e3d5,facing:'south'},{id:'wardrobe_main',kind:'wardrobe',room:'chambre',p:[-6.15,1,-2.65],s:[1.05,2,1.2],c:0xe7a44d,solid:true,facing:'east',mount:'west'},{id:'desk_main',kind:'desk',room:'chambre',p:[-2.15,.48,-6.36],s:[1.45,.95,.65],c:0xe8d2aa,solid:true,facing:'south',mount:'north'},{id:'nightstand',kind:'table',room:'chambre',p:[-5.82,.38,-5.9],s:[.55,.75,.55],c:0xd39262,solid:true,facing:'south',mount:'north'},
{id:'vanity_main',kind:'vanity',room:'sdb',p:[2.45,.45,-6.36],s:[1.5,.9,.65],c:0xd5b18a,solid:true,facing:'south',mount:'north'},{id:'mirror',kind:'mirror',room:'sdb',p:[2.45,1.65,-6.66],s:[1.2,.85,.05],c:0x8fd5e7,facing:'south',mount:'north'},{id:'shower_main',kind:'shower',room:'sdb',p:[5.96,.9,-5.96],s:[1.45,1.8,1.45],c:0x8ed6e8,solid:true,facing:'south',mount:'north-east'},{id:'wc_main',kind:'wc',room:'wc',p:[5.15,.38,-.65],s:[.65,.75,.85],c:0xf5f3ed,solid:true,facing:'north',mount:'south'},
{id:'kitchen_line',kind:'kitchen',room:'cuisine',p:[4.45,.48,.44],s:[2.7,.95,.7],c:0x7552bd,solid:true,facing:'south',mount:'north'},{id:'kitchen_high',kind:'cabinet',room:'cuisine',p:[5.85,1.65,.39],s:[.75,.75,.65],c:0xb18fd4,solid:true,facing:'south',mount:'north'},{id:'fridge_main',kind:'fridge',room:'cuisine',p:[6.24,1,1.55],s:[.9,2,.85],c:0xe6e9ea,solid:true,facing:'west',mount:'east'},{id:'island_main',kind:'island',room:'cuisine',p:[4.35,.48,3.35],s:[1.8,.95,.75],c:0xe2d8ca,solid:true,facing:'west'},
{id:'sofa_main',kind:'sofa',room:'salon',p:[-4.45,.48,3.65],s:[2.8,.95,1.05],c:0xd89869,solid:true,facing:'north'},{id:'coffee_main',kind:'table',room:'salon',p:[-4.45,.34,2.15],s:[1.35,.15,.8],c:0xa87753,solid:true,facing:'north'},{id:'bookcase_main',kind:'bookcase',room:'salon',p:[-5.65,1,6.48],s:[1.75,2,.45],c:0x8baa3c,solid:true,facing:'north',mount:'south'},{id:'media_console',kind:'desk',room:'salon',p:[-4.45,.34,.31],s:[2.1,.68,.45],c:0x8b6a45,solid:true,facing:'south',mount:'north'},{id:'tv_main',kind:'tv',room:'salon',p:[-4.45,1.28,.08],s:[1.65,.85,.12],c:0x242c35,facing:'south',mount:'north'},{id:'rug_main',kind:'rug',room:'salon',p:[-4.45,.03,2.85],s:[3.55,.04,2.45],c:0xd9a985,facing:'north'},
{id:'bike',kind:'bike',room:'entree',p:[.72,.72,6.38],s:[1.15,1.25,.28],c:0x2985a7,solid:false,facing:'north'},{id:'plant',kind:'plant',room:'salon',p:[-6.05,.65,1.15],s:[.55,1.3,.55],c:0x6d9b3b,solid:true,facing:'east'}
,{id:'kitchen_tiles',kind:'backsplash',room:'cuisine',p:[4.45,1.35,.09],s:[2.7,.62,.04],c:0xdbe7e4,facing:'south',mount:'north'},{id:'salon_art',kind:'wallart',room:'salon',p:[-2.15,1.65,.09],s:[1.35,.95,.05],c:0xe9c37b,facing:'south',mount:'north'},{id:'bedroom_curtain',kind:'curtain',room:'chambre',p:[-4.35,1.55,-6.65],s:[2.2,2.1,.08],c:0xe7d3bd,facing:'south',mount:'north'},{id:'bath_towel',kind:'towel',room:'sdb',p:[1.35,1.25,-6.65],s:[.75,1.05,.08],c:0xf3c3ad,facing:'south',mount:'north'},{id:'living_radiator',kind:'radiator',room:'salon',p:[-6.65,.78,4.55],s:[1.45,1.05,.08],c:0xe9eceb,facing:'east',mount:'west'},{id:'floor_lamp',kind:'lamp',room:'salon',p:[-2.15,1.05,5.75],s:[.5,2.05,.5],c:0xd7b45f,facing:'north'}
];
// Objets d'usage en glTF : ils densifient les pièces sans devenir des obstacles
// invisibles dans les circulations. Les appareils sont posés sur leur support réel.
window.MELI_PROPS=[
 {id:'desk_chair',kind:'chairDesk',room:'chambre',p:[-2.15,.48,-5.45],s:[.62,.92,.62],facing:'north'},
 {id:'desk_laptop',kind:'laptop',room:'chambre',p:[-2.15,1.01,-6.28],s:[.55,.42,.38],facing:'south'},
 {id:'bedside_lamp',kind:'lampTable',room:'chambre',p:[-5.82,.88,-5.9],s:[.28,.48,.28],facing:'south'},
 {id:'bedroom_books',kind:'books',room:'chambre',p:[-1.86,1.01,-6.28],s:[.28,.16,.24],facing:'south'},
 {id:'bathroom_bin',kind:'trashcan',room:'sdb',p:[1.45,.25,-5.72],s:[.34,.5,.34],facing:'south'},
 {id:'kitchen_sink_detail',kind:'kitchenSink',room:'cuisine',p:[3.55,1.01,.43],s:[.72,.2,.54],facing:'south'},
 {id:'kitchen_hob_detail',kind:'stoveElectric',room:'cuisine',p:[4.52,1.01,.43],s:[.7,.18,.54],facing:'south'},
 {id:'kitchen_coffee_machine',kind:'coffeeMachine',room:'cuisine',p:[5.25,1.22,.43],s:[.34,.42,.32],facing:'south'},
 {id:'kitchen_microwave',kind:'microwave',room:'cuisine',p:[5.84,1.14,.43],s:[.52,.36,.38],facing:'south'},
 {id:'island_stool_north',kind:'barStool',room:'cuisine',p:[3.33,.45,3.08],s:[.42,.9,.42],facing:'east'},
 {id:'island_stool_south',kind:'barStool',room:'cuisine',p:[3.33,.45,3.68],s:[.42,.9,.42],facing:'east'},
 {id:'living_lounge_chair',kind:'loungeChair',room:'salon',p:[-2.15,.46,4.15],s:[.76,.92,.78],facing:'west',solid:true},
 {id:'tv_speaker_left',kind:'speaker',room:'salon',p:[-5.62,.48,.38],s:[.28,.96,.3],facing:'south'},
 {id:'tv_speaker_right',kind:'speaker',room:'salon',p:[-3.28,.48,.38],s:[.28,.96,.3],facing:'south'},
 {id:'sofa_side_table',kind:'sideTable',room:'salon',p:[-2.7,.34,5.15],s:[.55,.68,.55],facing:'north'},
 {id:'entry_coat_rack',kind:'coatRack',room:'entree',p:[1.42,.9,6.35],s:[.42,1.8,.42],facing:'west'},
 {id:'kitchen_toaster',kind:'toaster',room:'cuisine',p:[3.1,1.15,.43],s:[.32,.28,.25],facing:'south'}
];
window.MELI_SKIN={
 bed:{base:0x8b6a45,accent:0x86a238,soft:0xf0d7bd},pillow:{base:0xf5eadf,soft:0xffffff},wardrobe:{base:0xc98242,accent:0x69462f},desk:{base:0xc49a6c,accent:0x72523b},table:{base:0xa87753,accent:0x5f4635},vanity:{base:0xd5b18a,accent:0x8c684d},mirror:{base:0xbfeaf4,metal:0xd7dee2},shower:{base:0xaee8f2,metal:0xcfd8dc},wc:{base:0xf7f7f2,accent:0xd9e4e7},kitchen:{base:0x6652bd,accent:0xe9b85f,metal:0xcbd1d4},cabinet:{base:0x8b70c7,accent:0xe9b85f},fridge:{base:0xdfe5e8,accent:0x707b82,metal:0xb8c1c5},island:{base:0xe5d6c6,accent:0x6652bd},sofa:{base:0xd58c64,accent:0xf0c5a5,soft:0xe8a67d},bookcase:{base:0x7d9d3c,accent:0xa56b42},tv:{base:0x202831,accent:0x516879,metal:0x89959c},rug:{base:0xd5a174,accent:0x6652bd,soft:0xe3bd91},bike:{base:0x287f9f,accent:0xe9b85f,metal:0x26333a},plant:{base:0x6f963e,accent:0x3f6f38},backsplash:{base:0xdbe7e4,accent:0x8fb9b1},wallart:{base:0x38576b,accent:0xe9c37b},curtain:{base:0xe7d3bd,accent:0xc69b7c,soft:0xf1e3d3},towel:{base:0xf3c3ad,accent:0xcf7e67,soft:0xffded0},radiator:{base:0xe9eceb,accent:0xb7c3c7,metal:0xcbd1d4},lamp:{base:0xd7b45f,accent:0xffdf94,metal:0x766349},default:{base:0xb99b7b,accent:0x6652bd}};
window.MELI_SKIN_PARTS={bed:[['headboard',[0,.38,-.72],[1,.75,.12],'base'],['mattress',[0,.25,0],[.94,.28,.9],'soft'],['blanket',[0,.42,.18],[.9,.12,.48],'accent'],['weave1',[-.28,.49,.22],[.025,.025,.45],'soft'],['weave2',[0,.49,.22],[.025,.025,.45],'soft'],['weave3',[.28,.49,.22],[.025,.025,.45],'soft']],wardrobe:[['doorL',[-.24,0,.51],[.45,.9,.03],'base'],['doorR',[.24,0,.51],[.45,.9,.03],'base'],['grain1',[-.38,0,.55],[.018,.82,.02],'accent'],['grain2',[.38,0,.55],[.018,.82,.02],'accent'],['handleL',[-.06,0,.57],[.025,.18,.025],'accent'],['handleR',[.06,0,.57],[.025,.18,.025],'accent']],sofa:[['back',[0,.35,-.38],[.96,.58,.18],'base'],['seat',[0,.08,0],[.9,.28,.75],'soft'],['cushionL',[-.24,.28,-.18],[.4,.38,.18],'accent'],['cushionR',[.24,.28,-.18],[.4,.38,.18],'soft'],['seam',[0,.09,.38],[.025,.18,.05],'accent'],['armL',[-.47,.18,0],[.08,.45,.78],'base'],['armR',[.47,.18,0],[.08,.45,.78],'base']],fridge:[['upper',[0,.25,.51],[.9,.42,.025],'base'],['lower',[0,-.24,.51],[.9,.48,.025],'base'],['handle',[-.34,.08,.55],[.035,.45,.025],'accent']],tv:[['screen',[0,0,.54],[.94,.86,.02],'base'],['glow',[0,0,.57],[.82,.7,.01],'accent']],plant:[['pot',[0,-.32,0],[.55,.45,.55],'accent'],['leafL',[-.22,.18,0],[.28,.65,.18],'base'],['leafR',[.22,.25,.05],[.28,.75,.18],'base'],['leafC',[0,.32,-.05],[.24,.9,.18],'base']],bike:[['frame',[0,0,0],[.65,.08,.08],'base'],['bar',[.1,.18,0],[.08,.5,.08],'accent']],mirror:[['glass',[0,0,.52],[.9,.88,.02],'base'],['frame',[0,0,.5],[1,.98,.035],'metal']],shower:[['glassL',[-.42,0,0],[.04,.95,.9],'base'],['glassR',[0,0,-.42],[.9,.95,.04],'base'],['rail',[.35,.1,.35],[.04,.8,.04],'metal']],wc:[['bowl',[0,-.18,.08],[.75,.45,.72],'base'],['tank',[0,.27,-.3],[.72,.45,.28],'base']],kitchen:[['counter',[0,.48,0],[1,.08,1],'metal'],['front',[0,0,.51],[.96,.78,.03],'base'],['joint',[0,0,.55],[.02,.72,.02],'accent'],['handle',[0,.05,.57],[.55,.035,.025],'accent']],cabinet:[['front',[0,0,.51],[.94,.92,.03],'base'],['panel',[0,0,.55],[.82,.78,.02],'accent'],['handle',[.32,0,.58],[.035,.35,.025],'accent']],island:[['top',[0,.48,0],[1.06,.09,1.08],'accent'],['front',[0,0,.51],[.95,.8,.03],'base'],['slat1',[-.3,0,.55],[.035,.7,.02],'accent'],['slat2',[0,0,.55],[.035,.7,.02],'accent'],['slat3',[.3,0,.55],[.035,.7,.02],'accent']],bookcase:[['back',[0,0,-.45],[.94,.96,.05],'base'],['shelf1',[0,-.25,0],[.95,.05,.9],'accent'],['shelf2',[0,.25,0],[.95,.05,.9],'accent'],['book1',[-.3,-.08,.4],[.1,.28,.18],'accent'],['book2',[-.16,-.05,.4],[.1,.34,.18],'base'],['book3',[.18,.4,.4],[.12,.3,.18],'accent']],desk:[['top',[0,.48,0],[1.05,.08,1.05],'base'],['drawer',[0,.25,.42],[.7,.22,.15],'accent'],['grain',[0,.54,.2],[.8,.02,.45],'accent']],vanity:[['top',[0,.48,0],[1.05,.08,1.05],'base'],['basin',[0,.53,0],[.55,.06,.55],'accent']],table:[['top',[0,.45,0],[1.04,.12,1.04],'base'],['grain1',[0,.52,-.2],[.82,.025,.03],'accent'],['grain2',[0,.52,.2],[.82,.025,.03],'accent']],pillow:[['soft',[0,0,0],[1.02,1.05,1.02],'soft'],['seam',[0,0,.52],[.8,.08,.02],'accent']],rug:[['patternA',[0,.7,-.3],[.82,.05,.08],'accent'],['patternB',[0,.7,0],[.82,.05,.08],'soft'],['patternC',[0,.7,.3],[.82,.05,.08],'accent']],backsplash:[['h1',[0,-.25,.55],[.96,.025,.02],'accent'],['h2',[0,0,.55],[.96,.025,.02],'accent'],['h3',[0,.25,.55],[.96,.025,.02],'accent'],['v1',[-.33,0,.55],[.02,.9,.02],'accent'],['v2',[.33,0,.55],[.02,.9,.02],'accent']],wallart:[['canvas',[0,0,.55],[.86,.82,.02],'accent'],['shape1',[-.2,.12,.58],[.22,.22,.02],'base'],['shape2',[.2,-.14,.58],[.3,.28,.02],'base']],curtain:[['fold1',[-.36,0,.55],[.12,.95,.03],'accent'],['fold2',[-.12,0,.55],[.12,.95,.03],'soft'],['fold3',[.12,0,.55],[.12,.95,.03],'accent'],['fold4',[.36,0,.55],[.12,.95,.03],'soft']],towel:[['band1',[0,-.22,.55],[.9,.08,.02],'accent'],['band2',[0,.22,.55],[.9,.08,.02],'accent']],radiator:[['fin1',[-.35,0,0],[.15,.9,1.1],'accent'],['fin2',[-.12,0,0],[.15,.9,1.1],'base'],['fin3',[.12,0,0],[.15,.9,1.1],'accent'],['fin4',[.35,0,0],[.15,.9,1.1],'base']],lamp:[['pole',[0,-.05,0],[.08,.7,.08],'metal'],['shade',[0,.38,0],[.75,.35,.75],'accent'],['base',[0,-.48,0],[.65,.06,.65],'metal']]};

// Rideaux latéraux : la baie reste ouverte pour laisser lire le décor extérieur.
window.MELI_SKIN_PARTS.curtain=[['fold1',[-.43,0,.55],[.12,.95,.03],'accent'],['fold2',[-.31,0,.55],[.1,.95,.03],'soft'],['fold3',[.31,0,.55],[.1,.95,.03],'accent'],['fold4',[.43,0,.55],[.12,.95,.03],'soft']];

window.MELI_ARCHITECTURE={
  walls:[
    {id:'outer_north',p:[0,1.5,-6.8],s:[13.8,3,.18],finish:'plaster'},
    {id:'outer_south',p:[0,1.5,6.8],s:[13.8,3,.18],finish:'plaster'},
    {id:'outer_west',p:[-6.8,1.5,0],s:[.18,3,13.8],finish:'plaster'},
    {id:'outer_east',p:[6.8,1.5,0],s:[.18,3,13.8],finish:'plaster'},
    {id:'bedroom_south',p:[-3.8,1.5,0],s:[6,3,.16],finish:'paint'},
    {id:'wet_south',p:[3.9,1.5,0],s:[5.8,3,.16],finish:'paint'},
    {id:'bed_hall_north',p:[-.8,1.5,-4.4],s:[.16,3,4.8],finish:'paint'},
    {id:'bed_hall_south',p:[-.8,1.5,-.45],s:[.16,3,.9],finish:'paint'},
    {id:'wet_hall_north',p:[1,1.5,-4.65],s:[.16,3,4.3],finish:'tile'},
    {id:'wet_hall_south',p:[1,1.5,-.7],s:[.16,3,1.4],finish:'tile'},
    {id:'living_kitchen_north',p:[0,1.5,3.05],s:[.16,3,3.3],finish:'paint'},
    {id:'living_kitchen_south',p:[0,1.5,6.4],s:[.16,3,.8],finish:'paint'}
  ],
  doors:[
    {id:'door_bedroom',p:[-1.25,1.05,-2],s:[.9,2.1,.06],r:[0,0,0],c:0xb98558},
    {id:'door_bathroom',p:[1.45,1.05,-2.5],s:[.9,2.1,.06],r:[0,0,0],c:0xb98558}
  ],
  openings:[
    {id:'frame_bedroom',axis:'x',center:[-.8,-1.45],width:1.1},
    {id:'frame_bathroom',axis:'x',center:[1,-1.95],width:1.1},
    {id:'opening_living_kitchen',axis:'x',center:[0,5.35],width:1.3}
  ],
  windows:[
    {id:'window_bedroom',p:[-4.35,1.65,-6.68],s:[2.2,1.35,.05],r:[0,0,0],exterior:'courtyard'},
    {id:'window_bathroom',p:[4.55,1.8,-6.68],s:[1.5,.9,.05],r:[0,0,0],exterior:'rooftops'},
    {id:'window_living',p:[-6.68,1.65,3.25],s:[.05,1.45,2.4],r:[0,0,0],exterior:'courtyard'},
    {id:'window_kitchen',p:[6.68,1.65,3.3],s:[.05,1.25,1.8],r:[0,0,0],exterior:'rooftops'}
  ]
};

// Plafond continu et éclairage domestique coordonné à l'implantation de référence.
window.MELI_CEILINGS=[{id:'ceiling_continuous',p:[0,3.01,0],s:[13.8,.08,13.8]}];
window.MELI_SUBFLOOR={id:'subfloor_continuous',p:[0,-.055,0],s:[13.8,.1,13.8],color:0xd8cdbb};
// Pièces de finition réellement modélisées. Elles masquent les micro-jours liés
// à la précision WebGL/Safari au lieu de compter sur des faces coplanaires.
window.MELI_JOINERY=[
 {id:'cornice_north',p:[0,2.92,-6.64],s:[13.35,.12,.16],surface:'plaster',color:0xeee8de},
 {id:'cornice_south',p:[0,2.92,6.64],s:[13.35,.12,.16],surface:'plaster',color:0xeee8de},
 {id:'cornice_west',p:[-6.64,2.92,0],s:[.16,.12,13.35],surface:'plaster',color:0xeee8de},
 {id:'cornice_east',p:[6.64,2.92,0],s:[.16,.12,13.35],surface:'plaster',color:0xeee8de},
 {id:'threshold_bedroom',p:[-.8,.045,-1.45],s:[.3,.035,1.18],surface:'wood',color:0xb99368},
 {id:'threshold_bathroom',p:[1,.047,-1.95],s:[.3,.035,1.18],surface:'wood',color:0xb99368},
 {id:'threshold_living_kitchen',p:[0,.05,5.35],s:[.3,.035,1.38],surface:'terrazzo',color:0xd8cdbb},
 {id:'sill_bedroom',p:[-4.35,.94,-6.55],s:[2.38,.08,.28],surface:'wood',color:0xc69b70},
 {id:'sill_bathroom',p:[4.55,1.31,-6.55],s:[1.68,.08,.28],surface:'tile',color:0xe4edf0},
 {id:'sill_living',p:[-6.55,.91,3.25],s:[.28,.08,2.58],surface:'wood',color:0xc69b70},
 {id:'sill_kitchen',p:[6.55,1.01,3.3],s:[.28,.08,1.98],surface:'tile',color:0xe4edf0}
];
window.MELI_CEILING_LIGHTS=[
  {id:'light_bedroom',p:[-3.75,2.82,-3.45],color:0xffd7a1,intensity:10,distance:6},
  {id:'light_bathroom',p:[3.65,2.82,-5.0],color:0xe5f5ff,intensity:9,distance:5},
  {id:'light_wc',p:[4.85,2.82,-1.65],color:0xe8f6ff,intensity:7,distance:4},
  {id:'light_hall',p:[.1,2.82,-3.35],color:0xffe3b8,intensity:7,distance:5},
  {id:'light_living',p:[-3.35,2.82,3.35],color:0xffd39a,intensity:11,distance:6},
  {id:'light_kitchen',p:[3.4,2.82,3.35],color:0xffe4bd,intensity:10,distance:6}
];
window.MELI_ACCENT_WALLS=[
  {id:'accent_bedroom_north',p:[-3.85,1.5,-6.695],s:[5.7,3,.025],color:0x259f91},
  {id:'accent_bedroom_west',p:[-6.695,1.5,-3.4],s:[.025,3,6.55],color:0x218c80},
  {id:'accent_bathroom_north',p:[3.8,1.5,-6.695],s:[5.6,3,.025],color:0x2f91c4},
  {id:'accent_bathroom_east',p:[6.695,1.5,-4.7],s:[.025,3,3.9],color:0x247eb4},
  {id:'accent_living_west',p:[-6.695,1.5,3.4],s:[.025,3,6.35],color:0x5143a8},
  {id:'accent_kitchen_east',p:[6.695,1.5,3.4],s:[.025,3,6.35],color:0x43399c}
];

window.MELI_CLUE_ANCHORS={
  bouteille_gaz:[5.15,1.05,.9],chauffe_eau:[5.75,1.25,-4.7],grilles_air:[6.55,1.65,2.7],roai:[3.45,.95,.65],certificat:[.25,1.05,-.5],tableau:[.55,1.35,4.1],equipotentielle:[2.45,.95,-6.0],mise_securite:[.55,1.35,4.1],consuel:[.35,1.05,-.6],plomb:[2.75,.8,-6.0],douche:[5.55,1.1,-5.55],wc:[5.15,.85,-.65],chaudiere:[5.55,1.35,.7],ventouse:[6.55,1.75,1.2],vmc_hygro:[3.8,2.25,-6.55],vmc_entretien:[4.1,2.25,-6.55],vmc_gaz:[5.55,1.5,.7],fenetre:[-4.35,1.55,-6.45],humidite:[-4.45,1.05,3.45],condensation:[-6.45,1.25,3.25]
};

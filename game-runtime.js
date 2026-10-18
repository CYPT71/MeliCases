import {buildEquipment} from './data/equipment-models.js';
import {loadMeliModel} from './data/gltf-model-loader.js';
import * as THREE from './assets/vendor/three/three.module.js';
import {PointerLockControls} from './assets/vendor/three/PointerLockControls.js';

const $=id=>document.getElementById(id),qs=new URLSearchParams(location.search);
const seed=qs.get('seed')||crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
const difficulty=qs.get('difficulty')||'standard';
const campaignLevel=Math.min(3,Math.max(1,Number(qs.get('level'))||1));
const simState=MeliSimulation.build(seed,difficulty,MELI_QUIZ_BANK),level=MeliCampaign.build(campaignLevel,seed,MELI_QUIZ_BANK);
const progressKey='meli.story.progress.v1';
let campaignProgress={unlocked:1,completed:{},answers:{},draft:{}};
try{const saved=JSON.parse(localStorage.getItem(progressKey)||MeliCasesStoryline.getLaunchData().suspendData||'null');if(saved?.schema===1)campaignProgress={...campaignProgress,...saved};}catch{}
// Une séquence consignée reste acquise même si le navigateur a fermé avant le bilan.
if(MeliStory.diagnostic.every(q=>campaignProgress.answers[1]?.[q.id]))campaignProgress.completed[1]=true;
Object.values(MeliCampaign.MISSIONS).forEach(m=>{if(MeliStory.training.filter(q=>q.mission===m.id).every(q=>campaignProgress.answers[2]?.[q.id]))campaignProgress.completed[m.id]=true;});
let activeMission=MeliCampaign.MISSIONS[qs.get('mission')]?.id||Object.keys(MeliCampaign.MISSIONS).find(id=>!campaignProgress.completed[id])||'securite';
const stageAvailable=()=>level.id===1||level.id===2&&!!campaignProgress.completed[1]||level.id===3&&Object.keys(MeliCampaign.MISSIONS).every(id=>campaignProgress.completed[id]);
function persistStory(){campaignProgress.schema=1;try{localStorage.setItem(progressKey,JSON.stringify(campaignProgress));}catch{}MeliCasesStoryline.suspend(campaignProgress);}
const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mastery=new MeliProgressionEngine(seed),objectives=new MeliObjectiveEngine(level.questions.map(q=>({questionId:q.id,room:q.room}))),director=new MeliAdaptiveDirector({seed});
const controls=Object.assign({forward:'KeyW',back:'KeyS',left:'KeyQ',right:'KeyD',interact:'KeyE',run:'ShiftLeft',pause:'Escape'},JSON.parse(localStorage.getItem('meli.controls')||localStorage.getItem('meliControls')||'{}'));
const sound=new MeliSoundEngine();
$('seedLabel').textContent=level.id===3?'Logement B-307 · Visite préventive':'Logement A-204 · Parcours accompagné';
$('levelName').textContent=level.label+' · '+(level.id===3?'B-307':'A-204');
document.querySelectorAll('[data-level]').forEach(card=>{
 const id=Number(card.dataset.level),available=id===1||id===2&&!!campaignProgress.completed[1]||id===3&&Object.keys(MeliCampaign.MISSIONS).every(m=>campaignProgress.completed[m]);
 card.classList.toggle('active',id===level.id);card.disabled=!available;
 const status=document.createElement('em');status.className='level-state';status.textContent=campaignProgress.completed[id]?'✓ Terminé':available?'Disponible':'À débloquer';card.append(status);
 card.onclick=()=>{if(id!==level.id)navigateStage(id);};
});
function navigateStage(id){const next=new URL(location.href);next.searchParams.set('level',id);next.searchParams.set('seed',seed);location.href=next;}
function renderMissionChoices(){
 $('missionChoices').innerHTML=level.id===2?Object.values(MeliCampaign.MISSIONS).map(m=>`<button data-mission="${m.id}" class="${m.id===activeMission?'selected':''}"><b>${m.label} · ${m.minutes} min</b><small>${m.description}${campaignProgress.completed[m.id]?' · Terminée':''}</small></button>`).join(''):'';
 document.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>chooseMission(b.dataset.mission));
}
function chooseMission(id){if(!MeliCampaign.MISSIONS[id])return;activeMission=id;renderMissionChoices();update();adapt();}
renderMissionChoices();
$('selectedLevel').textContent=level.id===1?'Vous suivez des logements sans être spécialiste du bâtiment. Prenez en main le logement, découvrez la fiche puis répondez à cinq questions non notées.':level.id===2?'Choisissez une mission. Explorez les équipements, consultez des explications courtes et entraînez-vous à signaler les faits.':'Votre mission : visiter le logement B-307, repérer plusieurs points de vigilance et transmettre une fiche complète. Aucune aide ni correction avant transmission.';
$('factSituations').textContent=level.total;$('factMissions').textContent=level.id===2?3:1;$('factTime').textContent=level.minutes;
$('play').disabled=!stageAvailable();$('play').textContent=level.id===1?'COMMENCER LE BRIEFING':level.id===2?'COMMENCER LA MISSION':'À VOUS DE JOUER !';
const tutorialSteps=[
  ['Votre mission commence ici !','Vous suivez des logements. Observez, analysez les informations et choisissez une suite adaptée : votre rôle est de repérer et signaler, sans intervenir comme un technicien.'],
  ['Se déplacer sans se bloquer','Utilisez W ou Z pour avancer, S pour reculer, Q/D ou les flèches pour vous orienter. Maintenez Maj pour aller plus vite. Le déplacement fonctionne même si la souris n’est pas capturée.'],
  ['Observer le logement','Déplacez la souris pour regarder autour de vous. La touche V alterne à tout moment entre la visite à pied et la vue d’ensemble du logement.'],
  ['Repérer puis inspecter','Les marqueurs lumineux signalent une situation technique. Placez le viseur dessus puis appuyez sur E, ou utilisez le bouton « Interagir ».'],
  ['Décider et apprendre','Sélectionnez une ou plusieurs réponses puis validez. Une explication apparaît après une bonne réponse comme après une erreur. En cas d’erreur, vous pouvez corriger votre décision.'],
  ['Suivre votre mission','Le carnet indique la pièce, la sécurité et l’avancement par mission. Échap ouvre la pause. La fiche regroupe la pièce, les faits observés, les informations utiles et la suite à donner. Découvrez-la avec le bouton du carnet, puis répondez aux cinq questions non notées.']
];
let tutorialStep=-1;
function renderTutorial(){if(level.id!==1)return;const coach=$('tutorialCoach');if(tutorialStep<0||tutorialStep>=tutorialSteps.length){coach.classList.remove('open');localStorage.setItem('meli.tutorialComplete','1');lockPointer();return}const [title,text]=tutorialSteps[tutorialStep],requiresAction=tutorialStep>=1&&tutorialStep<=4;pointer.unlock();coach.classList.add('open');$('tutorialTitle').textContent=title;$('tutorialText').textContent=text;$('tutorialCount').textContent=`Tutoriel · ${tutorialStep+1}/${tutorialSteps.length}`;$('tutorialProgress').style.width=`${(tutorialStep+1)/tutorialSteps.length*100}%`;$('nextTutorial').disabled=requiresAction;$('nextTutorial').textContent=requiresAction?'À VOUS DE JOUER':tutorialStep===tutorialSteps.length-1?'COMMENCER':'SUIVANT'}
function startTutorial(){tutorialStep=0;renderTutorial()}function advanceTutorial(){if(tutorialStep>=1&&tutorialStep<=4)return;tutorialStep++;renderTutorial()}function tutorialAction(step){if(level.id===1&&tutorialStep===step){tutorialStep++;renderTutorial()}}function skipTutorial(){tutorialStep=tutorialSteps.length;renderTutorial()}
$('nextTutorial').onclick=advanceTutorial;$('skipTutorial').onclick=skipTutorial;
addEventListener('mousemove',event=>{if(Math.abs(event.movementX)+Math.abs(event.movementY)>4)tutorialAction(2)});

// Même kit de logement, ambiance et implantation d’indices propres au B-307.
if(level.id===3){MELI_ROOM_ZONES.forEach(zone=>{zone.c=new THREE.Color(zone.c).offsetHSL(.08,-.1,-.04).getHex();});MELI_FURNITURE.filter(f=>['bed','sofa','rug','cabinet'].includes(f.kind)).forEach(f=>{f.c=new THREE.Color(f.c).offsetHSL(.18,-.05,0).getHex();});}
const canvas=$('c'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
const initialQuality=localStorage.getItem('meli.quality')||'balanced';renderer.setPixelRatio(initialQuality==='eco'?1:Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=initialQuality!=='eco';renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const scene=new THREE.Scene();scene.background=new THREE.Color(0xb8d4dc);scene.fog=new THREE.Fog(0xb8d4dc,20,46);
const camera=new THREE.PerspectiveCamera(68,1,.1,80);camera.position.set(.4,1.65,5.7);const pointer=new PointerLockControls(camera,document.body);scene.add(camera);
function lockPointer(){
  try{
    const request=pointer.domElement.requestPointerLock();
    if(request?.catch)request.catch(()=>{});
  }catch{}
}
// Orthographic dollhouse view shares the interactive apartment geometry.
const overviewCamera=new THREE.OrthographicCamera(-12,12,12,-12,.1,100);
overviewCamera.position.set(19,22,25);overviewCamera.lookAt(0,.5,0);
let overview=true;
const cutawayObjects=[];
function setOverview(enabled){
  overview=enabled;
  scene.traverse(object=>{if(!object.isMesh||!object.material?.isMeshStandardMaterial)return;
    const mat=object.material;
    if(!('interiorMap' in mat.userData))mat.userData.interiorMap=mat.map;
    mat.map=enabled?null:mat.userData.interiorMap;mat.needsUpdate=true;
  });
  cutawayObjects.forEach(object=>object.visible=enabled?false:object.userData.interiorVisible);
  scene.background.set(enabled?0xffffff:0xb8d4dc);scene.fog=enabled?null:new THREE.Fog(0xb8d4dc,20,46);
  $('overviewToggle').textContent=enabled?'EXPLORER À PIED':'V · VUE D’ENSEMBLE';
  document.body.classList.toggle('overview-mode',enabled);
  if(enabled)pointer.unlock();else if(started&&!paused&&!modalOpen)lockPointer();
}
$('overviewToggle').onclick=()=>setOverview(!overview);

scene.add(new THREE.HemisphereLight(0xfff8eb,0x5b7180,1.8));const sun=new THREE.DirectionalLight(0xffefd2,1.8);sun.position.set(-5,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);

const textureCache=new Map(),loadedImageTextures=new Set(),loadedExteriorTextures=new Set(),exteriorTextureCache=new Map(),solids=[],rendered=[];
const imageTexturePaths={wood:'assets/textures/oak-parquet.webp',tile:'assets/textures/ceramic-tile.webp',plaster:'assets/textures/plaster-wall.webp',paint:'assets/textures/plaster-wall.webp',fabric:'assets/textures/woven-fabric.webp',bedlinen:'assets/textures/bed-linen-green.webp',rug:'assets/textures/geometric-rug.webp',terrazzo:'assets/textures/terrazzo.webp'};
const textureRepeats={wood:[2,3],tile:[3,3],plaster:[2,2],paint:[2,2],fabric:[5,5],bedlinen:[2,2],rug:[1,1],terrazzo:[4,4]},textureLoader=new THREE.TextureLoader();
function proceduralTexture(type,color){
  const key=`${type}-${color}`;if(textureCache.has(key))return textureCache.get(key);
  const el=document.createElement('canvas');el.width=el.height=256;const x=el.getContext('2d');x.fillStyle=`#${new THREE.Color(color).getHexString()}`;x.fillRect(0,0,256,256);x.globalAlpha=.16;x.strokeStyle='#23313a';x.fillStyle='#ffffff';
  if(type==='wood'){for(let y=12;y<256;y+=24){x.beginPath();x.moveTo(0,y);for(let px=0;px<=256;px+=16)x.lineTo(px,y+Math.sin((px+y)*.05)*3);x.stroke()}for(let i=0;i<18;i++)x.fillRect((i*71)%256,(i*43)%256,22,1)}
  else if(type==='tile'){x.lineWidth=2;for(let n=0;n<=256;n+=64){x.beginPath();x.moveTo(n,0);x.lineTo(n,256);x.stroke();x.beginPath();x.moveTo(0,n);x.lineTo(256,n);x.stroke()}}
  else if(type==='terrazzo'){for(let i=0;i<120;i++){x.globalAlpha=.1+(i%4)*.03;x.fillStyle=i%3?'#ffffff':'#1c5260';x.fillRect((i*83)%256,(i*47)%256,2+i%4,2+i%3)}}
  else if(type==='fabric'){x.lineWidth=1;for(let n=0;n<256;n+=8){x.beginPath();x.moveTo(n,0);x.lineTo(n,256);x.stroke();x.beginPath();x.moveTo(0,n);x.lineTo(256,n);x.stroke()}}
  else if(type==='plaster'||type==='paint'){for(let i=0;i<180;i++){x.globalAlpha=.035;x.fillRect((i*97)%256,(i*61)%256,2,2)}}
  else if(type==='rug'){for(let n=-256;n<512;n+=32){x.beginPath();x.moveTo(n,0);x.lineTo(n+256,256);x.stroke()}}
  x.globalAlpha=1;const map=new THREE.CanvasTexture(el);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(type==='wood'?3:4,type==='wood'?3:4);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return map;
}
function texture(type,color){
  const key=`${type}-${color}`;if(textureCache.has(key))return textureCache.get(key);
  if(!imageTexturePaths[type]){const fallback=proceduralTexture(type,color);textureCache.set(key,fallback);return fallback}
  const map=textureLoader.load(imageTexturePaths[type],()=>loadedImageTextures.add(type),undefined,()=>console.warn(`Texture image indisponible: ${type}`));map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(...textureRepeats[type]);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textureCache.set(key,map);return map;
}
function material(color,kind='paint',surface=kind){const neutralImageSurface=['wood','tile','fabric','bedlinen','rug','terrazzo'].includes(surface),cfg={color:neutralImageSurface?0xffffff:color,roughness:.68,metalness:0,map:texture(surface,color)};if(kind==='metal'){cfg.color=color;cfg.roughness=.25;cfg.metalness=.72;delete cfg.map}if(kind==='glass'){cfg.color=color;cfg.transparent=true;cfg.opacity=.22;cfg.roughness=.08;cfg.metalness=.12;cfg.depthWrite=false;delete cfg.map}if(kind==='soft')cfg.roughness=.94;const result=new THREE.MeshStandardMaterial(cfg);if(kind==='paint'){result.polygonOffset=true;result.polygonOffsetFactor=1;result.polygonOffsetUnits=1}return result}
// Précharge le jeu complet de matières, y compris celles désormais portées par les glTF.
Object.keys(imageTexturePaths).forEach(type=>texture(type,0xffffff));
function cube(name,p,s,color,solid=true,kind='paint',parent=scene,rotation=[0,0,0],surface=kind){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...s),material(color,kind,surface));mesh.name=name;mesh.position.set(...p);mesh.rotation.set(...rotation);mesh.castShadow=kind!=='glass';mesh.receiveShadow=true;parent.add(mesh);if(solid)solids.push(mesh);rendered.push(mesh);return mesh}

function exteriorTexture(name){if(exteriorTextureCache.has(name))return exteriorTextureCache.get(name);const map=textureLoader.load(`assets/textures/exterior-${name}.webp`,()=>loadedExteriorTextures.add(name),undefined,()=>console.warn(`Décor extérieur indisponible: ${name}`));map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());exteriorTextureCache.set(name,map);return map}
function addExterior(win){const horizontal=win.s[0]>win.s[2],width=horizontal?win.s[0]:win.s[2],position=[...win.p];if(horizontal)position[2]+=Math.sign(win.p[2])*.001;else position[0]+=Math.sign(win.p[0])*.001;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,win.s[1]),new THREE.MeshBasicMaterial({map:exteriorTexture(win.exterior),side:THREE.DoubleSide,toneMapped:false}));mesh.name=`${win.id}_exterior`;mesh.position.set(...position);mesh.rotation.y=horizontal?0:Math.PI/2;scene.add(mesh);rendered.push(mesh)}
function addCeilingLight(spec){const mount=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.07,24),new THREE.MeshStandardMaterial({color:0xd8c7ad,roughness:.42,metalness:.16}));mount.name=`${spec.id}_mount`;mount.position.set(spec.p[0],2.94,spec.p[2]);scene.add(mount);rendered.push(mount);const diffuser=new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:spec.color,emissive:spec.color,emissiveIntensity:1.8,roughness:.2}));diffuser.name=`${spec.id}_diffuser`;diffuser.rotation.x=Math.PI;diffuser.position.set(...spec.p);scene.add(diffuser);rendered.push(diffuser);const light=new THREE.PointLight(spec.color,spec.intensity,spec.distance,2);light.name=spec.id;light.position.set(spec.p[0],spec.p[1]-.08,spec.p[2]);scene.add(light)}

cube(MELI_SUBFLOOR.id,MELI_SUBFLOOR.p,MELI_SUBFLOOR.s,MELI_SUBFLOOR.color,false,'paint',scene,[0,0,0],'terrazzo');
MELI_ROOM_ZONES.forEach(room=>cube(`floor_${room.id}`,room.p,room.s,room.c,false,'paint',scene,[0,0,0],room.texture));
MELI_CEILINGS.forEach(item=>{const ceiling=cube(item.id,item.p,item.s,0xf7f1e8,false,'paint',scene,[0,0,0],'plaster');ceiling.material=new THREE.MeshBasicMaterial({color:0xf2ede3,map:texture('plaster',0xf7f1e8)})});
MELI_CEILING_LIGHTS.forEach(addCeilingLight);
MELI_ACCENT_WALLS.forEach(item=>cube(item.id,item.p,item.s,item.color,false,'paint',scene,[0,0,0],'plaster'));
MELI_ARCHITECTURE.walls.forEach(wall=>{const joinedPosition=[wall.p[0],1.52,wall.p[2]],joinedSize=[wall.s[0],3.08,wall.s[2]];cube(wall.id,joinedPosition,joinedSize,0xf3eee6,true,'paint',scene,[0,0,0],wall.finish);const trimSize=[wall.s[0]+.04,.13,wall.s[2]+.04];cube(`${wall.id}_baseboard`,[wall.p[0],.075,wall.p[2]],trimSize,0xcabca9,false,'paint',scene,[0,0,0],'wood')});
MELI_ARCHITECTURE.openings.forEach(opening=>{const [x,z]=opening.center,alongZ=opening.axis==='x',isPassage=opening.id==='opening_living_kitchen',wallSize=alongZ?[.2,.81,opening.width+.04]:[opening.width+.04,.81,.2],trimSize=alongZ?[.21,.08,opening.width+.02]:[opening.width+.02,.08,.21],thresholdSize=alongZ?[.24,.02,opening.width+.02]:[opening.width+.02,.02,.24];cube(`${opening.id}_threshold`,[x,.03,z],thresholdSize,isPassage?0xd8cdbb:0xb99368,false,'paint',scene,[0,0,0],isPassage?'terrazzo':'wood');if(isPassage)return;cube(`${opening.id}_overdoor`,[x,2.555,z],wallSize,0xf3eee6,false,'paint',scene,[0,0,0],'plaster');cube(`${opening.id}_head`,[x,2.145,z],trimSize,0xb78457,false,'paint',scene,[0,0,0],'wood');const off=opening.width/2;for(const side of[-1,1])cube(`${opening.id}_jamb_${side}`,alongZ?[x,1.08,z+side*off]:[x+side*off,1.08,z],alongZ?[.21,2.16,.075]:[.075,2.16,.21],0xb78457,false,'paint',scene,[0,0,0],'wood')});
MELI_ARCHITECTURE.doors.forEach(door=>cube(door.id,door.p,door.s,door.c,false,'paint',scene,door.r,'wood'));
MELI_ARCHITECTURE.windows.forEach(win=>{addExterior(win);cube(`${win.id}_glass`,win.p,win.s,0x9ad5e6,false,'glass',scene,win.r);const horizontal=win.s[0]>win.s[2],wide=horizontal?win.s[0]:win.s[2],axis=horizontal?'x':'z';for(const side of[-1,1]){const p=[...win.p];p[axis==='x'?0:2]+=side*wide/2;cube(`${win.id}_side_${side}`,p,axis==='x'?[.08,win.s[1]+.12,.1]:[.1,win.s[1]+.12,.08],0xe7e0d5,false,'paint',scene,[0,0,0],'wood')}cube(`${win.id}_top`,[win.p[0],win.p[1]+win.s[1]/2,win.p[2]],axis==='x'?[wide,.08,.1]:[.1,.08,wide],0xe7e0d5,false,'paint',scene,[0,0,0],'wood');cube(`${win.id}_bottom`,[win.p[0],win.p[1]-win.s[1]/2,win.p[2]],axis==='x'?[wide,.08,.1]:[.1,.08,wide],0xe7e0d5,false,'paint',scene,[0,0,0],'wood')});

const surfaceFor={bed:'wood',sofa:'fabric',rug:'rug',wardrobe:'wood',desk:'wood',table:'wood',bookcase:'wood',cabinet:'wood',towel:'fabric',backsplash:'tile'};
const facingRotation={south:0,east:Math.PI/2,north:Math.PI,west:-Math.PI/2};
function partSurface(f,name,kind){if(f.kind==='bed'){if(name==='blanket'||name.startsWith('weave'))return'bedlinen';if(name==='mattress')return'paint';return'wood'}return surfaceFor[f.kind]||kind}
function skinFurniture(f){const skin=MELI_SKIN[f.kind]||MELI_SKIN.default,group=new THREE.Group();group.name=f.id;group.position.set(...f.p);if(f.r)group.rotation.set(...f.r);else group.rotation.y=facingRotation[f.facing]??0;group.userData.facing=f.facing||'south';scene.add(group);const baseKind=['mirror','shower'].includes(f.kind)?'glass':['pillow','sofa','curtain','towel'].includes(f.kind)?'soft':'paint';const collision=cube(`${f.id}_collision`,[0,0,0],f.s,skin.base??f.c,false,baseKind,group,[0,0,0],surfaceFor[f.kind]||'paint');collision.userData.furniture=f.id;collision.userData.collisionOnly=true;collision.visible=false;if(f.kind==='bed'){collision.scale.y=.3;collision.position.y=-.22}if(f.solid)solids.push(collision);loadMeliModel(THREE,f.kind).then(model=>{model.scale.set(...f.s);group.add(model);group.userData.gltfLoaded=true}).catch(error=>{console.error('Chargement modèle',f.kind,error);(MELI_SKIN_PARTS[f.kind]||[]).forEach(([name,rp,rs,key])=>cube(`${f.id}_${name}`,[rp[0]*f.s[0],rp[1]*f.s[1],rp[2]*f.s[2]],[Math.max(.025,rs[0]*f.s[0]),Math.max(.025,rs[1]*f.s[1]),Math.max(.025,rs[2]*f.s[2])],skin[key]??skin.accent??f.c,false,baseKind,group))});return group}
MELI_FURNITURE.forEach(skinFurniture);
const equipmentScene=buildEquipment(THREE,scene,MeliEquipment.equipment);
// Les preuves documentaires existent aussi dans le logement : elles matérialisent
// les pièces que l'apprenant devra reconnaître puis citer dans son signalement.
const storyArtifactSpecs=[
 {kind:'certificate_gas',label:'Certificat de conformité gaz',p:[-1.85,1.68,6.52],yaw:Math.PI,s:[.62,.78,.12]},
 {kind:'consuel',label:'Attestation de conformité électrique',p:[-1.05,1.68,6.52],yaw:Math.PI,s:[.62,.78,.12]},
 {kind:'incident_report',label:'Fiche d’incident logement',p:[-.25,1.68,6.52],yaw:Math.PI,s:[.62,.78,.12]}
];
const storyArtifacts=[];storyArtifactSpecs.forEach(spec=>{const root=new THREE.Group();root.name=`story_${spec.kind}`;root.position.set(...spec.p);root.rotation.y=spec.yaw;root.userData={storyArtifact:true,label:spec.label};scene.add(root);loadMeliModel(THREE,spec.kind).then(model=>{model.scale.set(...spec.s);root.add(model);root.userData.gltfLoaded=true});storyArtifacts.push(root)});
// Hide only the camera-facing shell; the complete collision layout stays intact.
scene.traverse(object=>{
  if(!object.isMesh)return;
  const name=object.name;
  const frontShell=/^(outer_south|outer_east|accent_bathroom_east|accent_kitchen_east|window_kitchen)/.test(name);
  const ceiling=/^(ceiling_|light_)/.test(name);
  const lowPartition=/^(bedroom_south|wet_south|living_kitchen|bed_hall|wet_hall)/.test(name);
  if(frontShell||ceiling||lowPartition){object.userData.interiorVisible=object.visible;cutawayObjects.push(object)}
});
cube('apartment_plinth',[0,-.16,0],[13.85,.3,13.85],0x789c35,false);
setOverview(true);


const collisions=new MeliCollisionSystem(THREE,{radius:.25});solids.forEach(object=>collisions.add(object,{id:object.name,padding:.02}));
const interactions=new MeliInteractionSystem(THREE,scene,camera,{distance:2.5,occluders:solids,debug:qs.get('debugHitboxes')==='1'}),topicColors={reseaux:0xb58bea,humidite:0x67c9ae,gaz:0xef4444,electricite:0xf59e0b,eau:0x3b82f6,chauffage:0xeab308,ventilation:0x22c55e},questionObjects=[];
const markerLinks=new Map(),equipmentSlots=new Map();
level.questions.forEach(q=>{
 const target=equipmentScene.point(q.equipmentId),slot=equipmentSlots.get(q.equipmentId)||0;equipmentSlots.set(q.equipmentId,slot+1);
 const marker=target.clone().add(new THREE.Vector3((slot%2?.2:-.2),.32+Math.floor(slot/2)*.2,0));
 const object=new THREE.Mesh(new THREE.IcosahedronGeometry(.12,2),new THREE.MeshStandardMaterial({color:topicColors[q.topic],emissive:topicColors[q.topic],emissiveIntensity:1.4,roughness:.25}));
 object.position.copy(marker);object.name='indice_'+q.id;object.userData={topic:q.topic,equipmentId:q.equipmentId,questionId:q.id};scene.add(object);questionObjects.push(object);
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([target,marker]),new THREE.LineBasicMaterial({color:topicColors[q.topic],transparent:true,opacity:.8}));line.name='liaison_'+q.id;scene.add(line);markerLinks.set(q.id,line);
 q.anchor=marker.toArray();interactions.add(object,{id:object.name,type:'question',targetObject:equipmentScene.roots.get(q.equipmentId),label:q.equipmentLabel,padding:.2,data:{question:q,equipmentId:q.equipmentId}});
});
const faultVisuals=[];
function addFaultVisual(question,index){if(!question.fault)return;const anchor=MELI_CLUE_ANCHORS[question.clue]||[0,1,0],group=new THREE.Group();group.name=`fault_${question.fault.id}`;group.position.set(anchor[0],Math.max(.05,anchor[1]-.2),anchor[2]);group.userData.fault=question.fault;const color=question.fault.color;
  if(question.fault.visual==='water'){const puddle=new THREE.Mesh(new THREE.CircleGeometry(.34,28),new THREE.MeshStandardMaterial({color,transparent:true,opacity:.58,roughness:.18,metalness:.08}));puddle.rotation.x=-Math.PI/2;group.add(puddle);for(let i=0;i<3;i++){const drop=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),new THREE.MeshBasicMaterial({color}));drop.position.set((i-1)*.08,.18+i*.09,0);group.add(drop)}}
  else{const haze=new THREE.Mesh(new THREE.SphereGeometry(.24,18,12),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:question.fault.visual==='spark'?2.2:.65,transparent:true,opacity:.34,roughness:.2}));group.add(haze);for(let i=0;i<4;i++){const particle=new THREE.Mesh(new THREE.IcosahedronGeometry(.025+i*.006,1),new THREE.MeshBasicMaterial({color}));particle.position.set(Math.sin(i*2.1)*.18,i*.1,Math.cos(i*1.7)*.14);group.add(particle)}}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.3,.018,8,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));ring.rotation.x=Math.PI/2;ring.position.y=.03;group.add(ring);scene.add(group);const faultKind={gaz:'fault_gaz',electricite:'fault_electricite',eau:'fault_eau',chauffage:'fault_chauffage',ventilation:'fault_ventilation',humidite:'fault_ventilation'}[question.fault.topic]||'fault_ventilation';loadMeliModel(THREE,faultKind).then(model=>{model.scale.setScalar(.72);model.position.y=.18;group.add(model);group.userData.detailedFault=true});faultVisuals.push(group)}
if(level.id===3)level.questions.forEach(addFaultVisual);

let done=new Set(Object.keys(campaignProgress.answers[level.id]||{}).map(Number)),mistakes=0,streakErrors=0,started=false,paused=false,modalOpen=false,active,activeAction='',time=level.minutes*60,questionStart=0,lastPlan=null,selected=new Set(),reportSubmitted=false;
const keys={};
const roomNames={entree:'Entrée',cuisine:'Cuisine',sdb:'Salle d’eau',salon:'Séjour',chambre:'Chambre',wc:'WC'};
function update(){
 $('prog').textContent=`${done.size} / ${level.total}`;
 $('score').textContent=level.id===1?'Positionnement non noté':level.id===3?'Évaluation autonome':'Observer · Analyser · Agir';
 $('safety').textContent='Repérer et signaler · Sans intervention technique';
 $('missionBrief').innerHTML=level.id===2?level.missions.map(m=>{
  const questions=level.questions.filter(q=>q.mission===m.id),count=questions.filter(q=>done.has(q.id)).length;
  return `<button class="mission-pill ${count===questions.length?'done':''} ${activeMission===m.id?'selected':''}" data-switch="${m.id}" style="--mission:${m.color}"><span>${m.label}</span><b>${count}/${questions.length}</b></button>`;
 }).join(''):`<div class="tutorial-tip">${level.id===1?'Prise en main · Fiche commune · 5 questions non notées':'B-307 · Repérez les situations et renseignez la fiche en autonomie.'}</div>`;
 document.querySelectorAll('[data-switch]').forEach(b=>b.onclick=()=>chooseMission(b.dataset.switch));
 questionObjects.forEach(object=>{const q=level.questions.find(q=>object.name===`indice_${q.id}`),visible=!done.has(q.id)&&(level.id!==2||q.mission===activeMission);object.visible=visible;interactions.setEnabled(object.name,visible);markerLinks.get(q.id).visible=visible;});
}
function adapt(){
 lastPlan=null;
 $('directorState').textContent=level.id===3?'Aucun feedback pendant la mission. Bilan après transmission.':level.id===1?'Observez, découvrez la fiche et faites le point sans note.':MeliCampaign.MISSIONS[activeMission].description;
}
function markDone(q,response){
 done.add(q.id);campaignProgress.answers[level.id]??={};campaignProgress.answers[level.id][q.id]=response;persistStory();objectives.complete(q.id);update();
 MeliCasesStoryline.caseSolved(q.id,done.size,level.total,{level:level.id,topic:q.topic,completed:false,passed:false});
}
function openQuestion(q){
 if(!stageAvailable()||!q||done.has(q.id)||level.id===2&&q.mission!==activeMission)return;
 active=q;activeAction='';selected.clear();questionStart=performance.now();modalOpen=true;document.body.classList.add('modal-open');sound.cue('inspect');pointer.unlock();$('modal').classList.add('open');renderQuestion();
}
function renderQuestion(){
 if(level.id===3){
  $('dialog').innerHTML=`<div class="kicker">B-307 · ${roomNames[active.room]}</div><h2>${active.equipmentLabel}</h2><p class="observation">${active.observation}</p><p>Conservez les faits utiles pour compléter votre fiche. Le bilan sera présenté après sa transmission.</p><button class="primary" id="recordObservation">CONSIGNER L’OBSERVATION</button>`;
  $('recordObservation').onclick=()=>{markDone(active,{observation:active.observation});closeQuestion();};return;
 }
 const multi=active.correct.length>1;
 $('dialog').innerHTML=`<div class="case-meta"><span>${level.id===1?'Positionnement non noté':MeliCampaign.MISSIONS[active.mission].label}</span><span>${roomNames[active.room]}</span><span>${multi?'Plusieurs réponses':'Une réponse'}</span></div><div class="kicker">${active.sequence}</div><p class="equipment-context">Équipement observé : <strong>${active.equipmentLabel}</strong></p><h2>Observer → Analyser → Agir</h2><p class="observation">${active.observation}</p>${level.id===2?`<details class="short-explanation"><summary>Comprendre l’équipement et son rôle</summary><p>${active.explanation}</p>${learningDiagram(active)}</details>`:''}<h3>${active.question}</h3><div class="answers">${active.choices.map((choice,i)=>`<button class="answer ${selected.has(i)?'selected':''}" data-i="${i}" aria-pressed="${selected.has(i)}"><i>${selected.has(i)?'✓':''}</i>${choice}</button>`).join('')}</div><button class="primary" id="validateAnswer" ${selected.size?'':'disabled'}>VALIDER MA RÉPONSE</button><div id="fb" aria-live="polite"></div>`;
 document.querySelectorAll('[data-i]').forEach(button=>button.onclick=()=>{const index=+button.dataset.i;if(!multi)selected.clear();selected.has(index)?selected.delete(index):selected.add(index);renderQuestion();});$('validateAnswer').onclick=answer;MeliMotion.wire($('dialog'));
}
function learningDiagram(q){return MeliMotion.render(q);}
function answer(){
 const choice=[...selected],ok=choice.length===active.correct.length&&choice.every(i=>active.correct.includes(i));tutorialAction(4);
 document.querySelectorAll('.answer,#validateAnswer').forEach(b=>b.disabled=true);
 if(level.id===1){
  markDone(active,{choice,correct:ok});
  $('fb').className='feedback';$('fb').innerHTML=`<h3>${ok?'Vous avez identifié l’information utile.':'Un repère à retenir'}</h3><p>${active.information}.</p><p>${active.explanation}</p><p>Ce positionnement est non noté et ne bloque aucune mission.</p><button id="back">CONTINUER LE BRIEFING</button>`;$('back').onclick=closeQuestion;return;
 }
 sound.cue(ok?'correct':'error');
 if(!ok){mistakes++;$('fb').className='feedback bad';$('fb').innerHTML=`<h3>Analysons la situation</h3><p>${active.explanation}</p><p>Retenez les faits localisés et leur contexte. Une observation seule ne permet pas de garantir une cause ou la conformité.</p><button id="retry">RÉESSAYER</button>`;$('retry').onclick=()=>{selected.clear();renderQuestion();};return;}
 $('fb').className='feedback ok';$('fb').innerHTML=`<h3>Informations pertinentes</h3><p>${active.explanation}</p><button id="practiceReport">S’ENTRAÎNER À LA FICHE</button>`;$('practiceReport').onclick=()=>openReport(false,active);
}
function selectOptions(values,correctValue){
 const options=values.map((text,i)=>({text,value:i===0?correctValue:'other-'+i}));if(values[0].length%2)options.reverse();return '<option value="">Sélectionner…</option>'+options.map(o=>`<option value="${o.value}">${escapeText(o.text)}</option>`).join('');
}
function reportFields(q){
 return `<fieldset class="report-case"><legend>${roomNames[q.room]} · ${q.equipmentLabel}</legend><label>Constat factuel<select name="${q.id}-fact" required>${selectOptions([q.observation,'La cause technique est certaine sans vérification complémentaire'],'fact')}</select></label><label>Informations utiles à transmettre<select name="${q.id}-information" required>${selectOptions([q.information,'Une conclusion sans date, localisation ni circonstances'],'information')}</select></label><label>Suite à donner<select name="${q.id}-action" required>${selectOptions([q.action,'Démonter ou réparer l’installation soi-même','Clore la demande sans consigner les observations'],'action')}</select></label><label>Précisions complémentaires (facultatif)<textarea name="${q.id}-notes" placeholder="Faits observés ou propos rapportés, sans supposer une cause."></textarea></label></fieldset>`;
}
let reportQuestion=null;
function openReport(final=false,q=null){
 pointer.unlock();modalOpen=true;document.body.classList.add('modal-open');$('modal').classList.remove('open');reportQuestion=q;
 const preview=!q&&!final;const context=active&&(level.id!==2||active.mission===activeMission)?active:level.questions.find(item=>level.id===1||item.mission===activeMission);const list=final?level.questions:q?[q]:[context];
 $('incidentForm').innerHTML=`<div class="kicker">${level.id===1?'Découvrir le support commun':final?'B-307 · Mission finale autonome':'A-204 · Entraînement accompagné'}</div><h1>FICHE DE SIGNALEMENT TECHNIQUE</h1><p>${level.id===1?'Le même support sera utilisé pendant les missions, puis en entier dans la finale.':final?'Sélectionnez les faits, informations et suites à donner pour les situations observées. Aucune correction avant transmission.':'Exercez-vous sur cette situation. Vous recevrez un feedback pour corriger vos choix.'}</p>${list.map(reportFields).join('')}<div id="incidentErrors" class="form-errors" aria-live="polite"></div>${preview?'':`<button class="primary" type="submit">${final?'TRANSMETTRE LA FICHE':'VÉRIFIER LA FICHE'}</button>`}<button type="button" class="secondary" id="closeReport">${level.id===1?'J’AI COMPRIS LE RÔLE DE LA FICHE':'REVENIR AU LOGEMENT'}</button>`;
 const draft=campaignProgress.draft[level.id]||{};for(const [name,value]of Object.entries(draft)){const field=$('incidentForm').elements.namedItem(name);if(field)field.value=value;}
 $('incident').classList.add('open');
 $('closeReport').onclick=()=>{$('incident').classList.remove('open');modalOpen=false;document.body.classList.remove('modal-open');if(level.id===1&&tutorialStep===5){tutorialStep++;renderTutorial();}else if(q&&done.has(q.id))closeQuestion();else lockPointer();};
 $('incidentForm').oninput=()=>{campaignProgress.draft[level.id]={...campaignProgress.draft[level.id],...Object.fromEntries(new FormData($('incidentForm')))};persistStory();};
 $('incidentForm').onsubmit=event=>{
  event.preventDefault();if(final&&done.size<level.total){$('incidentErrors').textContent='Explorez les cinq situations avant de transmettre votre fiche.';return;}
  const data=new FormData($('incidentForm'));const rows=list.map(item=>({id:item.id,fact:data.get(item.id+'-fact')==='fact',information:data.get(item.id+'-information')==='information',action:data.get(item.id+'-action')==='action',notes:data.get(item.id+'-notes')||''}));
  const score=Math.round(rows.reduce((sum,r)=>sum+Number(r.fact)+Number(r.information)+Number(r.action),0)/(rows.length*3)*100);
  if(!final&&score<100){$('incidentErrors').textContent=`À revoir : ${q.explanation} Décrivez les faits et recueillez leur contexte ; la suite reste dans votre rôle de signalement.`;return;}
  if(final){campaignProgress.finalReport={rows,score};reportSubmitted=true;$('incident').classList.remove('open');modalOpen=false;document.body.classList.remove('modal-open');finishLevel();}
  else{markDone(q,{rows,score});$('incidentErrors').innerHTML='<p>Votre fiche distingue les faits, les informations utiles et la suite à donner.</p><button type="button" id="continueAfterReport">CONSIGNER ET CONTINUER</button>';$('incidentForm').querySelector('[type="submit"]').disabled=true;$('continueAfterReport').onclick=()=>{$('incident').classList.remove('open');closeQuestion();};}
 };
}
function finishLevel(){
 pointer.unlock();
 if(level.id===3&&!reportSubmitted){openReport(true);return;}
 let next=level.id+1,title='BRIEFING TERMINÉ',text='Vous avez découvert le logement et la fiche. Choisissez maintenant votre première mission.';
 if(level.id===1)campaignProgress.completed[1]=true;
 if(level.id===2){
  const completedMissions=level.missions.filter(m=>level.questions.filter(q=>q.mission===m.id).every(q=>done.has(q.id)));
  completedMissions.forEach(m=>campaignProgress.completed[m.id]=true);
  const all=completedMissions.length===3;campaignProgress.completed[2]=all;
  title=all?'LES TROIS MISSIONS SONT TERMINÉES':`MISSION ${MeliCampaign.MISSIONS[activeMission].label.toUpperCase()} TERMINÉE`;
  text=all?'Vous avez entraîné votre regard et votre signalement. Un nouveau logement vous attend pour la mission finale.':'Votre fiche est consignée. Choisissez une autre mission, dans l’ordre qui vous convient.';next=all?3:2;
 }
 if(level.id===3){
  const assessment=campaignProgress.finalReport;campaignProgress.completed[3]=true;title='VOTRE BILAN';text=`${assessment.score}% des critères de la fiche sont renseignés de manière pertinente. Consultez les explications ci-dessous.`;
  MeliCasesStoryline.completed(seed,{score:assessment.score,passed:assessment.score===100,solved:level.total,total:level.total,level:3});
 }else MeliCasesStoryline.progress({solved:Object.keys(campaignProgress.completed).filter(k=>['1','securite','eau','climat'].includes(k)).length,total:5,completed:false,passed:false});
 persistStory();$('completionTitle').textContent=title;$('completionText').textContent=text;
 $('nextLevel').hidden=level.id===3;$('nextLevel').textContent=next===2?'CHOISIR UNE MISSION':'DÉCOUVRIR LE NOUVEAU LOGEMENT';
 $('nextLevel').onclick=()=>{if(level.id===2&&next===2){$('completion').classList.remove('open');activeMission=Object.keys(MeliCampaign.MISSIONS).find(id=>!campaignProgress.completed[id])||activeMission;renderMissionChoices();update();adapt();$('start').classList.add('open');}else navigateStage(next);};
 document.getElementById('finalReview')?.remove();
 if(level.id===3){const review=document.createElement('div');review.id='finalReview';review.className='final-review';review.innerHTML=campaignProgress.finalReport.rows.map(r=>{const q=level.questions.find(q=>q.id===r.id);return `<section><h3>${roomNames[q.room]} · ${q.sequence.split(' : ')[0]}</h3><p>${r.fact?'✓ Constat factuel retenu.':'À retenir : '+q.observation}</p><p>${r.information?'✓ Informations pertinentes.':'Informations utiles : '+q.information}</p><p>${r.action?'✓ Suite adaptée.':'Suite attendue : '+q.action}</p>${r.notes?`<p>Vos notes : ${escapeText(r.notes)}</p>`:''}<p>${q.explanation}</p></section>`;}).join('')+'<details><summary>Pour aller plus loin · Ressources facultatives</summary><p>Mémo : localiser le logement et l’équipement, relever les faits et leur contexte, distinguer faits et hypothèses, puis transmettre selon la procédure métier.</p><p>Les documents et procédures de référence Foncia seront ajoutés après validation.</p></details>';$('completionText').after(review);}
 $('completion').classList.add('open');
}
function closeQuestion(){
 $('modal').classList.remove('open');modalOpen=false;document.body.classList.remove('modal-open');
 const missionComplete=level.id===2&&level.questions.filter(q=>q.mission===activeMission).every(q=>done.has(q.id));
 if(done.size===level.total||missionComplete)finishLevel();else lockPointer();
}

function showOptions(){pointer.unlock();$('options').classList.add('open')}function hideOptions(){$('options').classList.remove('open');if(started&&!paused)lockPointer()}
$('soundToggle').ariaPressed=String(sound.enabled);$('soundToggle').textContent=`SON D’AMBIANCE · ${sound.enabled?'ACTIF':'COUPÉ'}`;
$('soundToggle').onclick=()=>{const enabled=sound.toggle();$('soundToggle').ariaPressed=String(enabled);$('soundToggle').textContent=`SON D’AMBIANCE · ${enabled?'ACTIF':'COUPÉ'}`};
$('replayLevel').onclick=()=>{delete campaignProgress.answers[level.id];delete campaignProgress.draft[level.id];if(level.id===3)delete campaignProgress.finalReport;persistStory();location.reload();};
$('startOptions').onclick=showOptions;$('pauseOptions').onclick=showOptions;$('closeOptions').onclick=hideOptions;$('restart').onclick=()=>location.reload();document.querySelectorAll('[data-quality]').forEach(button=>button.onclick=()=>{const quality=button.dataset.quality;localStorage.setItem('meli.quality',quality);renderer.setPixelRatio(quality==='eco'?1:quality==='high'?Math.min(devicePixelRatio,2):Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=quality!=='eco';rendered.forEach(object=>{object.castShadow=quality==='high';object.receiveShadow=quality!=='eco'})});
$('reportButton').onclick=()=>openReport(level.id===3);
$('play').onclick=()=>{if(!stageAvailable())return;$('start').classList.remove('open');started=true;document.body.classList.add('playing');setOverview(false);sound.unlock();sound.cue('start');adapt();update();if(level.id===1)startTutorial();MeliCasesStoryline.ready(seed,{difficulty,level:level.id,levelLabel:level.label,randomized:level.randomized})};$('resumePause').onclick=()=>{paused=false;$('pause').classList.remove('open');lockPointer()};
function interactFocused(){if(!started||paused||modalOpen||overview)return false;const item=interactions.itemFrom(interactions.focus());if(item?.type!=='question')return false;tutorialAction(3);openQuestion(item.data.question);return true}
$('interactButton').onclick=interactFocused;
canvas.addEventListener('pointerdown',event=>{
 if(!overview||!started||paused||modalOpen)return;
 const rect=canvas.getBoundingClientRect(),point=new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();
 ray.setFromCamera(point,overviewCamera);const hit=ray.intersectObjects(interactions.items.filter(item=>item.hit.userData.enabled).map(item=>item.hit))[0];
 if(hit)openQuestion(interactions.itemFrom(hit)?.data.question);
});
addEventListener('keydown',event=>{if(event.code==='KeyV'&&started&&!paused&&!modalOpen){setOverview(!overview);return}if(event.code===controls.pause&&started&&!modalOpen){paused=!paused;$('pause').classList.toggle('open',paused);paused?pointer.unlock():lockPointer();return}if(paused||modalOpen)return;keys[event.code]=true;if(event.code===controls.interact)interactFocused()});addEventListener('keyup',event=>keys[event.code]=false);

function currentRoom(){const p=camera.position;return MELI_ROOM_ZONES.filter(r=>Math.abs(p.x-r.p[0])<=r.s[0]/2&&Math.abs(p.z-r.p[2])<=r.s[2]/2).sort((a,b)=>a.s[0]*a.s[2]-b.s[0]*b.s[2])[0]?.id||'circulation'}
function insideApartment(x,z){return Math.abs(x)<=6.42&&Math.abs(z)<=6.42}
function safeMove(dx,dz){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06)),sx=dx/steps,sz=dz/steps;let moved=false;for(let i=0;i<steps;i++){const oldX=camera.position.x,nx=oldX+sx;if(insideApartment(nx,camera.position.z)){camera.position.x=nx;if(collisions.blocked(camera.position))camera.position.x=oldX;else moved=true}const oldZ=camera.position.z,nz=oldZ+sz;if(insideApartment(camera.position.x,nz)){camera.position.z=nz;if(collisions.blocked(camera.position))camera.position.z=oldZ;else moved=true}}camera.position.y=1.65;return moved}
function walkFallback(distance){const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();return safeMove(forward.x*distance,forward.z*distance)}
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const clock=new THREE.Clock(),direction=new THREE.Vector3();let tick=0,lastRoom='';
window.__MELI_TEST__={openCase(id){openQuestion(level.questions.find(q=>q.id===id));},screenPoint(id,element='marker'){const object=questionObjects.find(o=>o.userData.questionId===id);if(!object)return null;const v=(element==='equipment'?equipmentScene.roots.get(object.userData.equipmentId).getWorldPosition(new THREE.Vector3()):object.position.clone()).project(overview?overviewCamera:camera),r=canvas.getBoundingClientRect();return{x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};},get equipmentBindings(){return level.questions.map(q=>({id:q.id,room:q.room,equipmentId:q.equipmentId,label:q.equipmentLabel,target:equipmentScene.point(q.equipmentId).toArray(),marker:questionObjects.find(o=>o.name==='indice_'+q.id).position.toArray(),visible:questionObjects.find(o=>o.name==='indice_'+q.id).visible,linked:markerLinks.get(q.id).visible}));},get observed(){return [...done]},get storyProgress(){return campaignProgress},chooseMission,nativeKeyboardMovement:true,get overview(){return overview},setOverview,seed,campaign:level,state:simState,mastery,objectives,director,controls,sound,get physicalFaults(){return faultVisuals.length},openFirstFault(){if(level.id===3)openQuestion(level.questions[0])},openIncidentReport(){if(level.id===3&&stageAvailable())openReport(true)},get directorPlan(){return lastPlan},get hitboxes(){return interactions.items.length},get visibleHitboxes(){return interactions.items.filter(i=>i.hit.visible&&i.hit.material.opacity>0).length},get colliders(){return collisions.count},get furniture(){return MELI_FURNITURE.length},get renderedObjects(){return rendered.length},get loadedImageTextures(){return loadedImageTextures.size},get loadedExteriorTextures(){return loadedExteriorTextures.size},get architecture(){return{walls:MELI_ARCHITECTURE.walls.length,doors:MELI_ARCHITECTURE.doors.length,windows:MELI_ARCHITECTURE.windows.length,openings:MELI_ARCHITECTURE.openings.length,ceilings:MELI_CEILINGS.length,ceilingMaterial:scene.getObjectByName('ceiling_continuous')?.material.type,subfloor:scene.getObjectByName(MELI_SUBFLOOR.id)?1:0,ceilingLights:MELI_CEILING_LIGHTS.length,exteriorScenes:exteriorTextureCache.size,textures:textureCache.size,imageTextures:Object.keys(imageTexturePaths).length}},sceneHas(id){return!!scene.getObjectByName(id)},furnitureRotation(id){return scene.getObjectByName(id)?.rotation.y??null},get optionsVisible(){return $('options').classList.contains('open')},get position(){return{x:camera.position.x,y:camera.position.y,z:camera.position.z}},teleport(x,z){if(!insideApartment(x,z)||collisions.blocked(new THREE.Vector3(x,1.65,z)))return false;camera.position.set(x,1.65,z);return true},walkFallback,moveBy:safeMove,lookAt(x,z){camera.lookAt(new THREE.Vector3(x,1.35,z))},blockedAt(x,z){return!insideApartment(x,z)||collisions.blocked(new THREE.Vector3(x,1.65,z))},collisionProbe(){const f=MELI_FURNITURE.find(x=>x.solid);return{blocked:collisions.blocked(new THREE.Vector3(f.p[0],1.65,f.p[2])),colliders:collisions.count}}};
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);if(started&&!overview&&!paused&&!modalOpen){const goRight=keys[controls.right]||keys.ArrowRight,goLeft=keys[controls.left]||keys.ArrowLeft,goForward=keys[controls.forward]||keys.KeyZ||keys.ArrowUp,goBack=keys[controls.back]||keys.ArrowDown;direction.set(Number(!!goRight)-Number(!!goLeft),0,Number(!!goForward)-Number(!!goBack)).normalize();const speed=keys[controls.run]?5.2:3.1;if(direction.x||direction.z){const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3(-forward.z,0,forward.x),moved=safeMove((right.x*direction.x+forward.x*direction.z)*speed*dt,(right.z*direction.x+forward.z*direction.z)*speed*dt);if(moved)tutorialAction(1)}const item=interactions.itemFrom(interactions.focus());$('interactButton').classList.toggle('available',!!item);$('hint').textContent=item?`[ E ] ${item.label.toUpperCase()}`:'W/Z avancer · E interagir · Échap pause';const room=currentRoom();if(room!==lastRoom){lastRoom=room;sound.setRoom(room);$('roomName').textContent=room.charAt(0).toUpperCase()+room.slice(1)}}const w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==w||canvas.height!==h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}questionObjects.forEach((object,i)=>{if(object.visible&&!motionPreference.matches&&!modalOpen&&!paused)object.rotation.y+=dt*(.7+i%3*.12)});faultVisuals.forEach((group,i)=>{group.rotation.y+=dt*(.25+i%2*.08);group.children.forEach((part,n)=>{if(n&&part.position.y>0)part.position.y+=Math.sin(performance.now()*.003+n)*dt*.025})});const aspect=w/Math.max(1,h),extent=Math.max(11.5,11.5/aspect);overviewCamera.left=-extent*aspect;overviewCamera.right=extent*aspect;overviewCamera.top=extent;overviewCamera.bottom=-extent;overviewCamera.updateProjectionMatrix();renderer.render(scene,overview?overviewCamera:camera)}
MeliCasesStoryline.ready(seed,{difficulty,level:level.id,levelLabel:level.label,randomized:level.randomized});update();loop();

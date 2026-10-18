import {loadMeliModel} from './gltf-model-loader.js';
// Modèles techniques glTF attachés au même registre que les situations.
export function buildEquipment(THREE,scene,registry){
 const roots=new Map();
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.15});
 const materials={white:mat(0xe8eff0),dark:mat(0x293b48),blue:mat(0x4aace0),metal:mat(0x99a9b0),amber:mat(0xe4b66d)};
 function box(root,name,p,s,color='white'){const m=new THREE.Mesh(new THREE.BoxGeometry(...s),materials[color]);m.name=root.name+'_'+name;m.position.set(...p);root.add(m);return m;}
 for(const [id,spec] of Object.entries(registry)){
  let root=spec.object?scene.getObjectByName(spec.object):null;
  if(spec.object&&!root)throw new Error('Modèle absent : '+spec.object);
  if(!root){root=new THREE.Group();root.name='equipment_'+id;root.position.set(...spec.p);root.rotation.y=spec.yaw||0;scene.add(root);
   switch(spec.kind){
    case 'boiler':box(root,'housing',[0,0,0],[.58,.85,.22]);box(root,'display',[0,-.15,.125],[.3,.14,.025],'dark');for(const x of[-.18,0,.18])box(root,'pipe_'+x,[x,-.62,0],[.035,.45,.035],'metal');break;
    case 'stove':box(root,'hob',[0,0,0],[.72,.08,.5],'dark');for(const x of[-.2,.2])for(const z of[-.13,.13])box(root,'burner_'+x+'_'+z,[x,.05,z],[.16,.035,.14],'metal');box(root,'connection',[.35,-.12,.16],[.045,.25,.045],'amber');break;
    case 'panel':box(root,'housing',[0,0,0],[.58,.52,.12]);box(root,'opening',[0,0,.075],[.44,.34,.025],'dark');for(let i=0;i<5;i++)box(root,'switch_'+i,[-.17+i*.085,0,.1],[.05,.16,.035]);break;
    case 'socket':box(root,'frame',[0,0,0],[.18,.18,.045]);for(const x of[-.035,.035])box(root,'contact_'+x,[x,0,.03],[.022,.04,.02],'dark');break;
    case 'plan':box(root,'paper',[0,0,0],[.48,.48,.025]);for(let i=0;i<3;i++){box(root,'route_'+i,[-.12+i*.12,0,.02],[.025,.34,.015],i%2?'amber':'blue');box(root,'branch_'+i,[-.05,.1-i*.1,.02],[.3,.018,.015],i%2?'amber':'blue');}break;
    case 'meter':box(root,'pipe',[0,0,-.04],[.045,1.25,.045],'blue');box(root,'meter',[0,0,.03],[.26,.22,.18]);box(root,'index',[0,0,.13],[.19,.075,.025],'dark');break;
    case 'pipe':box(root,'vertical',[0,0,0],[.12,.55,.12],'metal');box(root,'bend',[-.17,-.22,0],[.4,.12,.12],'metal');break;
    case 'tap':box(root,'stem',[0,.05,-.1],[.045,.28,.045],'metal');box(root,'spout',[0,.18,.015],[.045,.045,.24],'metal');break;
    case 'window_inlet':box(root,'inlet',[0,0,0],[.65,.1,.06]);for(let i=0;i<7;i++)box(root,'slot_'+i,[-.24+i*.08,0,.04],[.035,.055,.015],'dark');break;
    case 'wall':box(root,'surface',[0,0,0],[.5,.6,.025]);for(let i=0;i<4;i++)box(root,'droplet_'+i,[-.15+i*.1,.12-i*.07,.025],[.025,.065,.018],'blue');break;
    default:box(root,'frame',[0,0,0],[.42,.22,.07]);for(let i=0;i<5;i++)box(root,'slat_'+i,[0,-.075+i*.038,.05],[.34,.012,.025],'dark');
   }
   const fallback=[...root.children];loadMeliModel(THREE,spec.kind).then(model=>{fallback.forEach(x=>x.visible=false);root.add(model);root.userData.gltfLoaded=true}).catch(error=>console.error('Modèle technique',spec.kind,error));
  }
  root.userData.equipmentId=id;root.userData.equipmentLabel=spec.label;roots.set(id,root);
 }
 scene.updateMatrixWorld(true);
 return {roots,point(id){const spec=registry[id],root=roots.get(id);if(!root)throw new Error('Liaison manquante : '+id);return root.localToWorld(new THREE.Vector3(...spec.point));}};
}

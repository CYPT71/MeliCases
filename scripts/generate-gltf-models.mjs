import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const source=fs.readFileSync(path.join(root,'data/apartment-kit.js'),'utf8');
const sandbox={window:{}};vm.runInNewContext(source,sandbox);
const {MELI_SKIN:skins,MELI_SKIN_PARTS:parts}=sandbox.window;
const out=path.join(root,'assets/models');fs.mkdirSync(out,{recursive:true});

const textures={wood:'../textures/oak-parquet.webp',fabric:'../textures/woven-fabric.webp',linen:'../textures/bed-linen-green.webp',rug:'../textures/geometric-rug.webp',tile:'../textures/ceramic-tile.webp',plaster:'../textures/plaster-wall.webp',terrazzo:'../textures/terrazzo.webp'};
const textureFor={bed:'linen',pillow:'linen',wardrobe:'wood',desk:'wood',table:'wood',vanity:'wood',kitchen:'wood',cabinet:'wood',island:'wood',bookcase:'wood',sofa:'fabric',curtain:'fabric',towel:'fabric',rug:'rug',backsplash:'tile',wallart:'fabric'};
const hiddenBase=new Set(['bike','mirror','shower','radiator','lamp','backsplash','wallart','curtain','towel']);
const P=(name,p,s,role='accent')=>[name,p,s,role];
function details(kind){
 const a=[];
 const legs=()=>[[-.42,-.47,-.38],[.42,-.47,-.38],[-.42,-.47,.38],[.42,-.47,.38]].forEach((p,i)=>a.push(P('foot_'+i,p,[.07,.22,.07],'accent')));
 if(['bed','sofa','desk','table','vanity','island'].includes(kind))legs();
 if(kind==='bed'){for(let i=0;i<9;i++)a.push(P('duvet_seam_'+i,[-.4+i*.1,.49,.18],[.012,.018,.72],'soft'));a.push(P('frame_left',[-.49,-.18,0],[.06,.22,.95],'base'),P('frame_right',[.49,-.18,0],[.06,.22,.95],'base'));}
 if(kind==='wardrobe'){for(let i=0;i<4;i++)a.push(P('hinge_'+i,[i<2?-.47:.47,i%2?-.34:.34,.54],[.025,.08,.025],'metal'));a.push(P('top_trim',[0,.49,0],[1.04,.06,1.04],'accent'),P('bottom_trim',[0,-.49,0],[1.04,.06,1.04],'accent'));}
 if(kind==='sofa'){for(let i=0;i<7;i++)a.push(P('seat_seam_'+i,[-.39+i*.13,.235,.19],[.012,.018,.65],'accent'));for(const x of[-.25,.25])a.push(P('button_'+x,[x,.38,-.485],[.045,.045,.018],'accent'));}
 if(kind==='fridge'){a.push(P('display',[.2,.18,.535],[.22,.1,.025],'accent'),P('brand',[0,.39,.535],[.18,.035,.02],'metal'),P('toe_kick',[0,-.48,.25],[.9,.08,.5],'accent'));}
 if(kind==='tv'){a.push(P('stand',[0,-.53,0],[.09,.28,.09],'metal'),P('foot',[0,-.66,0],[.48,.04,.26],'metal'),P('camera',[0,.37,.575],[.035,.035,.015],'metal'));}
 if(kind==='plant'){for(let i=0;i<10;i++){const x=-.36+(i%5)*.18,z=-.12+(i%2)*.24;a.push(P('leaf_detail_'+i,[x,.05+(i%3)*.2,z],[.14,.65,.08],i%2?'base':'accent'))}a.push(P('soil',[0,-.1,0],[.5,.04,.5],'accent'));}
 if(kind==='bike'){for(let i=0;i<12;i++){const t=i*Math.PI/6;a.push(P('wheelA_'+i,[-.32+Math.cos(t)*.22,-.2+Math.sin(t)*.22,0],[.035,.035,.06],'metal'),P('wheelB_'+i,[.32+Math.cos(t)*.22,-.2+Math.sin(t)*.22,0],[.035,.035,.06],'metal'))}a.push(P('seat',[.08,.28,0],[.25,.07,.18],'accent'),P('handlebar',[-.26,.31,0],[.08,.28,.06],'metal'),P('pedal',[0,-.12,.12],[.25,.035,.035],'metal'));}
 if(kind==='mirror')a.push(P('frame_top',[0,.48,.5],[1.02,.05,.05],'metal'),P('frame_bottom',[0,-.48,.5],[1.02,.05,.05],'metal'),P('frame_left',[-.48,0,.5],[.05,.92,.05],'metal'),P('frame_right',[.48,0,.5],[.05,.92,.05],'metal')); 
 if(kind==='shower'){for(let i=0;i<8;i++)a.push(P('shower_head_'+i,[.35,.48-i*.03,.35-i*.025],[.18-i*.018,.025,.025],'metal'));a.push(P('mixer',[.35,-.05,.38],[.22,.12,.08],'metal'),P('handle',[.35,-.05,.45],[.035,.2,.035],'metal'),P('tray',[0,-.49,0],[.98,.08,.98],'base'));}
 if(kind==='wc')a.push(P('seat',[0,.02,.11],[.64,.06,.6],'accent'),P('flush',[0,.46,-.16],[.16,.04,.08],'metal'),P('base',[0,-.43,-.02],[.5,.18,.52],'base'));
 if(['kitchen','cabinet','island','vanity'].includes(kind)){for(const x of[-.32,0,.32])a.push(P('drawer_'+x,[x,.16,.555],[.28,.2,.025],'accent'),P('drawer_handle_'+x,[x,.2,.585],[.16,.025,.02],'metal'));}
 if(kind==='bookcase'){for(let row=0;row<3;row++)for(let col=0;col<7;col++)a.push(P(`book_${row}_${col}`,[-.38+col*.125,-.37+row*.31,.42],[.085,.18+(col%3)*.035,.16],col%2?'accent':'base'));}
 if(kind==='desk')a.push(P('keyboard',[0,.56,.08],[.55,.025,.22],'accent'),P('cable_hole',[.35,.56,-.28],[.08,.025,.08],'metal'));
 if(kind==='table')a.push(P('edge_front',[0,.45,.5],[1.05,.13,.04],'accent'),P('edge_back',[0,.45,-.5],[1.05,.13,.04],'accent'));
 if(kind==='pillow')for(let i=0;i<8;i++)a.push(P('stitch_'+i,[-.35+i*.1,.48,.52],[.035,.025,.015],'accent'));
 if(kind==='rug'){for(let i=0;i<18;i++)a.push(P('fringe_'+i,[-.47+i*.055,.7,.5],[.018,.025,.12],'soft'),P('fringe_b_'+i,[-.47+i*.055,.7,-.5],[.018,.025,.12],'soft'));}
 if(kind==='backsplash')for(let y=-.4;y<=.4;y+=.2)for(let x=-.4;x<=.4;x+=.2)a.push(P(`tile_${x}_${y}`,[x,y,.54],[.185,.185,.025],(Math.round((x+y)*10)%2)?'base':'accent'));
 if(kind==='wallart')a.push(P('frame_t',[0,.49,.52],[1.02,.05,.06],'base'),P('frame_b',[0,-.49,.52],[1.02,.05,.06],'base'),P('frame_l',[-.49,0,.52],[.05,.95,.06],'base'),P('frame_r',[.49,0,.52],[.05,.95,.06],'base'));
 if(kind==='curtain')for(let i=0;i<16;i++)a.push(P('ring_'+i,[-.46+i*.061,.47,.56],[.025,.055,.025],'metal'));
 if(kind==='towel')for(let i=0;i<9;i++)a.push(P('loop_'+i,[-.4+i*.1,-.48,.56],[.035,.09,.025],'soft'));
 if(kind==='radiator'){a.push(P('pipe_in',[-.48,-.45,0],[.06,.25,.06],'metal'),P('pipe_out',[.48,-.45,0],[.06,.25,.06],'metal'),P('valve',[.48,-.34,.08],[.16,.08,.08],'metal'));}
 if(kind==='lamp'){for(let i=0;i<8;i++)a.push(P('shade_rib_'+i,[-.34+i*.097,.38,.38],[.025,.3,.025],'metal'));a.push(P('bulb',[0,.32,0],[.16,.22,.16],'accent'),P('cable',[.1,-.2,0],[.025,.45,.025],'metal'));}
 return a;
}

function cubeData(){
 const p=[],n=[],uv=[],idx=[];let o=0;
 const faces=[[[0,0,1],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],[[0,0,-1],[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]],[[1,0,0],[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]],[[-1,0,0],[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],[[0,1,0],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],[[0,-1,0],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]];
 for(const [normal,...verts] of faces){for(const v of verts){p.push(...v);n.push(...normal)}uv.push(0,0,1,0,1,1,0,1);idx.push(o,o+1,o+2,o,o+2,o+3);o+=4}return {p,n,uv,idx};
}
function bufferPayload(){const g=cubeData(),chunks=[new Float32Array(g.p),new Float32Array(g.n),new Float32Array(g.uv),new Uint16Array(g.idx)];let offset=0;const views=[];for(const a of chunks){offset=(offset+3)&~3;views.push({byteOffset:offset,byteLength:a.byteLength});offset+=a.byteLength}const b=Buffer.alloc(offset);chunks.forEach((a,i)=>Buffer.from(a.buffer).copy(b,views[i].byteOffset));return {b,views,g};}
function hex(v){return [((v>>16)&255)/255,((v>>8)&255)/255,(v&255)/255,1]}
function makeModel(kind,modelParts){
 const skin=skins[kind]||skins.default;const roles=[...new Set(modelParts.map(x=>x[3]))];const {b,views,g}=bufferPayload();
 const images=[],tex=[],materials=roles.map(role=>{const key=textureFor[kind];const m={name:role,pbrMetallicRoughness:{baseColorFactor:hex(skin[role]??skin.base),metallicFactor:role==='metal'?.72:.05,roughnessFactor:role==='metal'?.28:.72}};if(key){let i=images.findIndex(x=>x.uri===textures[key]);if(i<0){i=images.length;images.push({uri:textures[key]});tex.push({source:i,sampler:0})}m.pbrMetallicRoughness.baseColorTexture={index:i};}if(['mirror','shower'].includes(kind)&&role==='base'){m.alphaMode='BLEND';m.pbrMetallicRoughness.baseColorFactor=[.65,.9,1,.35];}return m});
 const meshes=roles.map((role,i)=>({name:kind+'_'+role,primitives:[{attributes:{POSITION:0,NORMAL:1,TEXCOORD_0:2},indices:3,material:i}]}));
 const nodes=[{name:kind,children:modelParts.map((_,i)=>i+1)}];modelParts.forEach(([name,p,s,role])=>nodes.push({name,mesh:roles.indexOf(role),translation:p,scale:s}));
 return {asset:{version:'2.0',generator:'MeliCases detailed-object generator'},scene:0,scenes:[{name:kind,nodes:[0]}],nodes,meshes,materials,...(images.length?{samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],images,textures:tex}:{}),buffers:[{byteLength:b.length,uri:'data:application/octet-stream;base64,'+b.toString('base64')}],bufferViews:views.map((v,i)=>({...v,buffer:0,target:i===3?34963:34962})),accessors:[{bufferView:0,componentType:5126,count:g.p.length/3,type:'VEC3',min:[-.5,-.5,-.5],max:[.5,.5,.5]},{bufferView:1,componentType:5126,count:g.n.length/3,type:'VEC3'},{bufferView:2,componentType:5126,count:g.uv.length/2,type:'VEC2'},{bufferView:3,componentType:5123,count:g.idx.length,type:'SCALAR',min:[0],max:[23]}]};
}
const manifest={version:1,format:'gltf-2.0',collision:'The runtime keeps separate invisible coarse collision boxes.',models:{}};
for(const kind of Object.keys(parts)){
 const modelParts=[];if(!hiddenBase.has(kind))modelParts.push(['body',[0,0,0],[1,1,1],'base']);modelParts.push(...parts[kind],...details(kind));
 const file=kind+'.gltf';fs.writeFileSync(path.join(out,file),JSON.stringify(makeModel(kind,modelParts)));manifest.models[kind]={file,parts:modelParts.length,texture:textureFor[kind]||null};
}
const equipment={
 boiler:[P('housing',[0,0,0],[.58,.85,.22],'base'),P('display',[0,-.15,.125],[.3,.14,.025],'accent'),...[-.18,0,.18].map((x,i)=>P('pipe_'+i,[x,-.62,0],[.035,.45,.035],'metal')),...Array.from({length:8},(_,i)=>P('vent_'+i,[-.2+i*.057,.28,.125],[.035,.08,.02],'accent'))],
 stove:[P('hob',[0,0,0],[.72,.08,.5],'accent'),...[-.2,.2].flatMap(x=>[-.13,.13].map((z,i)=>P(`burner_${x}_${i}`,[x,.05,z],[.16,.035,.14],'metal'))),...Array.from({length:5},(_,i)=>P('knob_'+i,[-.25+i*.125,-.08,.255],[.06,.06,.035],'metal'))],
 panel:[P('housing',[0,0,0],[.58,.52,.12],'base'),P('opening',[0,0,.075],[.44,.34,.025],'accent'),...Array.from({length:5},(_,i)=>P('breaker_'+i,[-.17+i*.085,0,.1],[.05,.16,.035],i===0?'metal':'base'))],
 socket:[P('frame',[0,0,0],[.18,.18,.045],'base'),P('plate',[0,0,.03],[.145,.145,.02],'accent'),P('contact_l',[-.035,0,.045],[.022,.04,.02],'metal'),P('contact_r',[.035,0,.045],[.022,.04,.02],'metal'),P('earth',[0,.045,.045],[.025,.025,.02],'metal')],
 plan:[P('paper',[0,0,0],[.48,.48,.025],'base'),...Array.from({length:7},(_,i)=>P('route_'+i,[-.18+i*.06,0,.02],[.016,.36-(i%3)*.05,.015],i%2?'accent':'metal'))],
 meter:[P('pipe',[0,0,-.04],[.045,1.25,.045],'metal'),P('meter',[0,0,.03],[.26,.22,.18],'base'),P('index',[0,0,.13],[.19,.075,.025],'accent'),...Array.from({length:6},(_,i)=>P('digit_'+i,[-.07+i*.028,0,.148],[.014,.04,.01],'metal'))],
 pipe:[P('vertical',[0,0,0],[.12,.55,.12],'metal'),P('bend',[-.17,-.22,0],[.4,.12,.12],'metal'),P('joint',[0,.18,0],[.17,.08,.17],'accent')],
 tap:[P('stem',[0,.05,-.1],[.045,.28,.045],'metal'),P('spout',[0,.18,.015],[.045,.045,.24],'metal'),P('handle',[0,.25,-.1],[.25,.035,.035],'accent'),P('nozzle',[0,.18,.13],[.08,.08,.06],'metal')],
 window_inlet:[P('inlet',[0,0,0],[.65,.1,.06],'base'),...Array.from({length:9},(_,i)=>P('slot_'+i,[-.28+i*.07,0,.04],[.035,.055,.015],'accent'))],
 wall:[P('surface',[0,0,0],[.5,.6,.025],'base'),...Array.from({length:9},(_,i)=>P('droplet_'+i,[-.2+(i%5)*.1,.2-Math.floor(i/5)*.18,.025],[.025,.065,.018],'accent'))],
 vent:[P('frame',[0,0,0],[.42,.22,.07],'base'),...Array.from({length:7},(_,i)=>P('slat_'+i,[0,-.09+i*.03,.05],[.34,.012,.025],'accent'))]
};
for(const [kind,modelParts] of Object.entries(equipment)){const file=kind+'.gltf';fs.writeFileSync(path.join(out,file),JSON.stringify(makeModel(kind,modelParts)));manifest.models[kind]={file,parts:modelParts.length,texture:null,technical:true};}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated ${Object.keys(manifest.models).length} glTF models in ${out}`);

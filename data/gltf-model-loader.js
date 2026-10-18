// Chargeur glTF 2.0 volontairement limité aux assets MeliCases générés.
// Les collisions restent gérées séparément par les volumes invisibles du runtime.
const cache=new Map();
const component={5123:Uint16Array,5126:Float32Array};

function decode(uri){const raw=atob(uri.slice(uri.indexOf(',')+1)),a=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return a.buffer}
export async function loadMeliModel(THREE,kind){
 if(!cache.has(kind))cache.set(kind,fetch(new URL(`../assets/models/${kind}.gltf`,import.meta.url)).then(r=>{if(!r.ok)throw new Error(`glTF ${kind}: ${r.status}`);return r.json()}));
 const g=await cache.get(kind),buffers=g.buffers.map(x=>decode(x.uri)),textures=[];
 const read=i=>{const a=g.accessors[i],v=g.bufferViews[a.bufferView],C=component[a.componentType],size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];return new C(buffers[v.buffer],(v.byteOffset||0)+(a.byteOffset||0),a.count*size)};
 const materials=(g.materials||[]).map(m=>{const p=m.pbrMetallicRoughness||{},color=p.baseColorFactor||[1,1,1,1],opts={color:new THREE.Color(color[0],color[1],color[2]),opacity:color[3],transparent:m.alphaMode==='BLEND'||color[3]<1,metalness:p.metallicFactor??0,roughness:p.roughnessFactor??.7};if(p.baseColorTexture){const image=g.images[g.textures[p.baseColorTexture.index].source],url=new URL(image.uri,new URL(`../assets/models/${kind}.gltf`,import.meta.url)).href;opts.map=textures[p.baseColorTexture.index]||(textures[p.baseColorTexture.index]=new THREE.TextureLoader().load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.needsUpdate=true}))}return new THREE.MeshStandardMaterial(opts)});
 const geometries=g.meshes.map(mesh=>{const p=mesh.primitives[0],geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(read(p.attributes.POSITION),3));geo.setAttribute('normal',new THREE.BufferAttribute(read(p.attributes.NORMAL),3));geo.setAttribute('uv',new THREE.BufferAttribute(read(p.attributes.TEXCOORD_0),2));geo.setIndex(new THREE.BufferAttribute(read(p.indices),1));return {geo,material:materials[p.material]}});
 const build=i=>{const n=g.nodes[i],o=n.mesh===undefined?new THREE.Group():new THREE.Mesh(geometries[n.mesh].geo,geometries[n.mesh].material);o.name=n.name||`${kind}_${i}`;if(o.isMesh){o.castShadow=true;o.receiveShadow=true}if(n.translation)o.position.fromArray(n.translation);if(n.scale)o.scale.fromArray(n.scale);if(n.rotation)o.quaternion.fromArray(n.rotation);(n.children||[]).forEach(c=>o.add(build(c)));return o};
 const root=new THREE.Group();root.name=`gltf_${kind}`;(g.scenes[g.scene||0].nodes||[]).forEach(i=>root.add(build(i)));root.userData.assetFormat='glTF 2.0';root.userData.visualOnly=true;return root;
}

(function(g){
class InteractionSystem{
 constructor(THREE,scene,camera,{distance=2.4,debug=false,occluders=[]}={}){this.THREE=THREE;this.scene=scene;this.camera=camera;this.distance=distance;this.debug=debug;this.occluders=occluders;this.items=[];this.ray=new THREE.Raycaster();}
 add(object,{id,type='inspect',label='Interagir',padding=.12,data={},enabled=true,targetObject=object}={}){const T=this.THREE;object.updateWorldMatrix(true,true);const b=new T.Box3().setFromObject(targetObject).union(new T.Box3().setFromObject(object)).expandByScalar(padding),size=new T.Vector3(),center=new T.Vector3();b.getSize(size);b.getCenter(center);const hit=new T.Mesh(new T.BoxGeometry(Math.max(size.x,.22),Math.max(size.y,.22),Math.max(size.z,.22)),new T.MeshBasicMaterial({color:0x00ff88,wireframe:true,transparent:true,opacity:this.debug?.28:0,depthWrite:false}));hit.position.copy(center);hit.userData={interactive:true,id:id||object.name,type,label,data,enabled};this.scene.add(hit);const item={object,hit,id:id||object.name,type,label,data};this.items.push(item);return item}
 setDebug(v){this.debug=v;this.items.forEach(i=>i.hit.material.opacity=v?.28:0)}
 setEnabled(id,v){const i=this.items.find(x=>x.id===id);if(i){i.hit.userData.enabled=v;i.hit.visible=v;}}
 focus(){this.ray.setFromCamera(new this.THREE.Vector2(0,0),this.camera);const target=this.ray.intersectObjects(this.items.map(i=>i.hit).filter(h=>h.visible&&h.userData.enabled),false).find(x=>x.distance<=this.distance);if(!target)return null;const visible=object=>{for(let node=object;node;node=node.parent)if(!node.visible)return false;return true;};const blocker=this.ray.intersectObjects(this.occluders.filter(visible),false)[0];return blocker&&blocker.distance<target.distance-.06?null:target}
 itemFrom(hit){return hit?this.items.find(i=>i.hit===hit.object):null}
 remove(id){const n=this.items.findIndex(i=>i.id===id);if(n<0)return;const i=this.items[n];this.scene.remove(i.hit);i.hit.geometry.dispose();i.hit.material.dispose();this.items.splice(n,1)}
}
g.MeliInteractionSystem=InteractionSystem;
})(window);
(function(g){
class TrainerChannel{
 constructor(code){this.code=String(code||'MELI').toUpperCase().replace(/[^A-Z]/g,'').slice(0,4);this.name='meli-trainer-'+this.code;this.handlers=[];this.channel=('BroadcastChannel'in g)?new BroadcastChannel(this.name):null;this.channel&&(this.channel.onmessage=e=>this.emit(e.data));addEventListener('storage',e=>{if(e.key===this.name&&e.newValue)try{this.emit(JSON.parse(e.newValue))}catch{}})}
 send(type,payload={}){const msg={type,payload,code:this.code,id:crypto.randomUUID?.()||String(Date.now()),at:Date.now()};this.channel?.postMessage(msg);try{localStorage.setItem(this.name,JSON.stringify(msg));localStorage.removeItem(this.name)}catch{}return msg}
 on(fn){this.handlers.push(fn);return()=>this.handlers=this.handlers.filter(x=>x!==fn)}
 emit(msg){if(msg?.code===this.code)this.handlers.forEach(fn=>fn(msg))}
 close(){this.channel?.close();this.handlers=[]}
}
g.MeliTrainerChannel=TrainerChannel;
})(window);

(function(global){
  class MeliSoundEngine{
    constructor(){this.ctx=null;this.master=null;this.ambient=null;this.enabled=localStorage.getItem('meli.sound')!=='off';this.room='entree'}
    unlock(){
      if(!this.ctx){const AudioContext=global.AudioContext||global.webkitAudioContext;if(!AudioContext)return false;this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=this.enabled?.12:0;this.master.connect(this.ctx.destination);this.startAmbience()}
      if(this.ctx.state==='suspended')this.ctx.resume();return true
    }
    startAmbience(){const filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain(),osc=this.ctx.createOscillator();filter.type='lowpass';filter.frequency.value=180;osc.type='sine';osc.frequency.value=48;gain.gain.value=.055;osc.connect(filter).connect(gain).connect(this.master);osc.start();this.ambient={osc,filter,gain};this.setRoom(this.room)}
    setRoom(room){this.room=room;if(!this.ambient)return;const profiles={chambre:[43,120,.025],sdb:[58,420,.035],wc:[55,360,.025],couloir:[47,210,.02],salon:[44,160,.028],cuisine:[62,520,.03],entree:[46,190,.02]},p=profiles[room]||profiles.entree,t=this.ctx.currentTime;this.ambient.osc.frequency.cancelScheduledValues(t);this.ambient.osc.frequency.linearRampToValueAtTime(p[0],t+.7);this.ambient.filter.frequency.linearRampToValueAtTime(p[1],t+.7);this.ambient.gain.gain.linearRampToValueAtTime(p[2],t+.7)}
    tone(frequency,start,duration,volume=.12,type='sine'){const osc=this.ctx.createOscillator(),gain=this.ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.018);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(gain).connect(this.master);osc.start(start);osc.stop(start+duration+.03)}
    cue(type){if(!this.unlock()||!this.enabled)return;const t=this.ctx.currentTime+.015;if(type==='correct'){this.tone(523,t,.18,.16);this.tone(659,t+.11,.22,.13);this.tone(784,t+.22,.34,.11)}else if(type==='error'){this.tone(196,t,.24,.13,'triangle');this.tone(165,t+.16,.38,.12,'triangle')}else if(type==='inspect'){this.tone(880,t,.1,.07);this.tone(1175,t+.07,.15,.05)}else if(type==='start'){this.tone(262,t,.25,.09);this.tone(392,t+.13,.36,.08)}}
    toggle(){this.unlock();this.enabled=!this.enabled;localStorage.setItem('meli.sound',this.enabled?'on':'off');if(this.master)this.master.gain.linearRampToValueAtTime(this.enabled?.12:0,this.ctx.currentTime+.18);return this.enabled}
  }
  global.MeliSoundEngine=MeliSoundEngine;
})(window);

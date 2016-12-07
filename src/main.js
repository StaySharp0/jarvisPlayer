import LayoutUI from './LayoutUI';
import Player from './Player';
import PlayerUI from './PlayerUI';


const layoutUI = new LayoutUI({
  url     :'http://localhost:21260',
  side    :'.side-nav',
  playlist:'#playList',
  main    :'main'
});
const playerUI = new PlayerUI({
  player    :'#player',
  time_bar  :'#bar',
  volume_bar:'#volume',
  repeat    :'#repeat',
  repeat_one:'#repeat_one',
  play      :'#play',
  pause     :'#pause',
  shuffle   :'#shuffle',
  volume_on :'#volume_on',
  volume_off:'#volume_off' 
});
const player = new Player('#audio');


playerUI.init({
  play:   () => {player.play(); },
  pause:  () => {player.pause(); },
  seek:   (time) => {player.seek(time); },
  vol:    (volume) => {player.vol(volume); },
  vol_on: () => { player.vol_on(); },
  vol_off:() => { player.vol_off(); }
});

player.setEnvets('statechange',(state)=>{ if(state === 'finished') playerUI.togglePlay(); });
player.setEnvets('durationchange',(duration)=>{playerUI.setDuration(duration)});
player.setEnvets('timeupdate',(time)=>{playerUI.updateTime(time)});
player.setEnvets('volumechange',(volume)=>{playerUI.volumeChange(volume)});
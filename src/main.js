import LayoutUI from './LayoutUI';
import Player from './Player';
import PlayerUI from './PlayerUI';

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
  volume_off:'#volume_off',
  fast_forward:'#fast_forward',
  fast_rewind:'#fast_rewind'
});
const player = new Player('#audio');

const layoutUI = new LayoutUI({
  url     : window.href,
  side    :'.side-nav',
  playlist:'#playList',
  main    :'main'
});

playerUI.init({
  play:   () => {player.play(); },
  pause:  () => {player.pause(); },
  seek:   (time) => {player.seek(time); },
  vol:    (volume) => {player.vol(volume); },
  vol_on: () => { player.vol_on(); },
  vol_off:() => { player.vol_off(); },
  prev:   () => { player.prev(); playerUI.set(player.getMusicInfo()); },
  next:   () => { player.next(); playerUI.set(player.getMusicInfo()); }
});

player.setEnvets('statechange',(state)=>{
  if(state === 'playing') playerUI.togglePlay('pause');
  if(state === 'finished') playerUI.togglePlay('play');
});
player.setEnvets('durationchange',(duration)=>{playerUI.setDuration(duration)});
player.setEnvets('timeupdate',(time)=>{playerUI.updateTime(time)});
player.setEnvets('volumechange',(volume)=>{playerUI.volumeChange(volume)});

layoutUI.init(playerUI,player);
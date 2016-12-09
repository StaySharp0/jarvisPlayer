import LayoutUI from './LayoutUI';
import Player from './Player';
import PlayerUI from './PlayerUI';
import VC from './VoiceCommand';

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
  form    : '#frm-search',
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
  next:   () => { player.next(); playerUI.set(player.getMusicInfo()); },
  playOpion:(option) => { 
    $.map(option,(value,key) => {
      player.setPlayOption(key,value);
    });
  }
});

player.setEnvets('statechange',(state,op)=>{
  if(state === 'playing') playerUI.togglePlay('pause');
  if(state === 'finished') {
    if(op.repeat) {
      let musicInfo = player.next();
      playerUI.set(musicInfo);
    }
    else if (op.repeat_one) {
      player.seek(0);
      player.play();
    }
    else if(op.shuffle) {
      let musicInfo = player.shufflePlay();
      playerUI.set(musicInfo);
    } else {
      playerUI.togglePlay('play');  
    }
  }
});
player.setEnvets('durationchange',(duration)=>{playerUI.setDuration(duration)});
player.setEnvets('timeupdate',(time)=>{playerUI.updateTime(time)});
player.setEnvets('volumechange',(volume)=>{playerUI.volumeChange(volume)});

layoutUI.init(playerUI,player);


const vc = new VC({
  pause     : function(){
    $('#pause').click();
  },
  list_play : function() {
    $('.music-tr').eq(0).click();
  },
  play      : function() {
    $('#play').click();
  },
  next      : function() {
    $('#fast_forward').click();
  },
  privious  : function() {
    $('#fast_rewind').click();
  },
  shuffle    : function(tag){
    if( tag === 'on') {
      playerUI.setShuffle(true);
      player.setPlayOption('shuffle',true);
    } else if( tag === 'off'){
      playerUI.setShuffle(false);
      player.setPlayOption('shuffle',false);
    }
  },
  show_playlist: function(tag){
    $('.side-item').map( (idx,e) =>{
      let title = $(e).html().toLowerCase().trim();
      title = title.substring(title.indexOf('</i>')+4).trim();

      if( title === tag ) {
        return $(e).click();
      }
    });

    $('.playlist-item').map( (idx,e) =>{
      let title = $(e).html().toLowerCase().trim();

      if( title === tag ) {
        $('.side-playlist').click();
        $('#playList').show();
        return $(e).click();
      }
    });
  },
  play_playlist: function(tag){
    $('.side-item').map( (idx,e) =>{
      let title = $(e).html().toLowerCase();
      title = title.substring(title.indexOf('</i>')+4).trim();

      if( title === tag ) {
        $(e).click();
        return setTimeout(() => {
          $('.music-tr').eq(0).click();
        },1000);
      }
    });

    $('.playlist-item').map( (idx,e) =>{
      let title = $(e).html().toLowerCase().trim();

      if( title === tag ) {
        $(e).click();
        $('.side-playlist').click();
        $('#playList').show();

        return setTimeout(() => {
          $('.music-tr').eq(0).click();
        },1000);
      }
    });
  },
  set_volume: function(tag){
    let vol = $('#volume').val();
    if(tag === 'up'){
      $('#volume').val(vol+0.2).change();
    } else if (tag === 'down'){
      $('#volume').val(vol-0.2).change();
    } else if (tag === 'mute' || tag === 'off'){
      $('#volume').val(0).change();
    } else if (tag === 'on'){
      $('#volume').val(0.6).change();
    }
  },
  repeat: function(tag){
    if( tag === 'one') {
      playerUI.setRepeatOne(true);
      player.setPlayOption('repeat_one',true);
      player.setPlayOption('repeat',false);
    } else if( tag === 'all' || tag === 'list'){
      playerUI.setRepeat(true);
      player.setPlayOption('repeat',true);
      player.setPlayOption('repeat_one',false);
    } else if ( tag === 'off'){
      playerUI.setRepeat(false);
      player.setPlayOption('repeat',false);
      player.setPlayOption('repeat_one',false);
    }
  },
  search: function(tag){
    $('#search').val(tag);
    $('#frm-search').submit();
  }
});

window.player = playerUI;

if (annyang) {
  annyang.debug(true);
  annyang.addCommands(vc.getCommands());
  annyang.addCallback('result', function(phrases) {
    console.log("I think the user said: ", phrases[0]);
    console.log("But then again, it could be any of the following: ", phrases);
  });
  annyang.addCallback('resultNoMatch', function(phrases) {
    console.log("oh~! no!")
  });
  annyang.addCallback('soundstart', function() {
    console.log('sound detected');
  });

  annyang.addCallback('result', function() {
    console.log('sound stopped');
  });
  annyang.start();
}
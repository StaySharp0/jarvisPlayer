class VoiceCommand{
  constructor(obj_func){    
    this._obj_command = {
    'stop' : obj_func.pause,
    'play' : obj_func.play,
    'resume' : obj_func.play,
    'pause' : obj_func.pause,
    'next' : obj_func.next,
    'previous' : obj_func.privious,    
    '(turn) shuffle *op' : obj_func.shuffle,
    'repeat *op' : obj_func.repeat,
    'not repeat' : function(){ obj_func.repeat('off');},
    'volume *op' : obj_func.set_volume,
    'mute' : function(){ obj_func.set_volume('mute');},
    'show (me) (a) (list) (of) *title' : obj_func.show_playlist,
    'play this (list)' : obj_func.list_play,
    'play (list) (of) *title' : obj_func.play_playlist,    
    'search *keyword' : obj_func.search,
    
    }
  }
  getCommands(){
    return this._obj_command;
  }
  getFunctions(command){
    if(!command){
      return this._obj_func;
    }
    return command.map(function(key){
        return this[key];
    },this._obj_command);
  }
  setCommand(command,cb = null){
    if(command && cb) {
      this._obj_command[command] = cb;
    }
  }
}

export default VoiceCommand;
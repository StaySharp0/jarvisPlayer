class VoiceCommand{
  constructor(obj_func){    
    this._obj_command = {
    'hello': obj_func.hello,
    'stop' : obj_func.pause,
    'play' : obj_func.play,
    'resume' : obj_func.play,
    'pause' : obj_func.pause,
    'next' : obj_func.next,
    'privious' : obj_func.privious,    
    '(turn) suffle *op' : obj_func.suffle,
    'repeat *op' : obj_func.repeat,
    'not repeat' : function(){ obj_func.repeat(not);},
    'volume *op' : set_volume,
    'mute' : function(){ obj_func.set_volume(mute);},
    'show (me) list *title' : show_playlist,
    'play list *title' : play_playlist,    
    }
    this._obj_func = this._obj_command.keys().map(function(key){
      return this[key];
    },this._obj_command);    
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
  setCommand(command,function = null){
    if(function) {
      this._obj_command[command] = function;
    }    
  }

}
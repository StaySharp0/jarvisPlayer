class Player {
  constructor(element ='') {
  	if(element === '') throw new TypeError('not include audio');

    this._$e     = $(element);
    this._volume = 1;
    this._events = {
      statechange:    (state)   =>{ console.log('state:', state); },
      error:          (err)     =>{ console.log('err: ',err); },
      durationchange: (duration)=>{ console.log('duration: ',duration);},
      volumechange:   (volume)  =>{ console.log('volume: ',volume); },
      timeupdate:     (time)    =>{ console.log('time:', time); },
      prev:           ()        =>{ console.log('prev'); },
      next:           ()        =>{ console.log('next'); }
    };

    this._$e.on('embedplayer:statechange', (e) => {
    	this._events.statechange(e.state);

  	}).on('embedplayer:error', (e) => {
  		this._events.error(e.error);

  	}).on('embedplayer:durationchange', (e) => {
  		this._events.durationchange(e.duration);
  	
  	}).on('embedplayer:volumechange', (e) => {
	    if(e.volume) this._volume = e.volume;

	    this._events.volumechange(e.volume);

  	}).on('embedplayer:timeupdate', (e) => {
  		this._events.timeupdate(e.currentTime)

  	}).embedplayer('listen'); // enable all events
  }

  play()	{ this._$e.embedplayer('play'); }
  pause()	{ this._$e.embedplayer('pause'); }
  seek(time)  { this._$e.embedplayer('seek',time); }
  vol(volume)  { this._$e.embedplayer('volume',volume); }
  vol_on() { this._$e.embedplayer('volume',this._volume); }
  vol_off() { this._$e.embedplayer('volume',0); }
  prev() { 
    if(this._list){
      if( this._index === 1 ) return this.seek(0);
      let music = this.getMusicInfo(--this._index);
      this._socket.emit('set Music', music.index);
    }
  }
  next() {
    if(this._list){
      if( this._index === this._list.length ) return this.seek(0);
      let music = this.getMusicInfo(++this._index);
      this._socket.emit('set Music', music.index);
    }
  }
  
  setMusic(buffer){     
    let data = new Uint8Array(buffer);
    let blob = new Blob([data], { 'type' : 'audio/mp3' });
    let url  = URL.createObjectURL(blob);

    $('#audio').attr('src',url);
  }
  setEnvets(event,fn){ 
  	if(this._events[event]) {
      this._events[event] = fn;
    }
  }

  setIndex(idx){
    this._index = idx;
  }
  getIndex(){
    return {
      musicIndex: this._index,
      infoIndex: this._index - 1
    };
  }
  setList(data){
    this._listKey = data.title;
    this._list = data.musics;
  }
  getListKey(){
    return this._listKey;
  }
  getMusicInfo(idx){
    if(idx) {
      return this._list[idx-1];
    }
    else {
      if(this._index) return this._list[this._index-1];
    }   
  }
  setSocket(socket) { 
    this._socket = socket;
  }
}

export default Player;
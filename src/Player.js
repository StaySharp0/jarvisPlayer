class Player {
  constructor(element ='') {
  	if(element === '') throw new TypeError('not include audio');

    this.$e     = $(element);
    this.volume = 1;
    this.events = {
      statechange:    (state)   =>{ console.log('state:', state); },
      error:          (err)     =>{ console.log('err: ',err); },
      durationchange: (duration)=>{ console.log('duration: ',duration);},
      volumechange:   (volume)  =>{ console.log('volume: ',volume); },
      timeupdate:     (time)    =>{ console.log('time:', time); }
    };

    this.$e.on('embedplayer:statechange', (e) => {
    	this.events.statechange(e.state);

  	}).on('embedplayer:error', (e) => {
  		this.events.error(e.error);

  	}).on('embedplayer:durationchange', (e) => {
  		this.events.durationchange(e.duration);
  	
  	}).on('embedplayer:volumechange', (e) => {
	    if(e.volume) this.volume = e.volume;

	    this.events.volumechange(e.volume);

  	}).on('embedplayer:timeupdate', (e) => {
  		this.events.timeupdate(e.currentTime)

  	}).embedplayer('listen'); // enable all events
  }

  play()	{ this.$e.embedplayer('play'); }
  pause()	{ this.$e.embedplayer('pause'); }
  seek(time)  { this.$e.embedplayer('seek',time); }
  vol(volume)  { this.$e.embedplayer('volume',volume); }
  vol_on() { this.$e.embedplayer('volume',this.volume); }
  vol_off() { this.$e.embedplayer('volume',0); }
  // prev() { this.$e.embedplayer('prev'); }
  // next() { this.$e.embedplayer('next'); }
  
  setEnvets(event,fn){ 
  	if(this.events[event]) {
      this.events[event] = fn;
    }
  }
  
}

export default Player;
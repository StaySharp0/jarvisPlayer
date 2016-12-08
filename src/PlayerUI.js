class PlayerUI {
	constructor(o = {}){
		this.player 		= o.player;
		this.time_bar		= o.time_bar;
		this.volume_bar 	= o.volume_bar;
		this.repeat			= o.repeat;
		this.repeat_one		= o.repeat_one;
		this.fast_rewind	= o.fast_rewind;
		this.play 			= o.play;
		this.pause 			= o.pause;
		this.fast_forward 	= o.fast_forward;
		this.shuffle 		= o.shuffle;
		this.volume_on 		= o.volume_on;
		this.volume_off 	= o.volume_off;

		// Set jQuery-obj DOM-Player  
		this._$playerCover = $(this.player).find('#music-cover');
		this._$playerTitle = $(this.player).find('#music-title');
		this._$playerInfo  = $(this.player).find('#music-info');

		this._status = { repeat:false, repeat_one:false, shuffle:false };
	}

	init(o = {}){
		this.setColor(o.activeColor, o.nonActiveColor)
		this._timeBarEvent(o.seek);
		this._volumeBarEvent(o.vol);
		this._repeatEvent(o.playOpion);
		this._playEvent(o.play);
		this._pauseEvent(o.pause);
		this._shuffleEvent(o.playOpion);
		this._volumeOnEvent(o.vol_on);
		this._volumeOffEvent(o.vol_off);
		this._prevEvent(o.prev);
		this._nextEvent(o.next);
	}
	setColor(activeColor = '#ef3b5d', nonActiveColor = '#ccc'){
		this.activeColor 	= activeColor;
		this.nonActiveColor = nonActiveColor;
	}
	_timeBarEvent(cb = ()=>{}){
		const $e = $(this.time_bar);

		$e.change(() => {
			let min = $e.attr('min');
			let max = $e.attr('max');
			let val = $e.val();
			let calc = (val - min) / (max - min);

			cb(val);

			$e.css('background-image',
				'-webkit-gradient(linear, left top, right top,' +
				'color-stop(' + calc + ','+this.activeColor+'),' +
				'color-stop(' + calc + ','+this.nonActiveColor+'))'
			);
		});
	}
	_volumeBarEvent(cb = ()=>{}){
		const $e = $(this.volume_bar);

		$e.change(() => {
			let min = $e.attr('min');
			let max = $e.attr('max');
			let val = $e.val();
			let calc = (val - min) / (max - min);

			cb(val);

			//return String value from dom
			if (val === '0') {
				$(this.volume_on).hide();
				$(this.volume_off).show();
			} else {
				$(this.volume_on).show();
				$(this.volume_off).hide();
			}
			

			$e.css('background-image',
				'-webkit-gradient(linear, left top, right top,' +
				'color-stop(' + calc + ','+this.activeColor+'),' +
				'color-stop(' + calc + ','+this.nonActiveColor+'))'
			);

		}).trigger('change'); //Update UI
	}
	_repeatEvent(cb = ()=>{}){
		const $repeat 		= $(this.repeat);
		const $repeat_one 	= $(this.repeat_one);
		
		$repeat.click(() => {
			if($repeat.hasClass('on')){
				$repeat.hide().removeClass('on');
				$repeat_one.show();

				this._status.repeat 	= false;
				this._status.repeat_one = true;

				cb(this._status);
			} else {
				$repeat.addClass('on');

				this._status.repeat 	= true;
				this._status.repeat_one = false;

				cb(this._status);
			}
		});

		$repeat_one.click(() => {
			$repeat_one.hide();
			$repeat.show();

			$repeat.removeClass('on');

			this._status.repeat 	= false;
			this._status.repeat_one = false;

			cb(this._status);
		});
	}
	_playEvent(cb = ()=>{}){
		const $play 	= $(this.play);
		const $pause 	= $(this.pause);

		$play.click(() => {
			$play.hide();
			$pause.show();

			cb();
		});
	}
	_pauseEvent(cb = ()=>{}){
		const $play 	= $(this.play);
		const $pause 	= $(this.pause);

		$pause.click(() => {
			$pause.hide();
			$play.show();

			cb();
		});
	}
	_shuffleEvent(cb = ()=>{}){
		const $shuffle 	= $(this.shuffle);

		$shuffle.click(() => {
			if($shuffle.hasClass('on')){
				this._status.shuffle = false;
				$shuffle.removeClass('on');

				cb(this._status);
			} else {
				this._status.shuffle = true;
				$shuffle.addClass('on');

				cb(this._status);
			}
		});
	}
	_volumeOnEvent(cb = ()=>{}){
		const $volume_on 	= $(this.volume_on);
		const $volume_off 	= $(this.volume_off);

		$volume_off.click(() => {
			$volume_off.hide();
			$volume_on.show();

			cb();
		});
	}
	_volumeOffEvent(cb = ()=>{}){
		const $volume_on 	= $(this.volume_on);
		const $volume_off 	= $(this.volume_off);

		$volume_on.click(() => {
			$volume_on.hide();
			$volume_off.show();

			cb();
		});
	}
	_prevEvent(cb = ()=>{}){
		const $e = $(this.fast_rewind);

		$e.click(() => {
			cb();
		});
	}
	_nextEvent(cb = ()=>{}){
		const $e = $(this.fast_forward);

		$e.click(() => {
			cb();
		});
	}
	setDuration(time){
		const $e = $(this.time_bar);
		$e.prop('max', time);
	}
	updateTime(time){
		const $e = $(this.time_bar);

		$e.val(time);
		
		let min = $e.attr('min');
		let max = $e.attr('max');
		let calc = (time - min) / (max - min);

		$e.css('background-image',
			'-webkit-gradient(linear, left top, right top,' +
			'color-stop(' + calc + ','+this.activeColor+'),' +
			'color-stop(' + calc + ','+this.nonActiveColor+'))'
		);
	}
	togglePlay(option = ''){
		const $play 	= $(this.play);
		const $pause 	= $(this.pause);

		if(option){
			$play.hide();
			$pause.hide();

			if(option === 'play') $play.show();
			else if (option === 'pause') $pause.show();
		}else {
			$play.toggle();
			$pause.toggle();
		}	
	}
	volumeChange(volume){
		const $e = $(this.volume_bar);

		$e.val(volume).trigger('change');//Update UI
	}
	updatePlayer(o = {cover:'defaultCover.jpg',title:'Loading...',info:'Artist - Album'}){
		this._$playerCover.attr('src',o.cover);
		this._$playerTitle.html(o.title);
		this._$playerInfo.html(o.info);
	}

	set(o){
		if(o){
			this.updateTime(0);
			this._$playerCover.attr('src',o.cover);
			this._$playerTitle.html(o.title);
			this._$playerInfo.html(o.artist[0] + ' - ' + o.album);
		}
	}
}

export default PlayerUI;
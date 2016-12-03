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
	}

	init(o = {}){
		this.setColor(o.activeColor, o.nonActiveColor)
		this._timeBarEvent(o.seek);
		this._volumeBarEvent(o.vol);
		this._repeatEvent();
		this._playEvent(o.play);
		this._pauseEvent(o.pause);
		this._shuffleEvent();
		this._volumeOnEvent(o.vol_on);
		this._volumeOffEvent(o.vol_off);
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
		const status = { re:false, re_one:false };

		$repeat.click(() => {
			if($repeat.hasClass('on')){
				$repeat.hide().removeClass('on');
				$repeat_one.show();

				status.re 		= false;
				status.re_one  = true;

				cb(status);
			} else {
				$repeat.addClass('on');

				status.re 		= true;
				status.re_one	= false;

				cb(status);
			}
		});

		$repeat_one.click(() => {
			$repeat_one.hide();
			$repeat.show();

			status.re 		= false;
			status.re_one  = false;

			cb(status);
		});
	}
	_playEvent(cb = ()=>{}){
		const $play 	= $(this.play);
		const $pause 	= $(this.pause);

		$play.click(() => {
			$play.hide();
			$pause.show();
			$pause.addClass('on');

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
		let 	status 	= false;

		$shuffle.click(() => {
			if($shuffle.hasClass('on')){
				$shuffle.removeClass('on');
				status = false;

				cb(status);
			} else {
				$shuffle.addClass('on');
				status = true;

				cb(status);
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
	togglePlay(){
		const $play 	= $(this.play);
		const $pause 	= $(this.pause);
		
		$play.toggle();
		$pause.toggle();
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
}

export default PlayerUI;
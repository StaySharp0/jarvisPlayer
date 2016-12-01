// import $ from 'jquery';

class UI {
	constructor(o = {}){
		this.time_bar		= o.time_bar;
		this.repeat			= o.repeat;
		this.repeat_one		= o.repeat_one;
		this.fast_rewind	= o.fast_rewind;
		this.play 			= o.play;
		this.pause 			= o.pause;
		this.fast_forward 	= o.fast_forward;
		this.shuffle 		= o.shuffle;
		this.volume_on 		= o.volume_on;
		this.volume_off 	= o.volume_off;
	}

	init(o = {}){
		this._timeEvent(o.seek,o.activeColor, o.nonActiveColor);
		this._repeatEvent();
		this._playEvent(o.play);
		this._pauseEvent(o.pause);
		this._shuffleEvent();
		this._volumeOnEvent(o.v);
		this._volumeOffEvent(o.v);
	}

	_timeEvent(cb,activeColor = '#ef3b5d', nonActiveColor = '#ccc'){
		this.activeColor 	= activeColor;
		this.nonActiveColor = nonActiveColor;

		const $e = $(this.time_bar);

		$e.change(() => {
			let min = $e.attr('min');
			let max = $e.attr('max');
			let time = $e.val();
			let calc = (time - min) / (max - min);

			cb(time);

			$e.css('background-image',
				'-webkit-gradient(linear, left top, right top,' +
				'color-stop(' + calc + ','+this.activeColor+'),' +
				'color-stop(' + calc + ','+this.nonActiveColor+'))'
			);
		});
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
		});
	}
	_volumeOffEvent(cb = ()=>{}){
		const $volume_on 	= $(this.volume_on);
		const $volume_off 	= $(this.volume_off);

		$volume_on.click(() => {
			$volume_on.hide();
			$volume_off.show();

			// this.volume = $volume.val();
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
}
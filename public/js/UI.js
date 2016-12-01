'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import $ from 'jquery';

var UI = function () {
	function UI() {
		var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, UI);

		this.time_bar = o.time_bar;
		this.repeat = o.repeat;
		this.repeat_one = o.repeat_one;
		this.fast_rewind = o.fast_rewind;
		this.play = o.play;
		this.pause = o.pause;
		this.fast_forward = o.fast_forward;
		this.shuffle = o.shuffle;
		this.volume_on = o.volume_on;
		this.volume_off = o.volume_off;
	}

	_createClass(UI, [{
		key: 'init',
		value: function init() {
			var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this._timeEvent(o.seek, o.activeColor, o.nonActiveColor);
			this._repeatEvent();
			this._playEvent(o.play);
			this._pauseEvent(o.pause);
			this._shuffleEvent();
			this._volumeOnEvent(o.v);
			this._volumeOffEvent(o.v);
		}
	}, {
		key: '_timeEvent',
		value: function _timeEvent(cb) {
			var _this = this;

			var activeColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#ef3b5d';
			var nonActiveColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#ccc';

			this.activeColor = activeColor;
			this.nonActiveColor = nonActiveColor;

			var $e = $(this.time_bar);

			$e.change(function () {
				var min = $e.attr('min');
				var max = $e.attr('max');
				var time = $e.val();
				var calc = (time - min) / (max - min);

				cb(time);

				$e.css('background-image', '-webkit-gradient(linear, left top, right top,' + 'color-stop(' + calc + ',' + _this.activeColor + '),' + 'color-stop(' + calc + ',' + _this.nonActiveColor + '))');
			});
		}
	}, {
		key: '_repeatEvent',
		value: function _repeatEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $repeat = $(this.repeat);
			var $repeat_one = $(this.repeat_one);
			var status = { re: false, re_one: false };

			$repeat.click(function () {
				if ($repeat.hasClass('on')) {
					$repeat.hide().removeClass('on');
					$repeat_one.show();

					status.re = false;
					status.re_one = true;

					cb(status);
				} else {
					$repeat.addClass('on');

					status.re = true;
					status.re_one = false;

					cb(status);
				}
			});

			$repeat_one.click(function () {
				$repeat_one.hide();
				$repeat.show();

				status.re = false;
				status.re_one = false;

				cb(status);
			});
		}
	}, {
		key: '_playEvent',
		value: function _playEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $play = $(this.play);
			var $pause = $(this.pause);

			$play.click(function () {
				$play.hide();
				$pause.show();
				$pause.addClass('on');

				cb();
			});
		}
	}, {
		key: '_pauseEvent',
		value: function _pauseEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $play = $(this.play);
			var $pause = $(this.pause);

			$pause.click(function () {
				$pause.hide();
				$play.show();

				cb();
			});
		}
	}, {
		key: '_shuffleEvent',
		value: function _shuffleEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $shuffle = $(this.shuffle);
			var status = false;

			$shuffle.click(function () {
				if ($shuffle.hasClass('on')) {
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
	}, {
		key: '_volumeOnEvent',
		value: function _volumeOnEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $volume_on = $(this.volume_on);
			var $volume_off = $(this.volume_off);

			$volume_off.click(function () {
				$volume_off.hide();
				$volume_on.show();
			});
		}
	}, {
		key: '_volumeOffEvent',
		value: function _volumeOffEvent() {
			var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var $volume_on = $(this.volume_on);
			var $volume_off = $(this.volume_off);

			$volume_on.click(function () {
				$volume_on.hide();
				$volume_off.show();

				// this.volume = $volume.val();
			});
		}
	}, {
		key: 'setDuration',
		value: function setDuration(time) {
			var $e = $(this.time_bar);
			$e.prop('max', time);
		}
	}, {
		key: 'updateTime',
		value: function updateTime(time) {
			var $e = $(this.time_bar);

			$e.val(time);

			var min = $e.attr('min');
			var max = $e.attr('max');
			var calc = (time - min) / (max - min);

			$e.css('background-image', '-webkit-gradient(linear, left top, right top,' + 'color-stop(' + calc + ',' + this.activeColor + '),' + 'color-stop(' + calc + ',' + this.nonActiveColor + '))');
		}
	}, {
		key: 'togglePlay',
		value: function togglePlay() {
			var $play = $(this.play);
			var $pause = $(this.pause);

			$play.toggle();
			$pause.toggle();
		}
	}]);

	return UI;
}();
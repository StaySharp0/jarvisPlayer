'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player() {
    var _this = this;

    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, Player);

    if (element === '') throw new TypeError('not include audio');

    this.$e = $(element);
    this.volume = 1;
    this.events = {
      statechange: function statechange(state) {
        console.log('state:', state);
      },
      error: function error(err) {
        console.log('err: ', err);
      },
      durationchange: function durationchange(duration) {
        console.log('duration: ', duration);
      },
      volumechange: function volumechange(volume) {
        console.log('volume: ', volume);
      },
      timeupdate: function timeupdate(time) {
        console.log('time:', time);
      }
    };

    this.$e.on('embedplayer:statechange', function (e) {
      _this.events.statechange(e.state);
    }).on('embedplayer:error', function (e) {
      _this.events.error(e.error);
    }).on('embedplayer:durationchange', function (e) {
      _this.events.durationchange(e.duration);
    }).on('embedplayer:volumechange', function (e) {
      if (e.volume) _this.volume = e.volume;

      _this.events.volumechange(e.volume);
    }).on('embedplayer:timeupdate', function (e) {
      _this.events.timeupdate(e.currentTime);
    }).embedplayer('listen'); // enable all events
  }

  _createClass(Player, [{
    key: 'play',
    value: function play() {
      this.$e.embedplayer('play');
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.$e.embedplayer('pause');
    }
  }, {
    key: 'seek',
    value: function seek(value) {
      this.$e.embedplayer('seek', value);
    }
  }, {
    key: 'vol',
    value: function vol(volume) {
      this.$e.embedplayer('volume', volume);
    }
  }, {
    key: 'vol_on',
    value: function vol_on() {
      this.$e.embedplayer('volume', this.volume);
    }
  }, {
    key: 'vol_off',
    value: function vol_off() {
      this.$e.embedplayer('volume', 0);
    }
    // prev() { this.$e.embedplayer('prev'); }
    // next() { this.$e.embedplayer('next'); }

  }, {
    key: 'setEnvets',
    value: function setEnvets(event, fn) {
      if (this.events[event]) {
        this.events[event] = fn;
      }
    }
  }]);

  return Player;
}();

// 	[1, 2, 3].map((x) => {
//   const y = x + 1;
//   return x * y;
// });
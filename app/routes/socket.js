const PlayerCtr = require('../controller/PlayerCtr');
const player = new PlayerCtr();

module.exports = (io) => {
	io.on('connection', function (socket) {;
		socket.on('continuous', () => {
			io.emit('updateList','continuous');
		});

		socket.on('songs', () => {
			io.emit('updateList','songs');
		});

		socket.on('get PlayList',() => {
			//Get Playlist
			//emit Playlist obj
			io.emit('update PlayList', 'PlayList Object');
		});
	});
};
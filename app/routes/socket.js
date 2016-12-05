const PlayerCtr = require('../services/Player');
const player = new PlayerCtr();

module.exports = (io) => {
	io.on('connection', function (socket) {
		socket.on('continuous', () => {
			let continuous = player.getContinuous();

			io.emit('updateList',continuous);
		});

		socket.on('songs', () => {
			let songs = player.getSongs();

			io.emit('updateList',songs);
		});

		socket.on('get PlayList',() => {
			let playlists = player.getPlayList();

			io.emit('update PlayList', playlists);
		});
	});
};
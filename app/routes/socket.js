const PlayerCtr = require('../services/Player');
const player = new PlayerCtr();
const fs 	 = require('fs');

module.exports = (io) => {
	io.on('connection', function (socket) {
		// socket.on('get Music', (title) => {
		// 	player.getMusic(title,(buf)=>{
		// 		socket.emit('set Music', buf);
		// 	});
		// });

		// socket.on('continuous', () => {
		// 	let continuous = player.getContinuous();

		// 	io.emit('updateList',continuous);
		// });

		// socket.on('songs', () => {
		// 	let songs = player.getSongs();

		// 	io.emit('updateList',songs);
		// });

		// socket.on('get PlayList',() => {
		// 	let playlists = player.getPlayList();

		// 	io.emit('update PlayList', playlists);
		// });

		// socket.on('add PlayList',PlayList => {
		// 	player.addPlayList(PlayList);
		// });

		
		player.getSongs();
		socket.on('scan directory', (dir) => {
			player.scan('hard',dir);
		});
	});
};
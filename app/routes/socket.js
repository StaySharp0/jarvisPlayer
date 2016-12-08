const PlayerCtr = require('../services/Player');
const player = new PlayerCtr();
const fs 	 = require('fs');

module.exports = (io) => {
	io.on('connection', function (socket) {
		var tmp = {
			songs: null
		}
		

		// socket.on('continuous', () => {
		// 	let continuous = player.getContinuous();

		// 	io.emit('updateList',continuous);
		// });

		// socket.on('get PlayList',() => {
		// 	let playlists = player.getPlayList();

		// 	io.emit('update PlayList', playlists);
		// });

		// socket.on('add PlayList',PlayList => {
		// 	player.addPlayList(PlayList);
		// });

		socket.on('set Music', (idx) => {
			console.log(idx)
			player.getMusic(idx, buf =>{
				socket.emit('set Music', {'idx':idx,'buf':buf});
			});
		});

		socket.on('songs', () => {
			if(tmp.songs) {
				socket.emit('update List',tmp.songs);
			} else {
				player.getSongs('',musics => {
					tmp.songs = musics;
					socket.emit('update List',tmp.songs);
				});
			}
		});

		// player.scan('hard','/Users/yongjunkim/Documents/genie 받은 폴더');
		socket.on('scan directory', (dir) => {
			player.scan('hard',dir);
		});
	});
};
const PlayerCtr = require('../services/Player');
const player = new PlayerCtr();

module.exports = (io) => {
	io.on('connection', function (socket) {
		var tmp = {
			songs: null
		}

		socket.on('get PlayList',key => {
			player.getPlayList(key).then(playlists =>{
				let event;

				if(key) event = 'update List';
				else event = 'update PlayList';

				socket.emit('update PlayList', playlists);

			});
		});

		socket.on('add PlayList',data => {
			player.addPlayList(data);

		});

		//get PlayList와 같은 패턴으로 정리 필요
		socket.on('set Music', (idx) => {
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

		socket.on('scan directory', (dir) => {
			player.scan('hard',dir);
		});
	});
};
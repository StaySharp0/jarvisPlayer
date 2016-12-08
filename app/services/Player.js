const PlayerModel = require('../models/Player');
const fs 		  = require('fs');

class PlayerCtr {
	constructor(){
		this._PlayerDAO = new PlayerModel();
	}

	scan(option = '', dir = ''){
		this._PlayerDAO.updateModel(option,dir);
	}
	_durationSecond(n) {
		n = n + '';
		return n.length >= 2 ? n : new Array(2 - n.length + 1).join('0') + n;
	}

	getSongs(title = '',cb = () =>{}){
		let musicInfo = this._PlayerDAO.getMusic();
		
		musicInfo.then(result => {
			var total_duration = 0;

			let musics = result.map(data =>{
				total_duration += data.duration;
				let min = parseInt(data.duration / 60);
				let sec = this._durationSecond(parseInt(data.duration % 60));
				return {
					index: 		data._id,
					title: 		data.title,
					artist: 	data.artist, //arr
					album: 		data.album,
					duration: 	min +':'+ sec,
					cover: 		data.cover
				}
			});

			let min = parseInt(total_duration / 60);
			let sec = this._durationSecond(parseInt(total_duration % 60));
			let rtn = {
				key		: 'Songs',
				title 	: 'Songs',
				desc 	: musics.length+' Songs - '+min +':'+ sec,
				musics 	: musics
			}

			cb(rtn);
		});
	}

	addPlayList(data = {}) {
		let playlist = new PlayList(data);

		this._PlayerDAO.addPlayList(playlist);
	}
	deletePlayList(title = ''){

		this._PlayerDAO.deletePlayList(title);
	}

	getMusic(idx ='',cb = ()=>{}) {
		let music = this._PlayerDAO.getMusic(idx);

		music.then(music => {
			fs.readFile(music[0].path,(error, binaryData)=>{
				cb(binaryData);
			});
		});
	}
}

module.exports = PlayerCtr;

/*
Default
가장 많이 재생한 곡
최근 재생한 곡
최근 추가한 곡
*/
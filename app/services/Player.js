const PlayerModel = require('../models/Player');
const fs 		  = require('fs');
const co 		  = require('co');

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

	_makeReturn(key,title,data = []){
		var total_duration = 0;

		let rtn = [{
			key		: key,
			title 	: title,
			desc 	: ''
		}]

		if(data.length !== 0){
			let musics = data.map(data =>{
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

			rtn[0].desc = musics.length+' Songs - '+min +':'+ sec;
			rtn[0].musics = musics;
		}

		return rtn;
	}

	getSongs(title = '',cb = () =>{}){
		let musicInfo = this._PlayerDAO.getMusic();
		
		musicInfo.then(result => {
			cb(this._makeReturn('Songs','Songs',result));
		});
	}

	addPlayList(data = {}) {
		return co.wrap(function *(service){
			service._PlayerDAO.addPlayList(data);
		})(this);
	}
	delPlayList(id = ''){
		return co.wrap(function *(service){

			service._PlayerDAO.deletePlayList(id);
		})(this);
	}
	editPlayList(data = {}){
		return co.wrap(function *(service){
			if(data.musics){
				data.musics = yield service._PlayerDAO.getMusic(data.musics);
			}

			service._PlayerDAO.modifyPlayList(data.key, data);
		})(this);
	}

	getMusic(idx ='',cb = ()=>{}) {
		let music = this._PlayerDAO.getMusic(idx);

		music.then(music => {
			fs.readFile(music[0].path,(error, binaryData)=>{
				cb(binaryData);
			});
		});
	}


	getPlayList(idx=''){
		return co.wrap(function *(service){
			let playList = yield service._PlayerDAO.getPlayList(idx);

			let rtn = playList.map(data => {
				let rtn = service._makeReturn(data._id,data._title,data._musics);				
				
				rtn[0].subTitle = data._subTitle;
				rtn[0].desc 	 = data._desc;
				rtn[0].option   = true;
				
				return rtn[0];
			});

			console.log(rtn[0].musics);
			return rtn;
		})(this);
	}

	searchMusic(keyword=''){
		return co.wrap(function *(service){
			let musics = yield service._PlayerDAO.searchMusic(keyword);
			let title = 'Search By "'+keyword+'"';

			let rtn = service._makeReturn('search',title,musics);

			return rtn;
		})(this);
	}
}

module.exports = PlayerCtr;

/*
Default
가장 많이 재생한 곡
최근 재생한 곡
최근 추가한 곡
*/
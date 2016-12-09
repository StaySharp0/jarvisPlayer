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

	_makeReturn(key,title,data = {}){
		var total_duration = 0;

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
		let rtn = [{
			key	: key,
			title 	: title,
			desc 	: musics.length+' Songs - '+min +':'+ sec,
			musics 	: musics
		}];

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
		return co.wrap(function *(){

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
				return {
					key 	: data._id,
					title 	: data._title,
					subTitle: data._subTitle,
					desc 	: data._desc,
					musics 	: data._musics,
					option	: true
				}
			});

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
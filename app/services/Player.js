//import PlayList Class
const PlayerModel = require('../models/Player');
const PlayList 	= require('../objects/PlayList');

class PlayerCtr {
	constructor(){
		this._PlayerDAO = new PlayerModel();
	}

	scan(option = '', dir = ''){
		this._PlayerDAO.updateModel(option,dir);
	}

	getSongs(){
		let musics = this._PlayerDAO.getMusic();

		console.log(musics);
	}

	// getPlayList(){
	// 	return this._PlayerDAO.getPlayList();
	// }

	

	// getContinuous() {
		
	// 	return this._PlayerDAO.getList('continuous');
	// }

	// addPlayList(data = {}) {
	// 	let playlist = new PlayList(data);

	// 	this._PlayerDAO.addPlayList(playlist);
	// }


	// getMusic(title ='',cb = ()=>{}) {
	// 	let musicObj =this._PlayerDAO.getMusic(title);

	// 	cb(musicObj.buf);
	// }

}

module.exports = PlayerCtr;

/*
Default
가장 많이 재생한 곡
최근 재생한 곡
최근 추가한 곡
*/
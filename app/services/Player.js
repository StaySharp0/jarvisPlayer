//import PlayList Class
const PlayerModel = require('../models/Player');

class PlayerCtr {
	constructor(){
		this._PlayerDAO = new PlayerModel();
	}

	sacn(option = '', dir = ''){
		this._PlayerDAO.updateModel(option,dir);
	}

	getPlayList(){
		return this._PlayerDAO.getPlayList();
	}

	getSongs(){
		return this._PlayerDAO.getList('songs');
	}

	getContinuous() {
		
		return this._PlayerDAO.getList('continuous');
	}

}

module.exports = PlayerCtr;

/*
Default
가장 많이 재생한 곡
최근 재생한 곡
최근 추가한 곡
*/
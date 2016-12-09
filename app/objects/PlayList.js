class PlayList {
	constructor(o = { title:'',subTitle:'',desc:'',musics:[] }){
		this._title 	= o.title;
		this._subTitle 	= o.subTitle;
		this._musics 	= o.musics;
		this._desc 		= '';
	}

	setTitle(txt = '') { 
		if(txt) this._title = txt; 
	}
	setSubTitle(txt = '') { 
		if(txt) this._subTitle = txt; 
	}

	static _durationSecond(n){
		n = n + '';
		return n.length >= 2 ? n : new Array(2 - n.length + 1).join('0') + n;
	}

	static getDesc(musics = []){
		let count = musics.length;
		let playtime = 0;
		
		musics.map((music) => {
			playtime += music.duration;
		});

		let min = parseInt(playtime / 60);
		let sec = this._durationSecond(parseInt(playtime % 60));

		// x Songs - xx:xx
		return count +' Songs - '+min +':'+ sec;
	}


	setMusics(o = []) {
		this._musics = o.musics;
	}

	getTitle() { return this._title; }
	getSubTitle() { return this._subTitle; }
	getMusic() { return this._musics; }
}

module.exports = PlayList;
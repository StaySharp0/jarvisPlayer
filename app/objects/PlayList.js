class PlayList {
	constructor(o = { title:'',subTitle:'',desc:'',musics:[] }){
		this._title 	= o.title;
		this._subTitle 	= o.subTitle;
		this._musics 	= o.musics;
		
		this.setDesc(o.subTitle);
	}

	setTitle(txt = '') { 
		if(txt) this._title = txt; 
	}
	setSubTitle(txt = '') { 
		if(txt) this._subTitle = txt; 
	}

	setDesc(txt = ''){
		if(text.legnth){
			let count = this.musics.legnth;
			let playtime = 0;
			
			this.musics.map((music) => {
				playtime += music.duration;
			});

			// x Songs - xx:xx
			this._desc = count +' Songs - '+playtime
		} else {
			this._desc = txt;	
		}
	}

	setMusics(o = []) {
		this._musics = o.musics;
	}

	getTitle() { return this._title; }
	getSubTitle() { return this._subTitle; }
	getMusic() { return this._musics; }
}

module.exports = PlayList;
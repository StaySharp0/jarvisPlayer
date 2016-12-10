const Datastore = require('nedb');
const PlayList 	= require('../objects/PlayList');
const Music 	= require('../objects/Music');
const fs 		= require('fs');
const path		= require('path');


class PlayerModel {
	constructor(){
		if (!fs.existsSync('./data')) fs.mkdirSync('./data');
		if (!fs.existsSync('./data/cover')) fs.mkdirSync('./data/cover');

		this._coverPath = './data/cover/'
		this._db = new Datastore({ filename: './data/database.db', autoload: true });
		this._music_cnt = 0;
		// this._playlist_cnt = 0;
		this._playlist_title = [];
		
		
		if(!fs.existsSync(this._coverPath)){
			fs.mkdirSync(this._coverPath);
		}
		// Music Count
		this._db.count({ _type:'music' }, (err, count) => {
			this._music_cnt = count;
			console.log('Music count: '+this._music_cnt);
		});
		//Initialize titles
		this._db.find({ _type : 'PlayList'}, (err,docs) => {
			//this._playlist_title = new Array(docs.length);
			// this._playlist_cnt = docs.length;
			for(let i = 0; i < docs.length ; i++){
				this._playlist_title[i] = {title: docs[i]._title, id: docs[i]._id};
			}		
		});
		
	}
	_scan(option =  '',dir = '',filelists = []){
		let files 		= fs.readdirSync(dir);
		let fileList 	= filelists;

		files.forEach(file => {
			let filePath = path.join(dir,file);

            if (fs.statSync(filePath).isDirectory() && option === 'hard') {
                fileList = this._scan(option,filePath, fileList);
            }
            else if(path.extname(filePath) === '.mp3') {
                fileList.push(filePath);
            }
        });

        return fileList;
	}
	updateModel(option = '', dir = ''){
		if(!dir) return;

		let musicFiles = this._scan('hard',dir);
		let initMusic = new Promise((resolve, reject)=>{
			this._db.remove({},{ multi: true }, (err,numRemoved) => {
				this._music_cnt = 0;
				this._playlist_title = [];
				if (err) return reject(err);
				resolve();
			});
		});
		
		let insertMusic = musicFiles.map(MusicPath => {
			let music = new Music(MusicPath,this._coverPath);

			return this._insertMusic(music);
		});

		return Promise.all([initMusic, insertMusic]);
	}
	_insertMusic(music = {}){
		music._type = 'music';
		music._id 	= ++this._music_cnt;
		
		return new Promise((resolve, reject)=>{
			this._db.insert(music, function (err, newDoc) {
				if (err) return reject(err);
				resolve();
			});
		});
		
	}

	_getMusic(idx,regex){
		return new Promise((resolve, reject) => {
			const searchObj = { _type: 'music' };
			if(idx) {
				if(idx.constructor == Array){
					searchObj.$or = idx.map(data => {
						return { _id:data };
					});
				} else {
					searchObj._id = idx;	
				}
			}
			if(regex){
				searchObj.$or = [
					{title : {$regex : regex}},
					{artist : {$regex : regex}},
					{album : {$regex : regex}}
				];
			}
			console.log(searchObj);
			this._db.find(searchObj, function (err, music) {
				if (err) return reject(err);
        			resolve(music ? music : null);
			});
		});
	}

	getMusic(idx){
		return this._getMusic(idx);
	}

	searchMusic(keyword){//title, artist, album
		let regex = null;//new RegExp('');
		if(keyword && keyword.length >= 2){
			regex = new RegExp('(' + keyword + ')','i');
		}
		return this._getMusic(undefined, regex);
	}

	getPlayList(id = ''){		
		return new Promise((resolve, reject) => {
			const searchObj = {_type : 'PlayList'};
			if(id){
				searchObj._id = id;
			}	
			this._db.find(searchObj, (err,docs) =>{
				if(err){
					reject(err);
				}
//				console.log(docs);				
				resolve(docs ? docs : null);	
			});	
		});
	}

	modifyPlayList(id = '',o = {title : '',subTitle : ''}){
		return new Promise((resolve, reject) => {
			if(!id){
				return reject();
			}
			const searchObj = {_type : 'PlayList', _id : id};
			const updateObj = {$set : {}};
			if(o.title){
				updateObj.$set._title = o.title;
			}
			if(o.subTitle){
				updateObj.$set._subTitle = o.subTitle;
			}	
			if(o.musics != undefined && o.musics.constructor == Array){
				updateObj.$set._musics = o.musics;
				updateObj.$set._desc   = PlayList.getDesc(o.musics);

			}
			this._db.update(searchObj, updateObj, {}, (err,numReplaced)=>{
				if(err){
					reject(err);
				} 
				resolve();
			});
		});
	}

	addPlayList(data = {}){
		return new Promise((resolve, reject) => {
			let playlist = new PlayList(data);

			console.log(this._playlist_title);
		 	for(let i = 0; i < this._playlist_title.length; i++){

			 	if(this._playlist_title[i].title == playlist.getTitle()){
			 		console.log("title already exists!");
			 		return reject();
			 	}
		 	}
			playlist._type = 'PlayList';

			this._db.insert(playlist,(err,newDoc) => {
				if(err){
					reject(err);
				}

				this._playlist_title.push({
			 		title : newDoc._title,
					id    : newDoc._id
		 		});
				// this._playlist_cnt++;
				resolve();
				//this._playlist_title.push( new PlayList(newDoc).getTitle());
				//console.log(newDoc);
			});
		});
	}
	 
	deletePlayList(id = ''){
		return new Promise((resolve, reject) => {
			 if(!id){
				 reject();
			 }
			 this._db.remove({_type : 'PlayList', _id : id},{}, (err,numRemoved) => {
			 	if(err){
			 		reject(err);
			 	}
				 if(numRemoved){
				 	this._playlist_title.forEach( (data,idx) => {
				 		if(data.id === id) this._playlist_title.splice(idx,1);
				 		console.log(this._playlist_title)
				 	});
				 	resolve();					
				 }
			 });
		});	
	}
}

module.exports = PlayerModel;

/*

1. 오디오 스트리밍 구현
2. 플레이리스 만들고 삭제하고 수정하는 기능
3. 


*/
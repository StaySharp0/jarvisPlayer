const Datastore = require('nedb');
const PlayList 	= require('../objects/PlayList');
const Music 	= require('../objects/Music');
const fs 		= require('fs');
const path		= require('path');


class PlayerModel {
	constructor(){
		this._coverPath = './data/cover/'
		this._db = new Datastore({ filename: './data/database.db', autoload: true });
		this._music_cnt = 0;
		this._playlist_cnt = 0;
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
			this._playlist_cnt = docs.length;
			for(let i = 0; i < docs.length ; i++){
				this._playlist_title[i] = docs[i]._title;
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
		this._db.remove({_type:'music'},{ multi: true }, (err,numRemoved) => {
			this._music_cnt -= numRemoved;

			let musicFiles = this._scan('hard',dir);
			let musics = musicFiles.forEach(MusicPath => {
				new Music(MusicPath,this._coverPath,(music) => {
					this._insertMusic(music);
				});
			});
		});
	}
	_insertMusic(music = {}){
		music._type = 'music';
		music._id 	= ++this._music_cnt;

		this._db.insert(music, function (err, newDoc) {
			console.log(newDoc);
		});
	}

	getMusic(idx){
		return new Promise((resolve, reject) => {
			const serchObj = { _type: 'music' };
			if(idx) serchObj._id = idx;

			this._db.find(serchObj, function (err, music) {
				if (err) return reject(err);
        		resolve(music ? music : null);
			});
		});
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

	modifyPlayList(id = '',o = {title : '',subtitle : ''}){
		return new Promise((resolve, reject) => {
			if(!id){
				return reject();
			}
			const searchObj = {_type : 'PlayList', _id : id};
			const updateObj = {$set : {}};
			if(o.title){
				updateObj.$set._title = o.title;
			}
			if(o.subtitle){
				updateObj.$set._subtitle = o.subtitle;
			}	
			if(o.musics != undefined && o.musics.constructor == Array){
				updateObj.$set._musics = o.musics;
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

		 	for(let i = 0; i < this._playlist_title.length; i++){
			 	if(this._playlist_title[i] == playlist.getTitle()){
			 		console.log("title already exists!");
			 		return reject();
			 	}
		 	}
		 	this._playlist_title.push(playlist.getTitle());
			playlist._type = 'PlayList';
			playlist._id = 'pl_' + ++this._playlist_cnt;			
			this._db.insert(playlist,(err,newDoc) => {
				if(err){
					reject(err);
				}
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
			 this._playlist_cnt--;		 
			 this._db.remove({_type : 'PlayList', _id : id},{}, (err,numRemoved) => {
			 	if(err){
			 		reject(err);
			 	}
				 if(numRemoved){
				 	console.log('Playlist "' + title + '" has been removed.');
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
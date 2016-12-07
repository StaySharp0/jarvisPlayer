const Datastore = require('nedb');
const PlayList 	= require('../objects/PlayList');
const Music 	= require('../objects/Music');
const fs 		= require('fs');
const path		= require('path');

class PlayerModel {
	constructor(){
		this._coverPath = './data/cover/'
		this._db = new Datastore({ filename: './data/database.db', autoload: true });
		this._count = 0;
		this._playlist_title;
		
		
		if(!fs.existsSync(this._coverPath)){
			fs.mkdirSync(this._coverPath);
		}
		// Music Count
		this._db.count({ _type:'music' }, (err, count) => {
			this._count = count;
			console.log('Music count: '+this._count);
		});
		//Initialize titles
		this._db.find({ _type : 'PlayList'}, (err,docs) => {
			this._playlist_title = new Array(docs.length);
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
			this._count -= numRemoved;

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
		music._id 	= ++this._count;

		this._db.insert(music, function (err, newDoc) {
			console.log(newDoc);
		});
	}
	
/*
	getMusic(title = ''){
		 //var rtn;
		 if(title){ 	// get Title music 
		 	this._db.find({ 'title': title }, function (err, music) {
		 		return music;
		 	});
		 } else { 	// get All Music
		 	new Promise(function(resolve,reject){
		 		this._db.find({ _type: 'music' }, function (err, musics) {
		 			if(err) reject(err);
		 			else 	resolve(musics);
		 		});
		 	}).then(musics);			
		 }
		 
	}
*/
/*	 getPlayList(title = ''){
		if(title){
			
		}
	 	this.db.find({ 'type': 'PlayList' }, function (err, docs) {
		});
	 }
*/
	// getList(title){
	// 	this.db.find({ 'title': title }, function (err, docs) {
	// 	});
	// }
	 addPlayList(data = {}){		
		 let me = this;

	 	for(let i = 0; i < this._playlist_title.length; i++){
		 	if(this._playlist_title[i] == data.getTitle()){
		 		console.log("title already exists!");
		 		return;
		 	}
	 	}
		data._type = 'PlayList';			
		this._db.insert(data,function(err,newDoc){
			me._playlist_title.push( new PlayList(newDoc).getTitle());
			//console.log(newDoc);
		});
	 }
	 
	 deletePlayList(title = ''){
		 if(!title){
			 return;
		 }		 
		 this._db.remove({_type : 'PlayList', _title : title},{}, function(err,numRemoved){
			 if(numRemoved){
				 console.log('Playlist "' + title + '" has been removed.');
			 }
		 });
	 }

	
}

module.exports = PlayerModel;

/*

1. 오디오 스트리밍 구현
2. 플레이리스 만들고 삭제하고 수정하는 기능
3. 


*/
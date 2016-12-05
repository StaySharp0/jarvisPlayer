const Datastore = require('nedb');
const PlayList 	= require('../objects/PlayList');
const Music 	= require('../objects/Music');
const fs 		= require('fs');
const path		= require('path');


class PlayerModel {
	constructor(){
		console.log('Player Model init');
		this.db = new Datastore({ filename: '../data.db', autoload: true });
		
		this.updateModel();
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
                fileList.push({'name':file, 'path':filePath});
            }
        });

        return fileList;
	}
	updateModel(option = '', dir = ''){
		if(!dir) return;

		let musicFiles = this._scan('hard',dir);
		let musics = musicFiles.map(music => {
			let song = new Music(music.title,music.path);
			song.type = 'music';

			return song;
		});

		this.insertMusic(musics);
	}

	getPlayList(){
		this.db.find({ 'type': 'PlayList' }, function (err, docs) {
		});
	}

	getList(title){
		this.db.find({ 'title': title }, function (err, docs) {
		});
	}

	insertMusic(musics = []){
		this.db.insert(musics, function (err, newDoc) {  

		});
	}
}

module.exports = PlayerModel;

/*

1. 오디오 스트리밍 구현
2. 플레이리스 만들고 삭제하고 수정하는 기능
3. 


*/
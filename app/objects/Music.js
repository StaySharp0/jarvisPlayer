const fs = require('fs');
const mm = require('musicmetadata');
// var iconv  = require('iconv-lite');

class Music {
	constructor(path = '', coverPath = ''){
		let read_stream = fs.createReadStream(path);
		let parser = mm(read_stream,{duration : true}, (err, data) => {
			if(err){
				this.valid = false;
				throw err;
			}
			this.path = path;
			this.valid = true;
			this.title = data.title;
			this.artist = data.artist;//array
			this.album = data.album;
			this.album_artist = data.albumartist;//array
			this.year = data.year;
			this.track_num = data.track.no;
			this.disk_num = data.disk.no;
			this.gerne = data.gerne;//array
			this.art_format = data.picture[0].format;//picture is an array
			this.duration = data.duration;
			this.coverPath = coverPath+this.title +'.'+ this.art_format;
			this.cover = this.title +'.'+ this.art_format;
			fs.writeFileSync( this.coverPath, data.picture[0].data);
			read_stream.close();
		});		
	}
}

module.exports = Music;

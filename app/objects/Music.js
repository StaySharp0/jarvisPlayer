const fs = require('fs');
const mm = require('musicmetadata');
// var iconv  = require('iconv-lite');

class Music {
	constructor(path = '', coverPath = '', cb = ()=>{}){
		let me = this;
		let read_stream = fs.createReadStream(path);
		let parser = mm(read_stream,{duration : true}, (err, data) => {
			if(err){
				me.valid = false;
				throw err;
			}
			me.path = path;
			me.valid = true;
			me.title = data.title;
			me.artist = data.artist;//array
			me.album = data.album;
			me.album_artist = data.albumartist;//array
			me.year = data.year;
			me.track_num = data.track.no;
			me.disk_num = data.disk.no;
			me.gerne = data.gerne;//array
			me.art_format = data.picture[0].format;//picture is an array
			me.duration = data.duration;
			me.coverPath = coverPath+me.title +'.'+ me.art_format;
			me.cover = me.title +'.'+ me.art_format;
			fs.writeFileSync( me.coverPath, data.picture[0].data);
			read_stream.close();
			cb(me);
		});		
	}
}

module.exports = Music;

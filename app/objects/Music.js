const fs = require('fs');
const mm = require('musicmetadata');

class Music {
	constructor(path){
			let me = this;
			let read_stream = fs.createReadStream(path);
			let parser = mm(read_stream, function(err, data){
				if(err){
					me.valid = false;
					throw err;
				}
				me.valid = true;
				me.title = data.title;
				me.artist = data.artist;//arr
				me.album = data.album;
				me.album_artist = data.albumartist;//arr
				me.year = data.year;
				me.track_num = data.track.no;
				me.disk_num = data.disk.no;
				me.gerne = data.gerne;//arr
				me.art_format = data.picture.format;
				me.duration = data.duration;
				fs.writeFileSync( (path.substring( 0 , path.lastIndexOf('.') )  + '.' + me.art_format), data.picture.data);
				read_stream.close();				
			});		
	}
}

module.exports = Music;

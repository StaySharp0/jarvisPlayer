import listTpl from './tpl/list-tpl.handlebars'
import playListTpl from './tpl/list-tpl.handlebars'
import * as io from 'socket.io-client';


class LayoutUI {
	constructor( o  = { url:'' ,side:'', playlist:'', main:'', player:''} ){	
		this.side 		= o.side;
		this.playlist 	= o.playlist;
		this.main 		= o.main;
		this.player 	= o.player;

		//init script materialize-css 
		$('.modal').modal();
		
		this.init(o.url);
	}

	init(url = ''){
		if(url === 0) throw new TypeError("can't contact server!");
		this.url = url;

		const socket = io.connect(this.url);
		
		this._setSocketRoute(socket);
		this._SideNavEvent(socket);
		this._PlayListEvent(socket);

		socket.emit('get PlayList');
	}

	_SideNavEvent(socket){
		const $sideNavItems = $(this.side).find('.side-item');
		const $playlist 	= $(this.playlist);
		const $playListItems= $(this.playlist).find('.playList-item');
		

		$sideNavItems.click(function() {
			if($(this).hasClass('on')) return;

			$sideNavItems.removeClass('on');
			$(this).addClass('on');

			let event = $(this).data('event');

			socket.emit(event);

			if(event === 'playlist') $playlist.show();
			else {
				$playListItems.removeClass('on');
				$playlist.hide();
				
			}
		});

		$sideNavItems.eq(0).trigger('click');
	}
	_PlayListEvent(socket){
		const $playListItems = $(this.playlist).find('.playList-item');

		$(document).on('click',$playListItems,function(e) {
			if($(e.target).hasClass('on')) return;

			$playListItems.removeClass('on');
			$(e.target).addClass('on');

			let event 	= $(e.target).data('event');
			let key 	= $(e.target).data('key'); 

			socket.emit(event,key);
		});
	}

	_setSocketRoute(socket){
		socket.on('update PlayList', (data) => {
			console.log(data);
		});

		socket.on('update MusicList', (data) => {
			console.log(data);
		});
	}
	updatePlayList(o = {}){

		$(this.player).childere('');
	}
	updateList(o = {}){
		$('main').html(listTpl(o));
	}
	

	
}

export default LayoutUI;


/*
o  = {
	side: {
		element: 'DomObject',
		playList: [{ title:'Title', subTitle:'Sub Title', desc:'X Songs - XX:XX', musicList:[] }]
	},
	main: {
		element: 'DomObject'
		//resue Object playlist.o
	},
	player: {
		element: 'DomObject',
		o: { title:'Song', info:'Artist - Album', coverPath: 'defaultCover.jpg'}
	}
}
*/
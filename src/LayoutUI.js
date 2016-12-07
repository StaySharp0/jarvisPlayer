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
		const stream = ss.createStream();
		
		this._SetSocketRoute(socket);
		this._SideNavEvent(socket);
		this._PlayListEvent(socket);
		this._SettingEvent(socket);

		socket.emit('get PlayList');
		socket.emit('scan directory');

		socket.on('set Music',(buffer)=>{
			let data = new Uint8Array(buffer);
			let blob = new Blob([data], { 'type' : 'audio/mp3' });
			let url  = URL.createObjectURL(blob);

			$('#audio').attr('src',url);
		});
	}


	_SettingEvent(socket){
		$(document).on('click','#scan-directory',() => {
			let data = $('#ipt_directory').val();

			socket.emit('scan directory', data);
		});
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

		//Get PlayList's music list
		$(document).on('click',$playListItems,function(e) {
			if($(e.target).hasClass('on')) return;

			$playListItems.removeClass('on');
			$(e.target).addClass('on');

			let event 	= $(e.target).data('event');
			let key 	= $(e.target).data('key'); 

			socket.emit(event,key);
		});


		//Add PlayList
		$(document).on('click','#add-playlist',() => {
			let obj = {
				title: 	  $('#add-ipt_title').val(),
				subTitle: $('#add-ipt_subtitle').val()
			};
			
			socket.emit('add PlayList', obj);

			$('#add-ipt_title').val('').removeClass('on valid');
			$('#add-ipt_subtitle').val('').removeClass('on valid');
		});

		$(document).on('click','#rename-playlist',() => {
			let obj = {
				title: 	  $('#rename-ipt_title').val(),
				subTitle: $('#rename-ipt_subtitle').val()
			};
			
			console.log(obj);
			// socket.emit('rename PlayList', obj);

			$('#rename-ipt_title').val('').removeClass('on valid');
			$('#rename-ipt_subtitle').val('').removeClass('on valid');
		});

		$(document).on('click','#del-playlist',() => {

			// socket.emit('del PlayList', obj);
			console.log('del');
		});
	}
	_SetSocketRoute(socket){
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

		$('main .modal').modal();
	}
	

	
}

export default LayoutUI;
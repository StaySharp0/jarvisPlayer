import listTpl from './tpl/list-tpl.handlebars'
import playListTpl from './tpl/list-tpl.handlebars'
import * as io from 'socket.io-client';


class LayoutUI {
	constructor( o  = { url:'' ,side:'', playlist:'', main:'', player:''} ){	
		this.side 		= o.side;
		this.playlist 	= o.playlist;
		this.main 		= o.main;
		this.player 	= o.player;
		this.url 		= o.url;
		
		$('.modal').modal();
	}

	init(playerUI,player){
		if(this.url === 0) throw new TypeError("can't contact server!");
		const socket = io.connect(this.url);
		
		player.setSocket(socket);
		this._SetSocketRoute(socket,playerUI,player);

		this._ListEvent(socket,playerUI,player);
		this._SideNavEvent(socket);
		this._PlayListEvent(socket);
		this._SettingEvent(socket);

		socket.emit('get PlayList');

	}
	_ListEvent(socket,playerUI,player) {
		$(document).on('click','.music-tr',(e) => {
			if(player.getListKey !== this._updateList.key){
				player.setList(this._updateList);
			}

			let idx = $(e.currentTarget).data('index');
			
			if(player.getIndex().musicIndex === idx) return false;

			player.setIndex(idx);
			playerUI.set(player.getMusicInfo(idx));

			socket.emit('set Music', idx);
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
			if($(e.currentTarget).hasClass('on')) return;

			$playListItems.removeClass('on');
			$(e.currentTarget).addClass('on');

			let event 	= $(e.currentTarget).data('event');
			let key 	= $(e.currentTarget).data('key'); 

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
	_SetSocketRoute(socket,playerUI,player){
		socket.on('set Music',buffer=>{
			player.setMusic(buffer);
		});

		socket.on('update PlayList', (data) => {
			console.log(data);
		});

		socket.on('update List', data => {
			this._updateList = data;
			this.updateList(data);
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
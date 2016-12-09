import listTpl from './tpl/list-tpl.handlebars';
import playListTpl from './tpl/playlist-tpl.handlebars';
import addMusicItemTpl from './tpl/addMusic-tpl.handlebars';
import * as io from 'socket.io-client';


class LayoutUI {
	constructor( o  = { url:'' ,side:'', playlist:'', main:'', player:''} ){
		this.form 		= o.form;
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

		this._SearchEvnet(socket)
		this._ListEvent(socket,playerUI,player);
		this._SideNavEvent(socket);
		this._PlayListEvent(socket);
		this._SettingEvent(socket);

		socket.emit('get PlayList');

	}
	_SearchEvnet(socket){
		$(this.form).submit(e => {
			let keyword = $(this.form).find('input').val();

			socket.emit('search Music', keyword);
			return false;
		})
	}
	_ListEvent(socket,playerUI,player) {
		$(document).on('click','.music-tr',(e) => {
			let idx = $(e.currentTarget).data('index');
			let key = $('.container').data('key');

			if(player.getListKey() !== this._updateList.key){
				player.setList(this._updateList);
			}
			
			player.setIndex(idx);
			player.play(idx);
			playerUI.set(player.getMusicInfo(idx));		
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

		$sideNavItems.click(function() {
			if($(this).hasClass('on')) return;

			$sideNavItems.removeClass('on');
			$(this).addClass('on');

			let event = $(this).data('event');

			socket.emit(event);

			if(event === 'playlist') $playlist.show();
			else {
				$playlist.hide();
				$('.playlist-item').removeClass('on');
			}
		});

		$sideNavItems.eq(0).trigger('click');
	}
	_PlayListEvent(socket){

		//Get PlayList's music list
		$(document).on('click','.playlist-item',function(e) {
			if($(e.currentTarget).hasClass('on')) return;

			$('.playlist-item').removeClass('on');
			$(e.currentTarget).addClass('on');

			let key 	= $(e.currentTarget).data('key'); 

			socket.emit('get PlayList',key);
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

		//Rename PlayList
		$(document).on('click','#rename-playlist',() => {
			let obj = {
				key: 	  $('.container').data('key'),
				title: 	  $('#rename-ipt_title').val(),
				subTitle: $('#rename-ipt_subtitle').val()
			};
			
			socket.emit('edit PlayList', obj);

			$('#rename-ipt_title').val('').removeClass('on valid');
			$('#rename-ipt_subtitle').val('').removeClass('on valid');
		});

		//Del PlayList
		$(document).on('click','#del-playlist',() => {
			let key = $('.container').data('key');
			
			socket.emit('del PlayList',key);

			$(this.main).html('');
		});

		//Add PlayList Miusi
		$(document).on('click','#add-music',() => {
			let key = $('.container').data('key');
			let musics = [];

			$('#frm-Music2playlist [type=checkbox]:checked').map((idx,e) => {
				musics.push($(e).data('index'));
			});
			
			socket.emit('edit PlayList', {key:key, musics : musics});
		});
	}
	_SetSocketRoute(socket,playerUI,player){
		socket.on('set Music',(data) =>{
			player.setMusic(data.idx,data.buf);
		});

		socket.on('update PlayList', data => {
			this.updatePlayList(data);
		});

		socket.on('update List', data => {
			this._updateList = data[0];
			this.updateList(data[0]);

			if(data[0].key === 'search'){
				$(this.playlist).hide();
				$('.side-item').removeClass('on');
				$('.playlist-item').removeClass('on');
			} else if (data[0].key === 'Songs'){
				$('#frm-Music2playlist').html(addMusicItemTpl(data[0]));
			}
		});
	}
	updatePlayList(o = {}){
		$(this.playlist).html(playListTpl(o));

		let key = $('.container').data('key')
		$('.playlist-item').map((idx,e)=>{
			if( $(e).data('key') === key ) $(e).addClass('on');
		});
	}
	updateList(o = {}){
		$(this.main).html(listTpl(o));

		$('main .modal').modal();
		$('main .dropdown-button').dropdown();
	}
}

export default LayoutUI;
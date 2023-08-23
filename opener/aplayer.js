/**
 * Open with aPlayer?
 */

{
    // aPlayer无需盒子
    var player;
    let box = document.createElement('div'),add = function(path,autoplay=false){
        let audios = player.list.audios,
            aid = audios.length;
        for (var i = 0; i < audios.length; i++)
            if(audios[i].url == path)
                return autoplay?player.list.switch(i):false;
        var base = $.tool.base(path),
            res = $.list.matchFirst(base,'image') || $.list.matchFirst('cover','image'),
            cover = res == undefined ? '' : res.path,
            res2 = $.list.matchFirst(base,'lyrics'),
            lrc = res2 == undefined ? '' : res2.path;
        if(typeof lrc == 'string' && CONFIG.debug)
            console.log('APlayer:new lyrics inserted');
        player.list.add({
            name: decodeURIComponent($.tool.base(path)),
            artist: '未知',
            lrc: lrc,
            url: path,
            cover: cover
        });
        if(autoplay) player.list.switch(aid);
        player.play();
    };
    document.body.append(box);
    // API
    let pl = $.tool.add(`<svg viewBox="0 0 16 16">
      <path fill="#009688" d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
      <path fill="#009688" fill-rule="evenodd" d="M12 3v10h-1V3h1z"/>
      <path fill="#009688" d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/>
      <path fill="#c2cd57" fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
    </svg>`,'全部加入播放列表',function(){
        let music = $.list.match('*','audio');
        for (var i = 0; i < music.length; i++)
            add(music.next().path,i==0);
        this.hidden = true;
    });
    $.list.onload(() => pl.hidden = false);
    // 初始化
    $.module.bind('audio',async function (path){
        if(typeof APlayer == 'undefined'){
            await $.module.css('https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.css');
            await $.module.load('https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js');
            player = new APlayer({
                container : box,
                fixed : true,
                audio : []
            });
        }
        add(path,true);
    });
}
/**
 * Open with artPlayer
 */
{
    var video;
    let vbox,prefix = '',vlist = [],vcurr = -1,loop = false,update = function(path){
        // 预检查
        if(typeof path != 'string')
            throw new TypeError('PATH can only be a string,but '+typeof path+' was given.');
        // 扫描字幕
        var subs = $.list.matchFirst($.tool.base(path),'subtitle'),
            sub = subs == undefined ? undefined : subs.path;
        // PREFIX变了
        if(prefix != VIEW.contentDocument.location.pathname){
            // 刷新视频列表
            vlist = [...$.list.match('*','video')];
            // 找到当前列表
            for (var i = 0; i < vlist.length; i++) {
                if(vlist[i].path == path) {
                    if(CONFIG.debug) console.log('Video switchTo:"',vlist[i].name,'"(NO.',i,')');
                    vcurr = i;break;
                }
            }
            prefix = VIEW.contentDocument.location.pathname;
        }
        // 刷新视频信息
        video.subtitle.url = sub || '';
        video.switchUrl(path);
        $.tool.show(vbox);
        // 刷新视频列表
        let nList = [];
        for (var i = 0; i < vlist.length; i++) {
            let now = {
                path : vlist[i].path,
                html : vlist[i].name
            };
            if(vlist[i].path == path) now.default = true;
            nList.push(now);
        }
        // video.setting.option[video.setting.option.length-1].selector = nList;
        video.setting.update({
            name: 'playlists',
            selector: nList,
            onSelect: function (item) {
                if(item.path == undefined)
                    return console.log('Failed to set:NULL element');
                console.log('VideoList checked:',item.html);
                update(item.path);
            }
        });
        if(CONFIG.debug) console.log('Push ',nList.length,' to ART.',nList);
    },opener = {
        // 扩展解码器：M3U8
        hls:async function(video,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.0/hls.min.js');
            if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = '你的浏览器不支持m3u8(hls)';
            }
        },
        // 扩展解码器：FLV
        flv:async function(video,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js');
            if (flvjs.isSupported()) {
                if (art.flv) art.flv.destroy();
                const flv = flvjs.createPlayer({ type: 'flv', url });
                flv.attachMediaElement(video);
                flv.load();
                art.flv = flv; 
            } else {
                art.notice.show = '你的浏览器不支持flv';
            }
        },
        // 扩展解码器：MPD
        mpd:async function(video,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/dashjs/4.6.0/dash.all.min.js');
            if (dashjs.supportsMediaSource()) {
                if (art.dash) art.dash.destroy();
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(video, url, art.option.autoplay);
                art.dash = dash; 
            } else {
                art.notice.show = '你的浏览器不支持mpd';
            }
        }
    },control = {
        last:function(){
            if(vcurr-1 < 0){
                if(CONFIG.debug) console.log('First video.Skip the steps.');
                video.notice.show = '已经是列表的第一个了';
            }else{
                vcurr -- ;
                update(vlist[vcurr].path);
            }
        },next:function(){
            if(vcurr+1 == vlist.length){
                if(CONFIG.debug) console.log('Last video:Retry Video#0.');
                video.notice.show = '循环播放第一个';
                update(vlist[0].path);
            }else{
                vcurr++;
                update(vlist[vcurr].path);
            }
        }
    };
    // 初始化模块
    $.module.bind('video',async function(path){
        // 初始化VIDEO
        if(video == undefined){
            // 初始化盒子尺寸
            vbox = $.tool.box('video-artplayer','div',`<img src="https://www.artplayer.org/document/logo.png">`);
            vbox.style.width = '80vw',vbox.style.height = '45vw';
            // 加载最新artPlayer
            await $.module.load('https://cdn.jsdelivr.net/npm/artplayer@5.0.9/dist/artplayer.min.js');
            // 初始化
            Artplayer.NOTICE_TIME = CONFIG.video.notice;
            Artplayer.PLAYBACK_RATE = CONFIG.video.rate;
            Artplayer.SEEK_STEP = CONFIG.video.seekStep;
            video = new Artplayer({
                container: vbox,
                customType: {
                    m3u8    : opener.mpd,
                    flv     : opener.flv,
                    mpd     : opener.mpd
                },
                controls: [
                    {
                        name    : 'last',
                        index   : 5,
                        position: 'left',
                        html    : `<svg style="padding: 4px;" class="art-icon" viewBox="0 0 16 16">
                            <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"/>
                        </svg>`,
                        tooltip: '上一个视频',
                        click  : ()=>control.last()
                    },{
                        name    :'next',
                        index   : 20,
                        position:'left',
                        html    :`<svg class="art-icon" style="padding:4px;" viewBox="0 0 16 16">
                            <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                        </svg>`,
                        tooltip :'下一个视频',
                        click  :()=>control.next()
                    }
                ],
                settings: [
                    {
                        html: '播放列表',
                        name: 'playlists',
                        width: 250,
                        tooltip: '选择播放的视频',
                        icon : `<svg fill="currentColor" class="art-btn" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>`,
                        selector: [{
                            html:'没有视频',
                            default:true
                        }],
                        onSelect: item => item
                    },{
                        html: '循环播放',
                        tooltip: '此视频循环播放',
                        icon: `<svg fill="currentColor" class="art-btn" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                        </svg>`,
                        switch: false,
                        onSwitch: item => item.switch = loop = !item.switch
                    },
                ],
                setting: true,
                autoplay: true,
                playbackRate: true,
                aspectRatio: true,
                screenshot: true,
                pip: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                lock: true,
                fastForward: true,
                autoOrientation: true,
                airplay: true,
                autoPlayback:CONFIG.video.playback,
                subtitle: {
                    escape: false,
                    style: {'font-size': '2rem'}
                }
            });
            // 自动下一个
            video.on('video:ended',function(){
                if(loop) video.play();
                else control.next();
            });
        }
        (vbox.autoFocus = vbox.getElementsByTagName('video')[0]).click();
        update(path);
    });
}
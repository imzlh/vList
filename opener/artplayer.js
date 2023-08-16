/**
 * Open with artPlayer
 * There are a lot of feature for art!
 */
{
    // 覆盖样式
    let sty = document.createElement('style');
    sty.innerHTML = `
.art-video-player:not(.art-fullscreen-web){
    width:100% !important;height:100% !important;
}
.art-fullscreen-web{
    width: 100vw !important;height: 100vh !important;
    position: fixed !important;top:0;left:0;
}
.ASS-container > .ASS-stage,.ASS-container > .ASS-fix-font-size,.ASS-container > svg{
    z-index:10;
}
`;
    document.body.append(sty);
    // 打开
    let art,ass,vbox,prefix = '',vlist = [],vcurr = -1,loop = false,update = function(path){
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
            prefix = VIEW.contentDocument.location.pathname;
        }
        // 找到当前列表
        vcurr = -1;
        for (var i = 0; i < vlist.length; i++) {
            if(vlist[i].path == path) {
                if(CONFIG.debug) console.log('artVideo switchTo:"',vlist[i].name,'"(NO.',i,')');
                vcurr = i;break;
            }
        }
        if(vcurr == -1) throw new Error(art.notice.show = '错误:找不到当前ID，无法继续');
            
        // 刷新视频信息
        art.setting.update({
            name:'subtitle',
            switch:!!sub
        });
        // 字幕选项
        art.subtitle.realurl = sub;
        let video = vbox.getElementsByTagName('video')[0];
        if(CONFIG.video.enableAss && sub && sub.splitLast('.')[1].toLowerCase() == 'ass') {
            // 启用libass渲染
            initAss(sub);
            art.setting.update({
                name:'libass',
                switch:true
            });
        }else{
            if(ass) ass.destroy();
            video.innerHTML = '';
            // 使用art解析
            if(CONFIG.debug) console.log('restart subtitle-module using ARTparser');
            art.subtitle.switch(sub || 'vendor/video/blank.vtt');
            art.setting.update({
                name:'libass',
                switch:false
            });
        }
        art.switchUrl(path);
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
        // art.setting.option[art.setting.option.length-1].selector = nList;
        art.setting.update({
            name: 'playlists',
            selector: nList,
            
        });
        if(CONFIG.debug) console.log('[Video #',vcurr,']Push ',nList.length,' to ART.',nList);
    },
    // 扩展解码，异步加载
    opener = {
        // 扩展解码器：M3U8
        hls:async function(art,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.0/hls.min.js');
            if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(art);
                art.hls = hls;
            } else if (art.canPlayType('application/vnd.apple.mpegurl')) {
                art.src = url;
            } else {
                art.notice.show = '你的浏览器不支持m3u8(hls)';
            }
        },
        // 扩展解码器：FLV
        flv:async function(art,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js');
            if (flvjs.isSupported()) {
                if (art.flv) art.flv.destroy();
                const flv = flvjs.createPlayer({ type: 'flv', url });
                flv.attachMediaElement(art);
                flv.load();
                art.flv = flv; 
            } else {
                art.notice.show = '你的浏览器不支持flv';
            }
        },
        // 扩展解码器：MPD
        mpd:async function(art,url,art){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/dashjs/4.6.0/dash.all.min.js');
            if (dashjs.supportsMediaSource()) {
                if (art.dash) art.dash.destroy();
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(art, url, art.option.autoplay);
                art.dash = dash; 
            } else {
                art.notice.show = '你的浏览器不支持mpd';
            }
        }
    },
    // 控制列表
    control = {
        last:function(){
            if(vcurr-1 < 0){
                if(CONFIG.debug) console.log('First video{',vcurr,'}.Skip the steps.');
                art.notice.show = '已经是列表的第一个了';
            }else{
                vcurr -- ;
                update(vlist[vcurr].path);
            }
        },next:function(){
            if(vcurr+1 == vlist.length){
                if(CONFIG.debug) console.log('Last video{',vcurr,'}:Retry video#0.');
                art.notice.show = '循环播放第一个';
                update(vlist[0].path);
            }else{
                vcurr++;
                update(vlist[vcurr].path);
            }
        }
    },initAss = async function(path){
        await $.module.load('vendor/video/libass.js');
        if(ass){
            ass.destroy();ass=null;
            if(CONFIG.debug) console.log('libASS destroy.Restarting...');
        }
        let text = await (await fetch(path)).text();
        if(CONFIG.debug) console.log('new url:',path);
        ass = new ASS(text, vbox.getElementsByTagName('video')[0],{
            container: vbox.getElementsByClassName('art-video-player')[0],
            resampling: 'script_width'
        });
        ass.url = path;
    };
    // 初始化模块
    $.module.bind('video',async function(path){
        // 初始化art
        if(art == undefined){
            // 初始化盒子尺寸
            vbox = $.tool.box('video-artplayer','div',`<img src="https://cdn.jsdelivr.net/gh/zhw2590582/ArtPlayer/images/logo.png">`);
            vbox.style.width = '80vw',vbox.style.height = '45vw';
            // 加载最新artPlayer
            await $.module.load('https://cdn.staticfile.org/artplayer/5.0.9/artplayer.min.js');
            await $.module.load('module/fpicker.js');// 依赖
            // 初始化
            Artplayer.NOTICE_TIME = CONFIG.video.notice;
            Artplayer.PLAYBACK_RATE = CONFIG.video.rate;
            Artplayer.SEEK_STEP = CONFIG.video.seekStep;
            art = new Artplayer({
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
                        html    : `<i class="art-icon">
                            <svg width="22" height="22" viewBox="0 0 16 16">
                                <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"/>
                            </svg>
                        </i>`,
                        tooltip: '上一个视频',
                        click  : ()=>control.last()
                    },{
                        name    : 'forward',
                        index   : 15,
                        position: 'left',
                        html    : `<i class="art-icon">
                            <svg width="22" height="22" viewBox="0 0 16 16">
                                <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z"/>
                                <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z"/>
                            </svg>
                        </i>`,
                        tooltip : '快进(+'+CONFIG.video.seekStep+'s)',
                        click   : () => art.forward = CONFIG.video.seekStep
                    },{
                        name    : 'backward',
                        index   : 8,
                        position: 'left',
                        html    : `<i class="art-icon">
                            <svg viewBox="0 0 20 20" width="22" height="22">
                                <path d="M7.712 4.819A1.5 1.5 0 0110 6.095v2.973c.104-.131.234-.248.389-.344l6.323-3.905A1.5 1.5 0 0119 6.095v7.81a1.5 1.5 0 01-2.288 1.277l-6.323-3.905a1.505 1.505 0 01-.389-.344v2.973a1.5 1.5 0 01-2.288 1.276l-6.323-3.905a1.5 1.5 0 010-2.553L7.712 4.82z"></path>
                            </svg>
                        </i>`,
                        tooltip : '快退(-'+CONFIG.video.seekStep+'s)',
                        click   : () => art.backward = CONFIG.video.seekStep
                    },{
                        name    :'next',
                        index   : 20,
                        position:'left',
                        html    :`<i class="art-icon">
                            <svg width="22" height="22" viewBox="0 0 16 16">
                                <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                            </svg>
                        </i>`,
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
                        icon : `<i class="art-icon">
                            <svg width="22" height="22"  viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </i>`,
                        selector: [{
                            html:'没有视频',
                            default:true
                        }],
                        onSelect: function (item) {
                            if(item.path == undefined)
                                return console.log('Failed to set:NULL element');
                            if(CONFIG.debug) console.log('artList checked:',item.html);
                            update(item.path);
                        }
                    },{
                        html: '循环播放',
                        tooltip: '此视频循环播放',
                        icon: `<i class="art-icon">
                            <svg width="22" height="22" viewBox="0 0 16 16">
                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                            </svg>
                        </i>`,
                        switch: false,
                        onSwitch: item => loop = !item.switch
                    },{
                        html:'字幕',
                        name:'subtitle',
                        tooltip:'选取新的字幕',
                        icon:`<i class="art-icon">
                            <svg width="22" height="22" viewBox="0 0 16 16">
                                <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            </svg>
                        </i>`,
                        switch:false,
                        onSwitch:function(item){
                            if( item.switch ){   // 关闭
                                ass?ass.hide():art.subtitle.url = 'vendor/video/blank.vtt';
                                item.tooltip = '显示/启用字幕';
                            }else{                // 打开
                                ass?ass.show():$.list.pick('subtitle').then(res=>{
                                        art.subtitle.switch(res[0]);
                                        art.subtitle.realurl = res[0];
                                    });
                                item.tooltip = '隐藏/关闭字幕';
                            }
                            return !item.switch;
                        }
                    },{
                        html:'ASS字幕',
                        tooltip:'启用libass渲染',
                        name:'libass',
                        icon:`<i class="art-icon">
                            <svg wdth="22" height="22" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5zm6-8V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2V6a2 2 0 0 1 2-2h5z"/>
                            </svg>
                        </i>`,
                        switch:false,
                        onSwitch:function(item){
                            if(item.switch && ass){ // 关闭：销毁libass/浏览器解析vtt换用art
                                art.subtitle.switch(ass.url);
                                ass.destroy();ass=null;
                                item.tooltip = '正在使用art解析',
                                CONFIG.video.enableAss = false;
                                // item.switch = true;
                            }else {         // 启用：使用libass
                                CONFIG.video.enableAss = true;
                                if(typeof art.subtitle.realurl != 'string')
                                    throw new Error(art.notice.show = '失败:没有找到当前视频的字幕');
                                let subtype = art.subtitle.realurl.splitLast('.')[1].toLowerCase();
                                if( subtype == 'ass'){
                                    initAss(art.subtitle.realurl);              // 初始化libass
                                    art.subtitle.url = 'vendor/video/blank.vtt',  // 销毁字幕
                                    item.tooltip = '正在使用libass渲染';
                                }else{
                                    art.notice.show = '失败:没有或者不是ASS字幕!';
                                }
                                return true;
                            }
                        }
                    }
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
            art.on('video:ended',function(){
                if(loop) art.play();
                else control.next();
            });
            // 跳转控制器
            if(CONFIG.video.seeker)
                art.once('ready',()=>art.setting.add({
                    html:'跳转时间',
                    tooltip:'到:',
                    icon:`<i class="art-icon">
                        <svg width="22" height="22" viewBox="0 0 16 16">
                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </i>`,
                    range:[0 , 0 , 1 , 0.01],
                    onChange:function(item){
                        if(!item.timer) setTimeout(function() {
                            if(CONFIG.debug) console.log('Seek to',item.range);
                            art.seek = item.range * art.duration;
                            item.timer = null;
                        }, 500);
                        return '到:';
                    }
                }));
            // 调整大小
            art.on('resize',()=>ass?ass.resize():null);
        }
        // 聚焦
        (vbox.autoFocus = vbox.getElementsByTagName('video')[0]).click();
        // 播放
        update(path);
    });
}
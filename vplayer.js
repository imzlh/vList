/**
 * Open with vPlayer...
 */
 
{
    let vp_addList = function (path,autoplay=false){
        let audios = $vp.list.list;
        for (var i = 0; i < audios.length; i++)
            if(audios[i].file == path)
                return autoplay?$vp.play(i):false;
        var base = $.tool.base(path),
            res = $.list.match(base,'image').concat($.list.match('cover','image'))[0],
            cover = res == undefined ? undefined : res.path,
            res2 = $.list.match(base,'lyrics')[0],
            lrc = res2 == undefined ? undefined : res2.path;
        if(CONFIG.debug) console.log(base,'LRC: ',lrc,'COVER: ',cover);
            if(CONFIG.debug) console.log('add media ',path,' success.');
            return autoplay?$vp.play($vp.list.push({
                file : path,
                cover: cover,
                lrc  : lrc
            })):true;
    },cdList = {},vp_addCD = async function(path,autoplay=false){
        let audios = $vp.list.list;
        if(path in cdList)
            return autoplay?$vp.play(cdList[path]):true;
        var base = $.tool.base(path),
            res = $.list.match('cover','image').concat($.list.match('cover','image'))[0],
            cover = res == undefined ? undefined : res.path,
            id = await $vp.list.load({
                url : path,
                cover : cover,
                autoplay : autoplay
            });
        cdList[path] = id;
        if(autoplay) $vp.play(id);
        if(CONFIG.debug) console.log('Add(CD) ',base,' to list.');
    },load = async function(){
        if(typeof $vp == 'undefined'){
            let box = document.createElement('div'),
                url = window.vp_load_url || 'https://imzlh.top:8443/vplayer/';
            await $.module.css(url+'vp.css');
            box.innerHTML += `<div id="vp" mode="min"><!--vPlayer横幅--><div id="vp_error">播放出现问题!</div><!--vPlayer主播放器--><audio id="vp_main"></audio><!--VPlayer头--><div id="vp_head"><!--按钮-返回--><div class="vp_inline-btn"action="min"style="float: left;"><svg fill="currentColor"viewBox="0 0 16 16"><path fill-rule="evenodd"d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg></div><!--播放的音乐名称--><span id="vp_title">未在播放</span><!--按钮-播放列表--><div class="vp_inline-btn"action="playlist"style="float: right;"><svg fill="currentColor"viewBox="0 0 16 16"><path d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1zm2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848l-4-2.5z"/><path d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5h13z"/></svg></div></div><div id="vp_more"><div id="vp_cover"style="background: lightgray;"></div><div id="vp_lyrics"><p current>未知</p></div></div><!--按钮列表--><div id="vp_btns"><!--音量调节--><div class="vp_btn"action="voice"><svg fill="currentColor"viewBox="0 0 16 16"><path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zm3.025 4a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/></svg></div><!--上一首--><div class="vp_btn"action="last"><svg fill="currentColor"viewBox="0 0 16 16"><path fill-rule="evenodd"d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></div><!--播放/暂停--><div class="vp_btn"action="play"><svg fill="currentColor"id="vp_btn_pause"style="display: none;"viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg><svg fill="currentColor"id="vp_btn_play"viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg></div><!--下一首--><div class="vp_btn"action="next"><svg fill="currentColor"viewBox="0 0 16 16"><path fill-rule="evenodd"d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></div><!--全屏--><div class="vp_btn"action="full"><svg fill="currentColor"viewBox="0 0 16 16"><path fill-rule="evenodd"d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/></svg></div></div><!--时间切换--><div id="vp_seek"><div><span id="vp_time_current">00:00</span><span id="vp_time_total"style="float: right;color: gray;">00:00</span></div><div id="vp_seeker"><div id="vp_time_process"style="width: 0;"><span></span></div></div></div></div><div id="vp_dialog_backdrop"></div><div id="vp_dialog_playlist"class="vp_dialog"title="播放列表"></div><div id="vp_dialog_voice"class="vp_dialog"title="更多设置"><div>音量大小:<input type="range"id="vp_setting_volume"class="full"step="0.01"min="0"max="1"value="1"></div><div>倍速播放:<div class="vp_range"id="vp_setting_playrate"><r value="0.8">0.8X</r><r value="1"class="selected">1X</r><r value="1.25">1.25X</r><r value="1.5">1.5X</r><r value="2">2X</r></div></div><div>循环模式:<div class="vp_range"id="vp_setting_loop"><r value="normal"class="selected">顺序</r><r value="loop">单曲</r><r value="random">随机</r></div></div></div>`;
            document.body.append(box);
            await $.module.load(url+'vp.js');
        }
    };
    
    $.module.bind('audio',async function(path){
        await load();
        vp_addList(path,true);
    });
    $.module.bind('cd',async function(path){
        await load();
        vp_addCD(path,true);
    });
    let playlist = $.tool.add(`<svg viewBox="0 0 20 20">
            <path fill="#729C62" d="m19.56249,10.125a9.62499,9.62499 0 1 1 -19.24998,0a9.62499,9.62499 0 0 1 19.24998,0zm-7.21874,0a2.40625,2.40625 0 1 0 -4.81249,0a2.40625,2.40625 0 0 0 4.81249,0zm-7.21874,0a4.81249,4.81249 0 0 1 4.81249,-4.81249a0.60156,0.60156 0 0 0 0,-1.20312a6.01562,6.01562 0 0 0 -6.01562,6.01562a0.60156,0.60156 0 0 0 1.20312,0l0.00001,-0.00001zm10.82811,0a0.60156,0.60156 0 1 0 -1.20312,0a4.81249,4.81249 0 0 1 -4.81249,4.81249a0.60156,0.60156 0 0 0 0,1.20312a6.01562,6.01562 0 0 0 6.01562,-6.01562l-0.00001,0.00001z"/>
            <path d="m19.43749,14.99995a4.56251,4.56251 0 1 1 -9.12502,0a4.56251,4.56251 0 0 1 9.12502,0zm-4.27735,-2.05947a0.28516,0.28516 0 0 0 -0.57031,0.06337l0,1.71094l-1.71094,0a0.28516,0.28516 0 0 0 0,0.57031l1.71094,0l0,1.71094a0.28516,0.28516 0 0 0 0.57031,0l0,-1.71094l1.71094,0a0.28516,0.28516 0 0 0 0,-0.57031l-1.71094,0l0,-1.77431z" fill="#FABA6F"/>
        </svg>`,'全部加入播放列表(vPlayer:CUE)',function(){
        let music = $.list.match('*','cd');
        for (var i = 0; i < music.length; i++)
            vp_addCD(music[i].path,i == 0);
        this.hidden = true;
    });
    VIEW.addEventListener('load',()=>playlist.hidden = false);
}
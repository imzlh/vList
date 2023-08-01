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
            res = $.list.matchFirst(base,'image') || $.list.matchFirst('cover','image'),
            cover = res == undefined ? undefined : res.path,
            res2 = $.list.matchFirst(base,'lyrics'),
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
            res = $.list.matchFirst(base,'image') || $.list.matchFirst('cover','image'),
            cover = res == undefined ? undefined : res.path,
            id = await $vp.list.load({
                url : path,
                cover : cover
            });
        cdList[path] = id;
        if(autoplay) $vp.play(id);
        if(CONFIG.debug) console.log('Add(CD) ',base,' to list.');
    },load = async function(){
        if(typeof $vp == 'undefined'){
            let box = document.createElement('div'),
                url = window.vp_load_url || 'https://imzlh.top:8443/vplayer/';
            await $.module.css(url+'vp.css');
            box.innerHTML += await (await fetch(url+'vp.html')).text();
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
        let music = [...$.list.match('*','cd')];
        for (var i = 0; i < music.length; i++)
            vp_addCD(music[i].path,i == 0);
        this.hidden = true;
    });
    VIEW.addEventListener('load',()=>playlist.hidden = false);
}
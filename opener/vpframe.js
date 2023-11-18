
/**
 * 使用为vList设计的vpFrame播放视频
 */

{
    var hp,lastdir;
    $.module.bind('video', async function(path){
        if(!window.ASS) $.module.load('vendor/video/libass.js');
        if(typeof vp == 'undefined') {
            let container = $.tool.box('hplayer','div',`<svg fill="#cbd583" viewBox="0 0 16 16">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/>
            </svg>`);
            container.setAttribute('style','max-width:90vw;max-height:90vh;');
            container.classList.add('vpf_container');
            container.innerHTML = await (await fetch('vendor/video/main.html')).text();
            $.module.css('vendor/video/main.css');
            await $.module.load('vendor/video/main.js');
            container.autoFocus = (hp = new vp(container)).video;
            hp.$('func_picksub')[0].onclick = ()=>$.module.load('module/fpicker.js').then(()=>
                $.list.pick('subtitle',true).then(res=>
                    hp.subtitle(res)
                )
            );
        }
        // 重建数据库
        if(lastdir != VIEW.contentDocument.location.pathname)
            for(let data of $.list.match('*','video'))
                hp.add({
                    path : data.path,
                    name : data.name,
                    subtitle:(function(){
                        var tmp = [];
                        for(let sub of $.list.match($.tool.base(data.path),'subtitle'))
                            tmp.push(sub.path);
                        return tmp;
                    })()
                });
        // let item = hp.list.get(hp.list.match(path));
        // if(!item)
        //     return $.dialog.msg('error','失败','',10);
        // else if(CONFIG.debug) console.log('Try to play',item);
        // hp.use(item);
        $.tool.show(hp.container);
        try{
            hp.add({path}).click();
        }catch(e){
            hp.alert('内部错误:列表中找不到该视频');
            throw e;
        }
        // for(let element of hp.e.playlist.children)
        //     if(element.dataset.value == path) return element.click();
        // return 
    });
}
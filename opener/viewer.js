/**
 * Open image with viewerJS
 */

$.module.load('fcheck.js');

{
    let sty = document.createElement('style');
    sty.innerHTML = `
#imgview{
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 0.5rem;
    overflow: auto;
    justify-content: center;
    align-items: center;
}
#imgview img{
    margin: 0.25rem;
    max-width: 30vw;
    max-height: 30vh;
    object-fit: contain;
    box-sizing: border-box;
    transition: transform 0.1s;
}
#imgview img.selected,#imgview img:hover{
    /*border: 0.2rem dotted #1d9ad9;*/
    transform:scale(1.4);
}
#imgview > .btn-close{
    position:fixed;
    top:-.5rem;right:-.5rem;
    box-sizing:content-box;padding:1rem;
    border-radius:0 0 0 1rem;
    background-color:rgb(185 231 150 / 50%);
}
#imgview > .btn-close.selected,#imgview > .btn-close:hover{
    /*outline:solid .2rem red;*/
    background: #d5c348;
}
`;
    document.body.append(sty);
    let box = $.tool.box('imgview','div',`<svg viewBox="0 0 16 16">
            <path fill="#ff4343" d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path fill="#807ee7" d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
        </svg>`),
        imgs = [],cpath = '',
        reload = function(){
            box.innerHTML = '<div class="btn-close" tabindex="0" onclick="this.parentElement.parentElement.click();"></div>';
            for(let img of $.list.match('*','image')){
                let elem = document.createElement('img');
                if(typeof CONFIG.thumb_prefix == 'string')
                    elem.src = img.path.replace(CONFIG.prefix,CONFIG.thumb_prefix);
                else elem.src = img.path + '?reload=' + (elem.dataset.retry = 0);
                elem.dataset.real = img.path;
                elem.alt = img.name;
                imgs.push(img.href);
                elem.onerror = function(){
                    // 重新加载
                    if(this.dataset.retry < 3){
                        this.dataset.retry++;
                        this.src = img.path + '?ts=' + Date.now();
                    }else{
                        this.hidden = true;
                    }
                };
                elem.onclick = function(){
                    let check = this.parentElement.getElementsByTagName('input')[0];
                    if(check != undefined) check.click();
                    return false;
                };
                box.append(elem);
            }
            if(viewer != undefined) viewer.destroy();
            viewer = new Viewer(box,{
                navbar:false,
                url: 'data-real',
                interval: CONFIG.viewer.delay*1000,
                zoomRatio: CONFIG.viewer.zoomRatio,
                minZoomRatio : CONFIG.viewer.zoomRange[0],
                maxZoomRatio : CONFIG.viewer.zoomRange[1],
                inheritedAttributes: []
            });
        },viewer;
    $.module.bind('image',async function(path){
        if(typeof Viewer == 'undefined'){
            await $.module.css('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.css');
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.js');
            reload();
            box.tabIndex = -1;
            $.tool.selector(box,box.children,{
                'Escape' : function(){
                    box.parentElement.click();
                }
            },'selected');
            box.addEventListener('hidden',()=>box.focus());
        }
        if(cpath != VIEW.contentDocument.location.pathname) reload();
        let i = imgs.indexOf(path);
        if(i == undefined) i = 0;
        $.tool.show(box);viewer.show();viewer.zoomTo(i);
    });
}
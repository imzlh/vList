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
#imgview > ul{
    list-style: none;
    margin: 0;
    padding: 0;
}
#imgview li{
    margin: 0.25rem;
    overflow:hidden;
}
#imgview img{
    max-width: 30vw;
    max-height: 30vh;
    object-fit: contain;
    box-sizing: border-box;
}
#imgview > .btn-close{
    position:fixed;
    top:0;right:0;
    box-sizing:content-box;padding:1rem;
    border-radius:0 0 0 1rem;
    background-color:rgb(185 231 150 / 50%);
}
`;
    document.body.append(sty);
    let box = $.tool.box('imgview','ul',`<svg viewBox="0 0 16 16">
            <path fill="#ff4343" d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path fill="#807ee7" d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
        </svg>`),
        imgs = [],
        reload = function(){
            box.innerHTML = '<span class="btn-close" onclick="this.parentElement.parentElement.click();"></span>'
            $.list.match('*','image').forEach(img=>{
                let elem = document.createElement('img'),
                    li = document.createElement('li');
                li.append(elem);
                if(typeof CONFIG.thumb_prefix == 'string')
                    elem.src = img.path.replace(CONFIG.prefix,CONFIG.thumb_prefix);
                else elem.src = img.path + '?ts=' + Date.now();
                elem.dataset.real = img.path;
                elem.alt = img.name;
                imgs.push(img.href);
                elem.dataset.retry = 0;
                elem.onerror = function(){
                    // 重新加载
                    if(this.dataset.retry < 3){
                        this.dataset.retry++;
                        this.src = img.path + '?ts=' + Date.now();
                    }else{
                        this.hidden = true;
                        li.innerHTML = `<svg fill="gray" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>`;
                    }
                }
                elem.onclick = function(){
                    let check = this.parentElement.getElementsByTagName('input')[0];
                    if(check != undefined) check.click();
                    return false;
                };
                box.append(li);
                
            });
            if(viewer != undefined) viewer.destroy();
            viewer = new Viewer(box,{
                navbar:false,
                url: 'data-real',
            });
        },viewer;
    VIEW.addEventListener('load',()=>reload());
    $.module.bind('image',async function(path){
        if(typeof Viewer == 'undefined'){
            await $.module.css('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.css');
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.js');
            reload();
        }
        let i = imgs.indexOf(path);
        if(i == undefined) i = 0;
        viewer.zoomTo(i);
        $.tool.show(box);viewer.show();
    });
}
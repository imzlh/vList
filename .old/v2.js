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
#imgview > img{
    margin: 0.25rem;
    border-radius: 0.5rem;
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
    let box = $.tool.box('imgview'),
        imgs = [],
        reload = function(){
            box.innerHTML = '<span class="btn-close" onclick="this.parentElement.parentElement.click();"></span>'
            $.list.match('*','image').forEach(img=>{
                let elem = document.createElement('img');
                if(typeof CONFIG.thumb_prefix == 'string')
                    elem.src = img.path.replace(CONFIG.prefix,CONFIG.thumb_prefix);
                else elem.src = img.path;
                elem.dataset.real = img.path;
                elem.alt = img.name;
                imgs.push(img.href);
                elem.onclick = function(){
                    let check = this.parentElement.getElementsByTagName('input')[0];
                    if(check != undefined) check.click();
                    return false;
                };
                box.append(elem);
            });
            viewer = new Viewer(box,{
                navbar:false,
                url: 'data-real',
            });
        },viewer;
    view.addEventListener('load',()=>reload());
    $.module.bind('image',async function(path){
        if(typeof viewer == 'undefined'){
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
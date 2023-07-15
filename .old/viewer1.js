/**
 * Open image with viewerJS
 */

{
    // 初始化函数
    let viewer,box,start = function(){
            if(viewer != undefined) return;
            // 初始化平铺图片容器
            box = document.createElement('ul');
            box.setAttribute('style',`display: flex;flex-wrap: wrap;justify-content: center;align-items: center;
                position: fixed;top: 0;left: 0;
                width: 100vw;height: 100vh;box-sizing: border-box;margin:0;padding: 0.5rem;overflow: auto;
                list-style: none;background: rgb(72 72 72 / 50%);`);
            box.innerHTML = `<span class="btn-close" onclick="this.parentElement.hidden = true;"
                    style="position:fixed;top:0;right:0;
                        padding:1rem;border-radius:0 0 0 1rem;
                        background-color:rgb(185 231 150 / 50%);
                    ">
                    <svg fill="currentColor" viewBox="0 0 16 16" style="display:block;height:1rem;">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </span>`;
            box.hidden = true;
            box.id = 'imglist'
            box.onclick = function(e){
                if(e.target.id == 'imglist' && e.target.tagName == 'UL')
                    this.hidden = true;
            }
            view.contentDocument.body.append(box);
            // 载入所有图片
            $.list.match('*','image').forEach(img=>{
                let elem = document.createElement('img'),
                    li = document.createElement('li');
                li.setAttribute('style','margin: .15rem;border:solid .1rem transparent;width:min(20rem,30vw);height:min(20rem,30vw);overflow:hidden;');
                li.append(elem);
                if(typeof CONFIG.thumb_prefix == 'string')
                    elem.src = img.path.replace(CONFIG.prefix,CONFIG.thumb_prefix);
                else elem.src = img.path;
                elem.dataset.real = img.path;
                elem.alt = img.name;
                elem.setAttribute('style','width:100%;height:100%;box-sizing: border-box;');
                elem.onclick = function(){
                    let check = this.parentElement.getElementsByTagName('input')[0];
                    if(check != undefined) check.click();
                    return false;
                };
                box.append(li);
            });
            // 初始化图片viewer
            viewer = new Viewer(box,{
                navbar:false,
                url: 'data-real',
            });
    };
    // 事件监听
    view.addEventListener('load',()=>viewer = undefined);
    // 绑定
    $.module.bind('image',async function(path){
        // 加载viewer
        if(typeof Viewer == 'undefined'){
            await $.module.css('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.css');
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/viewerjs/1.11.3/viewer.min.js');
        }
        start();                // 初始化
        box.hidden = false;     // 打开图片框
        let imgs = box.getElementsByTagName('img'),tg;
        for (var i = 0; i < imgs.length; i++) {
            if(path == imgs[i].dataset.real){
                tg = imgs[i];
                tg.style.borderColor = 'gray';
                viewer.
                if(CONFIG.debug) console.log(tg,'selected');
            }else if(imgs[i].selected){
                imgs[i].style.borderColor = 'transparent';
            }
        }
        if(tg == undefined)
            console.warn('Failed to find image.');
        viewer.show();
    });
    
}
/**
 * Execute Html5 API
 */
{
    let style = document.createElement('style');
    style.innerHTML = `
td.link.h5link::before {
    display: block;
    transform: scale(1.25) rotate(135deg);
    position: absolute;
    bottom: 0;
    left: 1.75rem;
    z-index: 1;
}`;
    const getUrl = function(url){
        let tag = VIEW.contentDocument.createElement('a');
        tag.href = url;
        return tag.href;
    };
    $.list.onload(async function(){
        // await $.module.load('module/lightnode.js');
        // const INI = await $.module.require('https://cdn.jsdelivr.net/npm/ini/lib/ini.min.js');
        await $.module.load('vendor/libini.js');
        VIEW.contentDocument.body.append(style);
        for(let element of VIEW.contentDocument.querySelectorAll('body>table#list>tbody>tr>td.link.h5link'))
            try{
                let a = element.getElementsByTagName('a')[0],
                    ini = $.ini.parse(await $.tool.curl(a.href)),
                    elem = document.createElement('img');
                let target = ini.InternetShortcut.URL,
                    icon = ini.InternetShortcut.IconFile,
                    type = ini.InternetShortcut.ShowCommand;
                if(CONFIG.debug) console.log('H5HyperLink:',target);
                if(!icon) icon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%233db9cf" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg>';
                elem.src = getUrl(icon);
                element.classList.add('thumb');
                element.insertBefore(elem,element.children[0]);
                a.innerText = a.getAttribute('title').splitLast('.')[0],
                a.href = getUrl(target) + '!' + type;
            }catch(e){console.error(e);}
    });
    let box,open = function(path){
        if(!box) box = $.tool.box('h5-browser','iframe',`<svg fill="none" stroke="#ea3df5" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z"></path>
                </svg>`,self=>{box.remove();box = null;self.remove();}
            );
        box.src = path,box.style.width = '90vw',box.style.height = '90vh';
        $.tool.show(box);
    };
    $.module.bind('h5link',function(path){
        let [href,type] = path.splitLast('!');
        /**
         * 0 => frame打开，适用于虚拟文件(夹)URL链接
         * 3 => 新建frame打开，嵌入预览(危险)
         * 7 => 新建标签页打开，安全
         * 其他值：当前页面打开，vlist被销毁
         */
        if(type == '3')         open(href);
        else if(type == '7')    window.open(href);
        else if(type == '0')    VIEW.contentDocument.location.href = href;
        else                    document.location.href = href;
    });
    $.module.bind('h5page',open);
    $.module.bind('weblink',open,'scheme');
}
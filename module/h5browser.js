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
    $.list.onload(async function(){
        // await $.module.load('module/lightnode.js');
        // const INI = await $.module.require('https://cdn.jsdelivr.net/npm/ini/lib/ini.min.js');
        await $.module.load('vendor/libini.js');
        VIEW.contentDocument.body.append(style);
        for(let element of VIEW.contentDocument.querySelectorAll('body>table#list>tbody>tr>td.link.h5link'))
            try{
                let a = element.getElementsByTagName('a')[0],
                    ini = $.ini.parse(await $.tool.curl(a.href));
                let target = ini.InternetShortcut.URL,
                    icon = ini.InternetShortcut.IconFile,
                    type = ini.InternetShortcut.ShowCommand;
                if(CONFIG.debug) console.log('H5HyperLink:',target);
                if(icon.substring(0,4) == 'http'){
                    let elem = document.createElement('img');
                    elem.src = icon;
                    element.classList.add('thumb');
                    element.insertBefore(elem,element.children[0]);
                }
                a.innerText = a.getAttribute('title').splitLast('.')[0],
                a.href = target + '!' + type;
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
        if(type == '3')         open(href);
        else if(type == '7')    window.open(href);
        else document.location.href = href;
    });
    $.module.bind('h5page',open);
    $.module.bind('weblink',open,'scheme');
}
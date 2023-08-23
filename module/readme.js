{
    let init;
    $.list.onload(async function() {
        let text = $.list.matchFirst('readme','text');
        if(!text) return;
        let ext = text.name.splitLast('.')[1],
            content = await $.tool.curl(text.path),
            readme = document.createElement('div');
        readme.id = 'readme';
        if(ext == 'md') try {
                await $.module.load('https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/marked.min.js');
                readme.innerHTML = marked.parse(content);
            } catch (e) {
                console.error('readme:网络错误:' + e.message);
            }
        else if(['html','htm','xhtml'].includes(ext))
            readme.innerHTML = content;
        else readme.innerText = content;
        VIEW.contentDocument.body.insertBefore(readme, VIEW.contentDocument.querySelector('p.copyright'));
    });
}
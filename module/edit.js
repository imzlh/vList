{
    $.module.load('module/davfs.js');
    var box = $.tool.box('func-editor','div',`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path stroke="#e58ae5" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path stroke="#119797" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>`),editor,font,modes = {
        save:()=>
            $.fs.write(
                editor.path.replace(CONFIG.prefix,CONFIG.admin.prefix),
                editor.getValue()
            ).then(()=>
                $.dialog.msg('success','成功','保存成功')
            ),
        refresh:()=>$.dialog.dialog('刷新','确定刷新？所有更改都会失效！',{
                '确定:success':async function(self){
                    self.remove();editor.session.setValue(await $.tool.curl(editor.path));
                },'取消:info':self=>self.remove()
            }),
        _fontSize:function(add){
            let size = font + add;
            editor.setFontSize(size);
            sessionStorage.ace_fontSize = size;
        },
        'font-plus': () => modes._fontSize(1),
        'font-minus': () => modes._fontSize(-1),
        fullscreen: function(){
            if(!document.fullscreenEnabled)
                return $.dialog.msg('warn','全屏','你的浏览器不支持！');
            let req = box.getElementsByClassName('to-fullscreen')[0],
                exit = box.getElementsByClassName('exit-fullscreen')[0];
            if(document.fullscreen){
                req.style.display = 'inline-block',exit.style.display = 'none';
                document.exitFullscreen();
            }else{
                req.style.display = 'none',exit.style.display = 'inline-block';
                box.requestFullscreen();
            }
        },
        remove: ()=>$.dialog.dialog('销毁','确定销毁编辑器?',{
            '确定:info':function(self){
                self.remove();
                editor.destroy();editor = null;
            },'取消:success':self=>self.remove()
        }),
        setting:()=>(
                editor.keyBinding.$defaultHandler.commandKeyBinding["ctrl-,"] ||   // windows
                editor.keyBinding.$defaultHandler.commandKeyBinding["Command-,"]   // mac
            ).exec(editor)
    };
    box.style.width = '90vw',box.style.height = '90vh';
    box.classList.add('edit-container');
    $.edit = async function(path,type){
        if(!editor){
            if(!window.ace){
                await $.module.css('vendor/edit/main.css');
                box.innerHTML = await(await fetch('vendor/edit/main.html')).text();
                for(let element of box.querySelectorAll('.edit-head > *[data-action]'))
                    element.onclick = modes[element.dataset.action];
                await $.module.load('https://cdn.staticfile.org/ace/1.24.0/ace.min.js');
                await $.module.load('https://cdn.staticfile.org/ace/1.24.0/ext-language_tools.min.js');
                $.module.load('module/davfs.js');
            }
            editor = ace.edit(box.getElementsByClassName('edit-body')[0],{
                selectionStyle: "text",
                readOnly: false,
                autoScrollEditorIntoView: true,
                useSoftTabs: true,
                tabSize: 4,
                enableAutoIndent: true,
                mergeUndoDeltas: true,
                animatedScroll: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                theme: "ace/theme/chrome",
                fontSize: font = parseInt(sessionStorage.ace_fontSize || CONFIG.globalFont * 0.9)
            });
            editor.commands.addCommand({
                name: 'Save',
                bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                exec: modes.save,
                readOnly: false
            });
            editor.commands.addCommand({
                name: 'Refresh',
                bindKey: {win: 'F5',  mac: 'F5'},
                exec: modes.refresh,
                readOnly: false
            });
        }
        if(type) editor.session.setMode("ace/mode/"+type),box.getElementsByClassName('edit-lang')[0].innerText = type;
        $.tool.show(box);
        editor.session.setValue(await $.tool.curl(editor.path = path));
    }
}
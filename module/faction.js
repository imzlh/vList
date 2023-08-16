// 初始化CSS
let css = document.createElement('style');
css.innerHTML = `
    .filedrop{
        padding: 5rem 0;
        text-align:center;
        border:gray .1rem dashed;
        border-radius:.5rem;
        position:relative;
        cursor: pointer;
    }
    .filedrop.enter{
        border-color:gray !important;
        color:gray;
    }
    .filedrop.enter::after,.filedrop.enter::before{
        position: absolute;top: -1rem;bottom: 0;left: -1rem;right: -1rem;
    }
    .filedrop.enter::after{
        z-index:10;
        content:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%231f86d9" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>') '松手立即上传';
        color: red;
        width: 10rem;
        margin: 3rem auto;
        margin-top: 3rem;
        display: block;
    }
    .filedrop.enter::before{
        content: '';
        background-color: lightgray;opacity: 0.6;
    }
    .progress{
        background-color:lightgray;
        text-align: unset;
        border-radius: 0.5rem;
        margin:0 1.5rem;
    }
    .progress > div{
        width: 0;min-width:1rem;
        height: 1rem;
        background-color: blue;
        display: block;
        border-radius: 0.5rem;
    }
    #ctx{
        background-color: rgb(245 242 242 / 60%);
        width:auto;display: flex;flex-direction: column;
    }
    #ctx>div{
        display:flex;
    }
    #ctx svg{
        display: inline-block;
        height: 1em;
        width: 1em;
        transform: scale(1.8);
        margin: 0 0.5rem;
        pointer-events: none;
    }
    #ctx span{
        float: right;
        font-size: small;
        opacity: 0.4;
    }
    #ctx p{
        cursor:pointer;
    }
    .file-btns{
        padding:0 .25rem;
    }
    .file-btns>p {
        padding: .75rem;
        margin: 0 .25rem;
    }
    .file-btns svg{
        transform:scale(1.5) !important;
        margin:0 !important;
    }
    .file-btns>p:hover {
        background-color: rgb(188 188 188 / 50%);
        border-radius: .3rem;
    }
`;
document.body.append(css);

// 初始化API
(async function(){
    // 导入模块
    await $.module.load('module/davfs.js');
    // 初始化配置
    var flist = [],action = 'copy';
    // 创建一个文件选择框
    function initFileDrop(elem){
        let uploading = false;
        // 上传封装
        async function upload(files){
            let progdiv = document.createElement('div'),    // 上传进度
                prog = document.createElement('div'),
                msg = $.dialog.msg('info','稍等','上传中...<b class="prog">0</b> / '+files.length),
                progtip = msg.getElementsByClassName('prog')[0],// 指示第几个文件
                i = 1,pathcur = $.fs._get(),start = Date.now();// 开始时间
            if(CONFIG.debug) console.log('Upload is starting.',files,'use progBar',prog);
            progdiv.classList.add('progress');
            progdiv.append(prog);
            elem.append(progdiv);
            uploading = true;
            for(let item of files)
                try{
                    await $.fs.write(pathcur + item.name,item,prog);  // 上传
                    progtip.innerText = i++;
                }catch(e){
                    $.dialog.msg('error','上传出错:',xhrResult(e.target),10).title = '出错文件:'+item.name;
                    if(CONFIG.debug) console.log('Warn:Failed to UPLOAD:',e);
                    progdiv.remove();msg.remove();
                    return uploading = false;
                }
            progdiv.remove();msg.remove();
            $.dialog.msg('success','成功','上传成功!',5);
            VIEW.contentDocument.location.reload();
            uploading = false;
            if(CONFIG.debug) console.log('Succeed.TimeUSE:',Date.now() - start,'ms');
        }
        // 点击上传
        let input = document.createElement('input');
        input.type = 'file',input.hidden = true,input.multiple = true;
        elem.append(input);
        elem.onclick =      ()=>uploading?$.dialog.msg('warn','稍安勿躁','正在上传中...'):input.click();  // 选取文件
        input.onchange =    ()=>upload(input.files);// 上传
        // 拖拽上传
        elem.ondragenter = elem.ondragover = ()=>!!elem.classList.add('enter');
        elem.ondragleave = elem.ondragend  = ()=>elem.classList.remove('enter');
        elem.ondrop = function(e){
            if(e.dataTransfer.files.length == 0) return true;
            elem.classList.remove('enter');
            if(CONFIG.debug) console.log('Uploading using H5DragUpload.');
            upload(e.dataTransfer.files);
            return false;
        };
        return input;
    }
    // 转换a为链接
    function getInfo(as){
        let tmp = [];
        for (var i = 0; i < as.length; i++) tmp.push(as[i].href);
        return tmp;
    }
    // 粘贴
    async function paste(path){
        if(flist.length == 0) return $.dialog.msg('warn','剪贴板为空','可能正在操作中',10);
        if(!path) path = VIEW.contentDocument.location.pathname;
        fl = flist,flist = [];if(CONFIG.debug) console.log('Try to paste',fl);
        for (let file of fl)
            try{
                if(file == path) continue;
                await $.fs.cm(action,
                    file.replace(CONFIG.prefix,CONFIG.admin.prefix),    // 来源
                    (path + (file.splitLast('/')[1]=='' ? file.splitLast('/')[0].splitLast('/')[1]+'/' : file.splitLast('/')[1]))
                        .replace(CONFIG.prefix,CONFIG.admin.prefix)     // 目标
                );
            }catch(e){
                $.dialog.msg('error','粘贴失败:',xhrResult(e.target),10).title = '出错文件:'+file;
                if(CONFIG.debug) console.log('Warn:Failed to Paste:',e);
                return false;
            }
        $.dialog.msg('success','粘贴','成功粘贴:操作完成',5);
        VIEW.contentDocument.location.reload();
    }
    // 重命名
    var rename = target => $.dialog.dialog('重命名',`
        <p class="inline-input">重命名为<input type="text" autofocus value="${target.getAttribute('title')}"></p>
        <p><small>重命名立即生效，请不要输入特殊字符!</small></p>
    `,{
        '确定:success':async function(self){
            let val = self.getElementsByTagName('input')[0].value;
            self.remove();
            if(val == target.getAttribute('title')) return;
            let from = target.href.replace(CONFIG.prefix,CONFIG.admin.prefix),
                to = $.fs._get() + encodeURIComponent(val);
            if(from.substr(-1) == '/') to += '/';// 目录需要后缀
            try{
                await $.fs.cm('move',from,to);
            }catch(e){
                $.dialog.msg('error','重命名失败:',xhrResult(e.target));
                if(CONFIG.debug) console.log('Warn:Failed to UPLOAD:',e);
                return false;
            }
            $.dialog.msg('success','成功','重命名已经生效!',5);
            VIEW.contentDocument.location.reload();
        }
    });
    // 删除
    function del(flist){
        $.dialog.dialog('警告!危险','<p>此操作将<b>不可恢复地删除文件</b></p><p>没有回收站可以反悔，确定吗?</p>',{
            '确定:danger':async function(self){
                self.remove();
                let dial = $.dialog.msg('info','删除','正在删除'+flist.length+'个文件!')
                for(let a of flist)
                    try{
                        await $.fs.delete(a.href.replace(CONFIG.prefix,CONFIG.admin.prefix));
                    }catch(e){
                        $.dialog.msg('error','删除失败:',xhrResult(e.target)).title = '出错文件:'+a.getAttribute('title');
                        if(CONFIG.debug) console.log('Warn:Failed to UPLOAD:',e);
                        return false;
                    }
                $.dialog.msg('success','成功','删除文件成功!!!',5);dial.remove();
                VIEW.contentDocument.location.reload();
            },'取消:success':function(self){
                self.remove();
            }
        });
    }
    // xhr原因分析
    function xhrResult(xhr){
        if(!xhr instanceof XMLHttpRequest)
            throw new TypeError('Got '+typeof xhr+' for Param#1 but require XMLHttpRequest');
        if(!xhr.status){    // 请求未发出完整
            if(xhr.readyState == 1) return '连接服务器失败';
            else return '与服务器的连接中断';
        }else{
            return ({
                400:'请求无效/有误',
                403:'此处不能/禁止操作',
                405:'此处无效/被映射',
                407:'冲突,创建失败',
                412:'与设置冲突',
                423:'位置需要先解锁!',
                502:'无法复制到远程',
                507:'磁盘空间不足!'
            })[xhr.status];
        }
    }
    // 加载依赖
    if(!$.tool.fcheck) await $.module.load('module/fcheck.js');
    HTMLElement.prototype.hide = function(){this.hidden = true;return this;};
    $.tool.fcheck.push(
        $.tool.add(`<svg viewBox="0 0 16 16">
            <path fill="#db6d6d" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill="#ef0505" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>`,'删除',()=>del($.list.checked)).hide(),
        $.tool.add(`<svg viewBox="0 0 16 16">
            <path fill="#2790b9" d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
        </svg>`,'剪切',function(){
            flist = getInfo($.list.checked),action = 'move';
            $.dialog.msg('success','剪切','覆盖剪切板成功',3);
        }).hide(),
        $.tool.add(`<svg viewBox="0 0 16 16">
            <path fill="#e538e5" d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1H1.5z"/>
            <path fill="#891889" d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2h-11zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293L10 14.793z"/>
        </svg>`,'复制',function(){
            flist = getInfo($.list.checked),action = 'copy';
            if(CONFIG.debug) console.log('Selected',flist,'(',flist.length,') Files');
            $.dialog.msg('success','复制','覆盖剪切板成功',3);
        }).hide(),
        $.tool.add(`<svg viewBox="0 0 16 16">
            <path fill="#0ac308" fill-rule="evenodd" d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.165 4.165 0 0 1-2.06-.566A4.561 4.561 0 0 1 8 13.65a4.561 4.561 0 0 1-.44.285 4.165 4.165 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.49 3.49 0 0 0-.436-.294A3.166 3.166 0 0 0 5.5 2.5.5.5 0 0 1 5 2z"/>
            <path fill="#df278d" d="M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z"/>
        </svg>`,'重命名',function(){
            if($.list.checked.length != 1) return $.dialog.msg('warn','重命名','请一次选择一个文件!',10);
            let target = $.list.checked[0];
            rename(target);
        }).hide()
    );
    // 粘贴
    $.tool.add(`<svg viewBox="0 0 16 16">
        <path fill="#c31818" fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
        <path fill="#bf6524" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path fill="#8b640c" d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>`,'粘贴',()=>paste());
    // 上传
    $.tool.add(`<svg viewBox="0 0 16 16">
        <path fill="#16b372" fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
        <path fill="#63af1e" style="transform:scale(0.8) translate(2px, 3px);" fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
    </svg>`,'上传',function(){
        initFileDrop($.dialog.dialog('上传',`<div class="filedrop" style="user-select:none;">
            <svg viewBox="0 0 16 16" style="display: inline-block;width: 6rem;">
                <path fill="#eb4747" d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.513 3.513 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.587 5.587 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5z"/>
                <path fill="#36bd8f" d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.502 4.502 0 0 1 7 5zm3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492V9.5z"/>
            </svg>
            <p>点击选取文件</p>
        </div>`,{
            '取消:error':self=>self.remove(),
        }).getElementsByClassName('filedrop')[0]).click();
    });
    // 新建文件夹
    $.tool.add(`<svg viewBox="0 0 16 16">
            <path fill="#bb4dd7" d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z"/>
            <path fill="#cb5428" d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
        </svg>`,'新建文件夹',function(){
            $.dialog.dialog('新建文件夹',`
                <p class="inline-input">文件夹名<input type="text" autofocus value="新建文件夹"></p>
            `,{
                '确定:success':async function(self){
                    let val = self.getElementsByTagName('input')[0].value;
                    if($.list.list.dir.includes(val))
                        return $.dialog.msg('error','已经存在','此文件夹已经存在啦!',10);
                    self.remove();
                    try{
                        await $.fs.mkdir($.fs._get() + encodeURIComponent(val) + '/');
                    }catch(e){
                        return $.dialog.msg('error','建立文件夹失败:',xhrResult(e.target));
                        if(CONFIG.debug) console.log('Warn:Failed to UPLOAD:',e);
                        return false;
                    }
                    $.dialog.msg('success','成功','新建文件夹成功!',5);
                    VIEW.contentDocument.location.reload();
                }
            })
        })
    // 拖拽移动支持
    function initDrag(){
        async function start(event,dir){
            let fpath = event.dataTransfer.getData('text/fdurl'),
                fname = event.dataTransfer.getData('text/fdname'),
                target = dir.replace(CONFIG.prefix,CONFIG.admin.prefix)+fname;
            if(fpath == target) return;
            let dial = $.dialog.msg('info','拖拽移动','正在操作中...');
            try{
                await $.fs.cm('move',fpath,target);
                VIEW.contentDocument.location.reload();
            }catch(e){
                $.dialog.msg('error','移动出错!',xhrResult(e.target));
            }finally{
                dial.remove();
            }
        }
        let elem = VIEW.contentDocument.querySelectorAll('body>table#list>tbody>tr'),
            bread = VIEW.contentDocument.getElementById('bread');
        if(!elem || !bread) return false;
        for(let ele of elem)
            ele.draggable = true,
            ele.ondragstart = event=>{
                let a = ele.getElementsByTagName('a')[0];
                event.dataTransfer.setData('text/fdurl', a.href.replace(CONFIG.prefix,CONFIG.admin.prefix));
                event.dataTransfer.setData('text/fdname', a.getAttribute('href'));
                let svg = document.createElement('img');svg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%233db9cf" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>';
                event.dataTransfer.setDragImage(svg,16,16);
            },
            ele.ondragenter = ele.ondragover = ()=>!!ele.classList.add('focus'),
            ele.ondragleave = ele.ondragend  = ()=>!!ele.classList.remove('focus'),
            ele.ondrop = async function(event){
                if(!this.children[0].classList.contains('dir'))
                    return $.dialog.msg('warn','失败','请拖拽到文件夹中!',10);
                else if(event.dataTransfer.getData('text/fdurl') == 
                    this.getElementsByTagName('a')[0].href.replace(CONFIG.prefix,CONFIG.admin.prefix))
                    return; // 自己拖动到自己内，当作无效
                if(CONFIG.debug) console.log('Drag event.',event.dataTransfer);
                // 文件点对点移动
                if(event.dataTransfer.types.includes('text/fdurl')){
                    start(event,this.getElementsByTagName('a')[0].href);
                }else if(event.dataTransfer.files.length > 0){
                    return !!$.dialog.msg('warn','拖拽','上传文件请使用上传框!',10);
                }else return !$.dialog.msg('error','拖拽','无效的拖拽',10);
                return false;
            };
        for(let title of bread.children){
            title.tabIndex = -1;
            title.ondragenter = title.ondragover = ()=>!!title.focus();
            title.ondrop = function(e){
                if(CONFIG.debug) console.log('Drag to head.',event.dataTransfer);
                if(event.dataTransfer.types.includes('text/fdurl'))
                    start(e,this.href.replace(CONFIG.prefix,CONFIG.admin.prefix));
                else $.dialog.msg('error','拖拽','无效的拖拽',10);
            }
        }
    }
    VIEW.addEventListener('load',initDrag);
    initDrag();
    // 关于
    function about(){
        $.dialog.dialog('关于',`
            <h1>vList Action V1.0</h1>
            <p>这是一个开源项目，依赖于nginx的WebDAV实现文件操作!</p>
            <p>2021~2023 izcopyright(C)</p>
        `);
    }
    // 获取链接
    function getLink(a){
        if(a.parentElement.classList.contains('dir')) return $.dialog.msg('warn','获取失败','目录没有直链!',10);
        $.dialog.dialog('链接',`
            <p>文件：${a.getAttribute('title')}</p>
            <p><b>解析链接如下:</b></p>
            <textarea style="width: 100%;height: 10rem;border: none;padding: 0.75rem;box-sizing: border-box;display: block;background: whitesmoke;border-radius: 0.5rem;">${a.href}</textarea>
        `,{
            '复制:success':function(self){
                try{
                    let text = self.getElementsByTagName('textarea')[0];
                    text.select();document.execCommand ('copy');text.blur();
                    $.dialog.msg('success', '复制成功', '不要用到奇怪的地方哦',5);
                }catch(e){
                    $.dialog.msg('error','失败','复制出错，请手动复制',10);
                    throw e;
                }
            },'关闭:info':self=>self.remove()
        })
    }
    // 右键
    let ctx = document.getElementById('ctx');
    ctx.innerHTML = `
<div class="file-btns">
    <p data-title="删除文件(夹)" data-click="del([target]);">
        <svg fill="none" stroke="#e41818" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
        </svg>
    </p>
    <p data-title="复制文件(夹)" data-click="flist=[target.href],action='copy';">
        <svg fill="none" stroke="#62b265" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"></path>
        </svg>
    </p>
    <p data-title="剪切文件(夹)" data-click="flist=[target.href],action='move';">
        <svg fill="none" stroke="#a96be2" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664"></path>
        </svg>
    </p>
    <p data-title="重命名文件(夹)" data-click="rename(target);">
        <svg fill="#ed8c15" viewBox="0 0 16 16">
            <path d="M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z"/>
            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z"/>
        </svg>
    </p>
    <p data-title="获取链接" data-click="getLink(target)">
        <svg fill="none" stroke="#6c99ea" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"></path>
        </svg>
    </p>
</div>
<p data-click="paste()">
    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"></path>
    </svg>
    粘贴
    <span>^V</span>
</p>
<p data-click="VIEW.contentWindow.history.back();">
    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
    </svg>
    回退
    <span>ESC</span>
</p>
<p data-click="VIEW.contentDocument.location.reload();">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
    </svg>
    刷新
    <span>F5</span>
</p>
<p data-click="about()">
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
    </svg>
    关于
    <span>F1</span>
</p>
`;
    let fileBtn = ctx.getElementsByClassName('file-btns')[0];
    ctx.ondisplay = function(a){
        fileBtn.hidden = !(a.tagName == 'A' && a.parentElement.tagName == 'TD');
        if(CONFIG.debug) console.log('Dialog opened for:',a);
        ctx.onclick = function(e){
            if(!e.target.dataset.click) return;
            let target = a;if(CONFIG.debug) console.log('Checked:',target);
            eval(e.target.dataset.click);
        }
    }
})();
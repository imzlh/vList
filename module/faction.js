
const CONF = JSON.parse(localStorage.davAPI);

// 初始化CSS
let css = document.createElement('style');
css.innerHTML = `
    .filedrop{
        padding: 5rem 1rem;
        text-align:center;
        border:dashed .2rem lightseablue;
        border-radius:.5rem;
        position:relative;
    }
    .filedrop.enter{
        border-color:gray !important;
        color:gray;
    }
    .filedrop.enter::after{
        position:absolute;top:0;left:0;right:0;bottom:0;
        content:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="#1f86d9" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>');
    }
    .progress{
        background-color:lightgray;
    }
    .progress > div{
        min-width:1rem;height:1rem;
        background-color:blue;
    }
`;
document.body.append(css);

// 初始化API
$.fs = {
    _get:()=>VIEW.contentDocument.location.pathname.replace(CONFIG.prefix,CONF.prefix),
    _ajax:function(method,name,rs,rj,header){
        let xhr = new XMLHttpRequest();
        xhr.open(method,$.fs._get()+name,true,CONF.user,CONF.password);
        if(header) for(let name in header) xhr.setRequestHeader(name,header[name]);
        xhr.onerror = e => rj(e),xhr.onload =  e => rs(e);
    },
    write:(name,stream,progress)=>new Promise(function(rs,rj){
        let xhr = $.fs._ajax('PUT',name,rs,rj);
        if(progress instanceof HTMLElement) xhr.onprogress = function(e){
            if(!e.lengthComputable) return;
            let prog = e.loaded / e.total * 100;
            progress.style.width = prog + '%';
        };
        xhr.send(stream);
    }),
    delete : name=>new Promise(function(rs,rj){
        $.fs._ajax('DELETE',name,rs,rj).send();
    }),
    cm:(type,from,to)=>new Promise(function(rs,rj){
        $.fs._ajax(type,name,rs,rj,{
            Destination:to
        }).send();
    }),
    
};

(async function(){
    var flist = [],action = 'copy';
    // 创建一个文件选择框
    function filedrop(elem){
        // 点击上传
        let input = document.createElement('input');
        input.type = 'file',input.hidden = true,input.multiple = true;
        elem.append(input);
        elem.onclick =      ()=>input.click();  // 选取文件
        input.onchange =    function(){
            let progdiv = document.createElement('div'),
                prog = document.createElement('div');
            progdiv.classList.add('progress');
            progdiv.append(prog);
            elem.append(prog);
            input.files.forEach(file=>$.fs.write(file.name,file));  // 上传
            progdiv.remove();
        };
        // 拖拽上传
        elem.ondragenter = function(){
            this.classList.add('enter');
        };
        elem.ondrag = function(e){
            e.preventDefault();
        };
        return input;
    }
    // 粘贴
    function paste(path){
        for (let a of flist) $.fs.cm(a.getAttribute('href'));
        $.dialog.msg('success','删除','删除完成');
    }
    // 加载依赖
    if(!$.tool.fcheck) await $.module.load('module/fcheck.js');
    $.tool.fcheck.push(
        $.tool.add(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>`,'删除',()=>$.list.checked.forEach(file=>$fs.delete(file.getAttribute('href')))),
        $.tool.add(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-scissors" viewBox="0 0 16 16">
            <path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>
        </svg>`,'剪切',function(){
            flist = $.list.checked,action = 'cut';
            $.dialog.msg('success','剪切','覆盖剪切板成功');
        }),
        $.tool.add(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stickies" viewBox="0 0 16 16">
            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1H1.5z"/>
            <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2h-11zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293L10 14.793z"/>
        </svg>`,'复制',function(){
            flist = $.list.checked,action = 'copy';
            $.dialog.msg('success','复制','覆盖剪切板成功');
        })
    );
    // 粘贴
    $.tool.add(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>`,'粘贴',()=>paste());
    // 上传
    $.tool.add(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-upload" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
        <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
    </svg>`,'上传',function(){
        initFileDrop($.dialog.dialog('上传',`<div class="filedrop">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clouds" viewBox="0 0 16 16">
                <path d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.513 3.513 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.587 5.587 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5z"/>
                <path d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.502 4.502 0 0 1 7 5zm3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492V9.5z"/>
            </svg>
            <p>点击选取文件</p>
        </div>`,{
            '取消:error':self=>self.remove(),
        }).getElementsByClassName('filedrop')).click();
    });
})();
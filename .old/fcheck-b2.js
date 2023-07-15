/**
 * 文件选择框
 */
(async function(){
    await $.module.load('dialog.js');
    await $.module.load('https://cdn.jsdelivr.net/npm/async-zip-stream@1.1.0/dist/index.min.js');
    await $.module.load('https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js');
    var files,check_state,tool = [];
    $.tool.add(
        `<svg fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
            <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
        </svg>`,
        '开关复选框(仿alist)',
        function(){
            let list = view.contentDocument.querySelectorAll('body>table#list>tbody>tr>td.link');
            if(check_state){    // 已经打开：关闭
                for (let i = 0; i < list.length; i++)
                    try{list[i].children[1].remove();}catch(e){}
                check_state = false;
            }else{              // 打开复选框
                check_state = true;
                files = [];
                // 将checkbox放入文件标签前
                for (let i = 0; i < list.length; i++){
                    var b = document.createElement('input');
                    b.type = 'checkbox';
                    b.setAttribute('style','float:left;margin-right: 1rem;margin-left: -.5rem;transform: scale(1.2);');
                    b.oninput = function(){
                        if(CONFIG.debug) console.log(list[i].children[0].getAttribute('title'),this.checked?'Checked.':'UnChecked');
                        if(this.checked){
                            this.cid = files.length;    // 第n个被选中
                            if(this.cid == 0) tool[0].hidden = tool[1].hidden = false;
                            files.push(list[i].children[0]);// 载入到数组
                        }else{
                            files.splice(this.cid,1);     // 取消选中
                            if(this.cid == 0) tool[0].hidden = tool[1].hidden = true;
                        }
                    };
                    list[i].append(b);
                }
            }
        }
    );
    tool.push($.tool.add(
        `<svg fill="none" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z"></path><path d="M10 14a3.5 3.5 0 005 0l4-4a3.5 3.5 0 00-5-5l-.5.5"></path>
            <path d="M14 10a3.5 3.5 0 00-5 0l-4 4a3.5 3.5 0 005 5l.5-.5"></path>
        </svg>`,
        '获取文件链接(JSON)',
        function(){
            var res = [];
            for (let id in files) res.push(files[id].href);
            $.dialog.dialog('结果','<pre style="overflow:auto;">'+JSON.stringify(res,null,4)+'</pre>',{
                "确定:success":function(self){
                    self.remove();
                }
            });
        }
    ),
    $.tool.add(
        `<svg fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024">
            <path d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9z"></path>
            <path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"></path>
        </svg>`,
        '批量打包下载',
        function(){
            $.dialog.dialog('打包下载警告',`
                <p>确定打包${files.length}个文件吗?</p>
                <p>打包文件需要耐心等待，取决于你的设备性能和网速。</p>
                <p>结束后会自动下载zip文件</p>
            `,{
                "确定:success":async function(self){
                    self.remove();
                    if(CONFIG.debug) console.log('filelist\n',files);
                    window.onbeforeunload = evt => {
                        if (!done) {
                            evt.returnValue = `Are you sure you want to leave?`;
                         }
                    }
                    let dlg = $.dialog.dialog('打包中','请耐心等待，正在打包...<pre id="pack_state"></pre>',undefined,false);
                        ps = document.getElementById('pack_state'),file = [],
                        STDOUT = streamSaver.createWriteStream('packed.zip'),
                        start = Date.now();
                    for (let i = 0; i < files.length; i++) {
                        let fname = files[i].getAttribute('title');
                        if(files[i].parentElement.classList.contains('dir')){
                            ps.innerText += `忽略文件夹${fname}(暂不支持)\n`;
                            continue;
                        }else{
                            if(CONFIG.debug) console.log('Pack:add NO.',i,'file',fname);
                            file.push({
                                name : fname,
                                stream:async function(){
                                    ps.innerText += `打包第${i}个文件:${fname}\n`;
                                    return await fetch(files[i].href);
                                }
                            });
                        }
                    }
                    let zip = createZipStream(file);
                    zip.on('error',function(e){
                        dlg.remove();
                        $.dialog.msg('error','失败','打包失败:内部错误',10);
                        if(CONFIG.debug) console.error(e);
                    });
                    await zip.pipeTo(STDOUT);
                    dlg.remove();
                    if(CONFIG.debug) console.log('Pack completed in ',Date.now()-start,'MS.');
                    $.dialog.msg('success','成功','打包成功!开始下载',10);
                },
                "取消:error":function(self){
                    self.remove();
                }
            });
        }
    ));
    view.addEventListener('load',function(){
        if(CONFIG.debug) console.log('CheckBox reset.');
        files = [],check_state = false,tool[0].hidden = tool[1].hidden = true;
    });
    tool[0].hidden = tool[1].hidden = true;
})();

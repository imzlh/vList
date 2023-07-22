/**
 * 文件选择框
 */
(async function(){
    await $.module.load('vendor/zip-stream.min.js');
    var files,check_state,tool = [];
    $.tool.add(
        `<svg viewBox="0 0 16 16">
            <path fill="#73e3d3" d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
            <path fill="#01859b" d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
        </svg>`,
        '开关复选框(仿alist)',
        function(){
            let list = VIEW.contentDocument.querySelectorAll('body>table#list>tbody>tr>td.link'),
                all = VIEW.contentDocument.querySelector('body>table#list>thead>tr>th');
            if(check_state){    // 已经打开：关闭
                for (let i = 0; i < list.length; i++)
                    try{list[i].children[1].remove();}catch(e){}
                all.getElementsByTagName('input')[0].remove();
                tool[0].hidden = tool[1].hidden = !(check_state = false);
            }else{              // 打开复选框
                check_state = true;
                files = [];
                // 将checkbox放入到总体前
                var b = document.createElement('input');
                b.type = 'checkbox';
                b.setAttribute('style','float:left;margin-right: 1rem;transform: scale(1.4);');
                b.oninput = function(){
                    for (var i = 0; i < list.length; i++)
                        list[i].getElementsByTagName('input')[0].click();
                }
                all.append(b);
                // 将checkbox放入文件标签前
                for (let i = 0; i < list.length; i++){
                    let b = document.createElement('input');
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
    `<svg viewBox="0 0 16 16">
        <path fill="#44af17" d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
        <path fill="#d73ed7" d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
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
    `<svg viewBox="0 0 16 16">
        <path fill="#00a2c7" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
        <path fill="#4c5bc9" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
    </svg>`,
        '批量打包下载',
        function(){
            $.dialog.dialog('打包下载警告',`
                <p><b>确定打包${files.length}个文件吗?</b></p>
                <p>打包文件需要耐心等待，取决于你的设备性能和网速。</p>
                <p>理论上没有大小限制，但如果文件过大建议复制链接下载</p>
                <p>点击"确定"会开始打包同时下载zip文件</p>
            `,{
                "确定:success":async function(self){
                    self.remove();
                    if(CONFIG.debug) console.log('filelist\n',files);
                    try{
                        var dlg = $.dialog.dialog('打包中','请耐心等待，正在打包...<pre id="pack_state" style="height:50vh;overflow:auto;"></pre>',undefined,false),
                            stdout = streamSaver.createWriteStream('packed.zip'),
                            ps = document.getElementById('pack_state'),
                            i = 0,
                            zip = new ZIP({
                                pull : async function(control){
                                    if(files.length == i) return control.close();  // 完毕
                                    if(files[i].parentElement.classList.contains('dir')){
                                        ps.innerText += `忽略文件夹${files[i].getAttribute('title')}(暂不支持)\n`;
                                        i++;if(files.length == i) return control.close();  // 完毕
                                    }
                                    let filenow = files[i].href,r,name = files[i].getAttribute('title');
                                    try{
                                        r = await fetch(filenow);           // 读取URL
                                    }catch(e){
                                        dlg.remove();
                                        $.dialog.msg('error','失败','打包失败:网络错误',10);
                                        if(CONFIG.debug) console.error(e);
                                    }
                                    ps.innerText+=`打包第${i}个文件:${name}\n`;
                                    ps.scrollTop = ps.scrollHeight;
                                    control.enqueue({  
                                        name   : name ,
                                        stream : ()=>r.body  
                                    });
                                    i++;
                                    if(CONFIG.debug) console.log('Pack:completed NO.',i);
                                }   
                            });
                        await zip.pipeTo(stdout);
                    }catch(e){
                        if(dlg) dlg.remove();
                        $.dialog.msg('error','失败',e.message,10);
                        if(CONFIG.debug) throw e;
                    }
                    dlg.remove();
                    if(CONFIG.debug) console.log('Pack completed.');
                    $.dialog.msg('success','成功','打包成功!',10);
                },
                "取消:error":function(self){
                    self.remove();
                }
            });
        }
    ));
    VIEW.addEventListener('load',function(){
        if(CONFIG.debug) console.log('CheckBox reset.');
        files = [],check_state = false,tool[0].hidden = tool[1].hidden = true;
    });
    tool[0].hidden = tool[1].hidden = true;
})();

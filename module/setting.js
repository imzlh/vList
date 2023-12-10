/**
 * Set the config.And do chores...
 */
(async function(){ 
    let style = document.createElement('style');
    style.innerHTML = `
.btn_switch{
    border-radius: .5rem;
    height:1rem;width:1.5rem;box-sizing:border-box;
    transform:scale(1.6);
    background-color:#e7e3e3;/*outline:solid 0.1rem #00bcd4;*/
    padding:.1rem;float:right;
    transition:all 0.1s;
}
.btn_switch::after{
    content:'';float:left;
    width:.8rem;height:.8rem;border-radius: 0.4rem;
    background-color:#20a6e3;
    transition:all 0.1s;
}
.btn_switch[data-value=true]{
    background-color:#20a6e3;outline:none;
}
.btn_switch[data-value=true]::after{
    float:right;
    background-color:white;
}
.btn_range{
    transform:scale(1.5);float:right;
    border: solid .1em #20a6e3;
    border-radius: .2em;
    overflow: hidden;height:1em;
}
.btn_range>.btn{
    background-color:#20a6e3;color:white;
    cursor: pointer;
}
.btn_range>.btn>svg{
    display:block;width:1rem;height:1rem;
}
.btn_range[data-value]::after{
    content: attr(data-value);
    float: left;
    font-size: xx-small;
    width: 3em;
    text-align: center;
}
p{
    margin:0.75em 0;
}
h2.colorful::before{
    content: '';
    color: aqua;
    transform: scale(2);
    width: 0.3em;
    height: .8em;
    display: inline-block;
    background-image: linear-gradient(60deg, #678de5, #9eabef, #f1a5e4, #9ce1f1fc);
    border-radius: 0.15em;
    margin-bottom: -0.1em;
    margin-right: 0.5em;
    user-select: none;
}
.inline-input{
    display:flex;
    align-items:center;
}
.inline-input input{
    flex-grow: 1;
    margin-left:2rem;
    padding:.75rem 1.25rem;
    background-color:lightgray;
    border-radius:.3rem;border:none;
}
`;
    document.body.append(style);
    let dlg = $.dialog.offcv('设置',`
        <h2 class="colorful">基础</h2>
        <p>启用CSS动画  <span class="btn_switch" data-value="${CONFIG.animate}" data-role="set:animate"></span></p>
        <p><small>动画使操作美观平滑，但是会增加CPU负担。若性能较差建议关闭</small></p>
        <p>自动切换主题 <span class="btn_switch" data-value="${CONFIG.autoTheme}" data-role="set:autoTheme"></span></p>
        <p><small>vList有黑白两色主题，启用自动根据时间切换主题</small></p>
        <p>页面自动回退 <span class="btn_switch" data-value="${CONFIG.autoBack}" data-role="set:autoBack"></p>
        <p><small>如果页面不是vList页面，自动切换上一页</small></p>
        <p>隐藏部分文件 <span class="btn_switch" data-value="${CONFIG.autohide}" data-role="set:autohide"></p>
        <p><small>将部分匹配的文件隐藏，一般都是字幕等无关紧要的</small></p>
        <p>页面字体大小 <span class="btn_range" data-value="${CONFIG.globalFont}" data-role="set:globalFont"></p>
        <p><small>vList全部使用字体设置大小排版，你可以借此调节缩放哦</small></p>
        <p>启用文件操作 <span class="btn_switch" data-value="${!!(CONFIG.admin.user&&CONFIG.admin.pw)}" data-role="exec:login(val,tg)"></span></p>
        <h2 class="colorful">更多</h2>
        <div style="margin:1rem 0;" class="btns">
            <!--刷新-->
            <div onclick="$.cache.reload(true).then(()=>fetch('@api/clear')).then(()=>setTimeout(()=>document.location.reload(),1000));" title="重新加载缓存">
                <svg viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
            </div>
            <!-- 全屏 -->
            <div onclick="document.fullscreen?document.exitFullscreen():document.body.requestFullscreen();" title="全屏">
                <svg viewBox="0 0 16 16">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                    <path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0v-3zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0v3z"/>
                </svg>
            </div>
            <!-- 显示隐藏文件 -->
            <div onclick="$.tool.show_hidden_files()" style="transform:scale(0.9)" title="显示隐藏文件">
                <svg fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
                </svg>
            </div>
            <!-- PWA -->
            <div hidden id="_pwa_setup_btn">
                <svg fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                </svg>
            </div>
        </div>
    `);
    dlg.hidden = true;
    let foreach = function(classname,callback,exec){
        let btns = dlg.getElementsByClassName(classname);
        for (var i = 0; i < btns.length; i++){
            if(exec) exec(btns[i]);
            btns[i].onclick = callback;
        }
    };
    foreach('btn_switch',function(){
        this.dataset.value = this.dataset.value == 'true'?false:true;
    });
    foreach('btn_range',null,function(e){
        e.innerHTML = `<span class="btn" style="float:left;" onclick="this.parentElement.set(-1);">
                <svg stroke="currentColor" viewBox="0 0 16 16">
                    <line y2="8" x2="12" y1="8" x1="4"/>
                </svg>
            </span>
            <span class="btn" style="float:right;" onclick="this.parentElement.set(1);">
                <svg fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </span>`;
        e.set = function(add){
            this.dataset.value = parseInt(this.dataset.value)+add;
            this.click();
        };
    });
    dlg.onclick = function(e){
        let tg = e.target;
        if(tg.tagName != 'SPAN' || !tg.dataset.role) return true;
        if(CONFIG.debug) console.log('Clicked button(role:',tg.dataset.role,')');
        const [mode,key] = tg.dataset.role.split(':',2);
        let value = tg.dataset.value,val = value;
        if(value == 'true')         val = true;
        else if(value == 'false')   val = false;
        else if(!isNaN(value))      val = parseInt(value);
        if(mode == 'set')           $.cache.set(key,val);
        else if(mode == 'exec')     eval(key);
    };
    $.tool.add(`<svg viewBox="0 0 16 16">
        <path fill="#38c577" fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>`,'帮助与设置',function(){
        dlg.hidden = false;
    });
    $.tool.show_hidden_files = function(){
        let tr = VIEW.contentDocument.querySelectorAll('table#list>tbody>tr');
        for (var i = 0; i < tr.length; i++) tr[i].hidden = false;
    };
    
    function login(val,self){
        if(val == false){   // 退出
            $.cache.set('admin.user',null);
            $.cache.set('admin.pw',null);
            $.dialog.msg('success','退出登录','成功！');
            setTimeout(()=>document.location.reload(), 5000);
        }else if(!CONFIG.admin.prefix){
            $.dialog.msg('error','失败','管理员禁止了登陆');
            self.dataset.value = false; 
        }else{// 登陆
            let [user,pw] = $.dialog.dialog('登陆',`
                <p class="inline-input">用 户 <input type="user" placeholder="WebDAV用户名"></p>
                <p class="inline-input">密 码 <input type="password" placeholder="WebDAV密码"></p>
            `,{
                '确定:success':function(self){
                    let xhr = new XMLHttpRequest();
                    let userval = user.value,pwval = pw.value;
                    xhr.open('GET',CONFIG.admin.prefix,true,userval,pwval);
                    xhr.onload = function(){
                        if(this.status == 401) return $.dialog.msg('error','失败','帐户或密码错误');
                        $.cache.set('admin.user',userval);
                        $.cache.set('admin.pw',pwval);
                        $.dialog.msg('success','成功','登陆成功!!');
                        setTimeout(()=>document.location.reload(), 2000);
                    }
                    xhr.onerror = function(){
                        $.dialog.msg('warn','网络错误','请重试!!');
                    }
                    xhr.send();
                },'取消:info':self=>self.remove()
            }).getElementsByTagName('input');
        }
    }
    
    // PWA Application
    // if ("serviceWorker" in navigator)
    //     try{
    //         navigator.serviceWorker.register('sw.app.js',{
    //             scope:'./'
    //         });
    //     }catch(e){
    //         if(CONFIG.debug) console.warn('SW-reg failed.',e);
    //     }
    // else if(CONFIG.debug)
    //     console.log('We cannot enable SW.non-HTTPS site?');
    window.onbeforeinstallprompt = function(e){
        let btn = document.getElementById('_pwa_setup_btn');
        btn.hidden = false,btn.onclick = function(){
            e.prompt();
            e.userChoice.then(res => {
                if (res.outcome === "accepted") {
                    btn.hidden = true;$.dialog.msg('success','成功','安装桌面应用成功!');
                }else{
                    if(CONFIG.debug) console.log('User refuse to install APP.');
                }
            });
        };
    }
    
    if(CONFIG.admin.user&&CONFIG.admin.pw){
        $.module.load('module/faction.js');
    }
})();
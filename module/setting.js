/**
 * Set the config.
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
        <p>页面字体大小 <span class="btn_range" data-value="${CONFIG.globalFont}" data-role="set:globalFont"></p>
        <p><small>vList全部使用字体设置大小排版，你可以借此调节缩放哦</small></p>
        <h2 class="colorful">更多</h2>
        <div style="margin:1rem 0;" class="btns">
            <!--刷新-->
            <div onclick="$.cache.reload(true).then(()=>document.location.reload());" title="重新加载缓存">
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
        if(mode == 'set') $.cache.set(key,(function(){
                let value = tg.dataset.value;
                if(value == 'true')         return true;
                else if(value == 'false')   return false;
                else if(!isNaN(value))      return parseInt(value);
                else                        return value;
            })());
    };
    $.tool.add(`<svg viewBox="0 0 16 16">
        <path fill="#ff3177" fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>`,'帮助与设置',function(){
        dlg.hidden = false;
    });
    $.tool.show_hidden_files = function(){
        let tr = VIEW.contentDocument.querySelectorAll('table#list>tbody>tr');
        for (var i = 0; i < tr.length; i++) tr[i].hidden = false;
    };
})();
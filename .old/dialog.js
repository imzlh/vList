/**
 * dialog.JS
 * 弹出各种交互框，没有合并入主线(体积较大)
 */

$.dialog = {
    box : document.createElement('div'),
    // 重写rewrite属性
    rewrite:function(e,anim='fadeout'){
        if(CONFIG.animate)
            e.remove = function(){
                e.classList.add(anim);
                setTimeout(()=>e.parentElement.removeChild(e), 500);
            }
    },
    // 创建DIV池
    create:function(ii=3){
        var pool = [];
        for (var i = 0; i < ii; i++)
            pool.push(document.createElement('div')); 
        return pool;
    },
    // 输出一段信息
    msg: function(type, title, content, remove) {
        var e = document.createElement('div');
        e.classList.add(type);
        e.innerHTML = ` <b> ${title} </b><span style="flex-grow:1;"> ${content} </span>
            <span class="btn-close" onclick="this.parentElement.remove();"></span>`;
        this.box.append(e);
        if(typeof remove == 'number')
            setTimeout(()=>e.remove(),remove*1000);
        if(CONFIG.animate) this.rewrite(e);
        return e;
    },
    // 弹出一个交互框
    dialog : function(title,html,btns,noclose=false){
        // 创建DIV池
        let pool = this.create(5);
        // 标题
        pool[1].innerText = title;  // 头
        pool[1].classList.add('whead');
        if(!noclose){
            pool[2].classList.add('btn-close');
            pool[2].onclick = ()=> pool[0].remove();
            pool[1].append(pool[2]);
        }
        // 内容
        pool[3].classList.add('wbody');
        pool[3].innerHTML = html;
        // 尾部
        pool[0].classList.add('window');
        pool[0].append(pool[1],pool[3]);
        if(typeof btns == 'object'){
            pool[4].classList.add('wtool');
            for (let key in btns) {
                let prop = key.split(':'),
                    btn = document.createElement('button');
                btn.innerText = prop[0];    // 内容
                if(prop[1] != undefined && prop[1] != '')
                    btn.classList.add(prop[1]); // 按钮类
                btn.onclick = () => btns[key](pool[0]);
                pool[4].append(btn);
            }
            pool[0].append(pool[4]);
        }
        // 结束
        document.body.append(pool[0]);
        if(CONFIG.animate) this.rewrite(pool[0]);
        return pool[0];
    },
    offcv:function(head,body,direction='right'){
        let pool = this.create(3);
        // 主盒子
        pool[0].classList.add('offcv','offcv-'+direction);
        // this.rewrite(pool[0]);
        // 标题
        pool[1].classList.add('offcv-title');
        pool[1].innerText = head;
        pool[1].innerHTML += '<span class="btn-close" onclick="this.parentElement.parentElement.hidden = true;"></span>';
        // 内容物
        pool[2].classList.add('offcv-ctx');
        pool[2].innerHTML = body;
        // 完成
        pool[0].append(pool[1],pool[2]);
        document.body.append(pool[0]);
        return pool[0];
    }
};
// 初始化BOX
$.dialog.box.id = 'msg';
document.body.append($.dialog.box);

// 初始化style
{
    let style = document.createElement('style');
    style.innerHTML = `
.btn-close{
    content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>');
    height: 1em;
    width: 1em;
    transform: scale(1.2) translateY(0.2rem);
    background-color: var(--light-2);
    float: right;
    margin-right: 0.5rem;
}
#msg{
    position: fixed;
    top: 1rem;
    right: 2rem;
    max-width: 20rem;
    width: 100%;
}
#msg > *{
    width: 100%;
    box-sizing: border-box;
    padding: 0.5rem;
    border-radius: 2rem;
    display: flex;
    background-color: rgb(245 245 245 / 60%);
    margin: .5rem 0;
}
#msg b{
    margin-right: 0.5rem;
}
#msg > *::before{
    height: 1em;width: 1em;
    display: inline-block;
    margin: 0 0.5rem;
    transform: scale(1.4) translateY(0.1em);
}
#msg .error::before{
    content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"  fill="%23e5484d" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>');
}
#msg .success::before{
    content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%2330a46c" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>');
}
#msg .info::before{
    content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23#05a2c2" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>');
}
.window{
    position: fixed;
    z-index: 5;
    top: 3rem;left: 0;right: 0;
    max-width: 30rem;
    margin: auto;
    border-radius: 0.5rem;
    overflow: hidden;
}
.window::after{
    content: '';
    position: fixed;
    top: 0;left: 0;
    background-color: rgb(128 128 128 / 60%);
    width: 100vw;height: 100vh;
    z-index: -1;
}
.whead{
    padding: 0.5rem 1rem;
    color: white;
    background-color: #51b6f1;
}
.wbody{
    padding: 1rem;
    background-color: white;
    max-height:60vh;
    overflow:auto;
}
.wtool{
    padding: 0 1rem 0.5rem 0;
    text-align: right;
    background-color: white;
}
.wtool > button{
    padding: 0.5rem 1rem;
    border: solid 0.2rem white;
    background-color: #b3b1b3;
    color: white;
    border-radius: 0.5rem;
}
.wtool > button:focus{
    border-color: lightgray !important;
}
.wtool > button.success{
    background-color: #40df6a;
}
.wtool > button.info{
    background-color: #2ca0d5;
}
.wtool > button.warn{
    background-color: #f3da2b;
}
.wtool > button.danger{
    background-color: #ff6363;
}
.offcv{
    display: none;
    position:fixed;
    display:flex;
    flex-direction:column;
}
.offcv-right{
    right:0;top:0;bottom:0;
    max-width: 90vw;width:30rem;
}
.offcv-left{
    left:0;top:0;bottom:0;
}
.offcv-title{
    padding:1rem 2rem 0 2rem;
    font-size:1.1rem;font-weight:bold;
    background-color:white;
}
.offcv-ctx{
    flex-grow:1;
    overflow:auto;
    padding:1rem 2rem;
    background-color:white;
}
`;
    if(CONFIG.animate) style.innerHTML += `
@keyframes fadein{
    from{
        opacity: 0;
        transform: translateX(-2rem);
    }to{
        opacity: 1;
        transform: translateX(0);
    }
}
@keyframes fadeout{
    from{
        opacity: 1;
        transform: translateX(0);
    }to{
        opacity: 0;
        transform: translateX(2rem);
    }
}
#msg > *{
    animation: fadein 0.3s forwards;
}
.fadeout{
    animation: fadeout 0.3s forwards !important;
}
@keyframes jumpin{
    from{
        opacity: 0;
        transform: scale(0);
    }to{
        opacity: 1;
        transform: scale(1);
    }
}
.window{
    animation: jumpin 0.3s forwards;
}
`;
    document.body.append(style);
}
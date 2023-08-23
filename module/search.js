/**
 * 分组索引、搜索工具
 */
 
$.module.load('https://cdn.staticfile.org/pinyin-pro/3.16.3/index.min.js').then(function(){
    // 类:搜索引擎
    class SearchEngine{
        // 初始化引擎
        constructor(array){
            this.firstof = {},this.mixmatch = {};
            for(let item of array){
                let py = pinyinPro.pinyin(item.name,{
                        type        : 'array',
                        toneType    : 'none'
                    }),
                    first = py[0].substring(0,1).toLowerCase();// 首字母
                if(! ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].includes(first.toUpperCase()))
                    first = '#';
                if(!this.firstof[first]) this.firstof[first] = [];
                this.firstof[first].push(item);     // 首字母匹配
                this.mixmatch[`${item.name.toLowerCase()} ${py.join(' ')}`] = item;// 混合匹配
            }
        }
        // 超模糊匹配
        match(input){
            let arr = input.toLowerCase().split(''),
                matched = [],key,self = this;
            for(let item in this.mixmatch) (function(){
                // 逐字搜索 
                for(let word of arr){
                    if(item.indexOf(word) == -1) return;
                    else key = self.mixmatch[item].name.replaceAll(word,'<span style="color:red;">'+word+'</span>');
                }
                // 匹配！
                matched.push({
                    name : key , path : self.mixmatch[item].path , element : self.mixmatch[item].element
                });
            })();
            return matched;
        }
        // 首字母匹配:firstof['a']=>返回数组
    }
    
    // 显示部分内容，传入false以全部展示
    function showpart(state){
        let elems = VIEW.contentDocument.querySelectorAll('body>table#list>tbody>tr');
        if(state){  // 开始
            // 构建map
            let included = [],i = 0;
            state.forEach(ele=>included.push(ele.path));
            for(let elem of elems){
                let target = elem.getElementsByClassName('link')[0];
                if(!target.dataset.hidden)
                    elem.hidden = !included.includes(target.dataset.href),i++;
            }
            return i;
        }else{      // 取消
            for(let elem of elems) elem.hidden = false;
        }
    }

    // 初始化函数
    var engine;
    $.list.onload(function(){
        const search = VIEW.contentDocument.getElementById('search'),       // 搜索框
            ctx = VIEW.contentDocument.getElementById('content');           // 搜索内容
        var timer;
        engine = new SearchEngine($.list.list.file.concat($.list.list.dir));// 初始化引擎
        // 监听输入框
        search.onfocus = () => ctx.hidden = false,    // 获取焦点展示盒子
        search.onblur  = () => ctx.hidden = true,     // 移开隐藏盒子
        // 定时：延迟0.5s查询
        search.oninput = () => timer ? null : timer = setTimeout(function() {
            timer = null;
            var value = search.value;    // 搜索内容
            ctx.innerHTML = '';          // 覆盖
            // 没有内容
            if(value.length == 0) return;
            // 模糊匹配
            let matched = engine.match(value);
            if(matched.length == 0) ctx.innerHTML = '<a>没有匹配</a>';
            else for (var i = 0; i < matched.length; i++) {
                // 加入到内容盒子
                let {name,element} = matched[i];
                let elem = document.createElement('a');
                elem.innerHTML = name,elem.onclick = () => element.click();
                ctx.append(elem);
            }
        }, 500);
    });    // 监听加载事件

    // 左侧索引
    let div = VIEW.contentDocument.createElement('div'),tmp = '';
    // 将27个索引标准添加入div
    ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        .forEach(letter => tmp += `<div data-value="${letter}">${letter}</div>`);
    div.id = 'a-z',div.tabIndex = -1,div.onclick = function(e){
        let val = e.target.dataset.value;
        if(val == 'off') return showpart(false);// off:关闭部分隐藏
        // 点击的不是按钮则退出
        else if(typeof val != 'string' || !engine.firstof[val.toLowerCase()]) return;
        showpart(engine.firstof[val.toLowerCase()]);// 按照前缀显示文件
    },div.innerHTML = `
<style>
    #a-z{
        position: fixed;left: 0;bottom: 5rem;font-size: 1.5rem;
        padding:.25rem;border-radius: .45rem;transition:all .25s;
        border:none !important;outline:none !important;
        z-index:50;
    }
    #a-z:not(:focus){
        line-height: 2rem;
        width: 2rem;height: 2rem;
        padding: .375rem;
        background-color: #d3d3d380;color: #4672c0;
        border-radius: 0 .5rem .5rem 0;
        text-align: center;
    }
    #a-z > svg{
        display:inline-block;
        width:1.5rem;height:2rem;
    }
    #a-z > div{
        display:none;
        user-select:none;cursor:pointer;
    }
    #a-z > div *{
        pointer-events:none;
    }
    #a-z > div > svg{
        display:block;width:3rem;height:3rem;
    }
    #a-z:focus{
        background-color: #464646cc;
        width: 19rem;
        left: 1rem;
        color: white;
        box-sizing: border-box;
        display:flex;flex-wrap:wrap;
    }
    #a-z:focus > svg{
        display:none;
    }
    #a-z:focus > div{
        display:block;
        width: 3rem;line-height: 3rem;
        text-align: center;
    }
    #a-z:focus > div:hover{
        background-color: gray;
        border-radius: .3rem;
        transition: background .2s;
    }
    display: block !important;
    position: fixed;
    bottom: 3rem;
    left: 1rem;
    right: 1rem;
    width: auto;
</style>
<svg fill="currentColor" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
</svg>
<div data-value="off">
    <svg fill="currentColor" style="transform: scale(0.8);" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
</div>
<div class="show-input">
    <svg fill="none" stroke="currentColor" style="transform: scale(.55);" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
    </svg>
</div>
<div></div>`+tmp;
    div.getElementsByClassName('show-input')[0].onclick = function(){
        let input = VIEW.contentDocument.querySelector('input#search'),
            h2 = VIEW.contentDocument.getElementsByTagName('h2')[0];
        h2.tabIndex = -1;
        if(getComputedStyle(input).display == 'none')
            input.style.display = 'block',h2.onblur = ()=>input.style.display = 'none';
        else input.style.display = 'none';
    };
    document.body.append(div);
});
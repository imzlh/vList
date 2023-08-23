/**
 * 自动执行 autorun.py
 * 用于提供安全的API以阻止危险的脚本
 */

(function(){
    var reload;

    class fakeElement{
        
        #list;
        
        constructor(query){
            if(typeof query == 'string')
                this.#list = new Array(...VIEW.contentDocument.querySelectorAll(query));
            else if(typeof query.innerHTML == 'string')
                this.#list = new Array(query);
            else if(typeof query == 'object')
                this.#list = new Array(...query);
            else throw new TypeError('Unknown param passed.');
        }
        set html(html){
            if(
                html.match(/<\s*script[\w\W]*?>[\w\W]+<\/script\s*>/i) ||
                html.match(/on\w+=('|")[\w\W]+?('|")/i) ||
                html.match(/(src|href)=('|")[\w\W]+?('|")/i)
            ) throw new Error('illegal html.');
            
            this.#list.forEach(e => e.innerHTML = html);
        }
        get html(){
            return this[0].innerHTML;
        }
        set text(text){
            this.#list.forEach(e => e.innerText = text);
        }
        get text(){
            return this[0].innerText;
        }
        set val(val){
            this.#list.forEach(e => e.value = val);
        }
        get val(){
            return this[0].value;
        }
        set append(element){
            if(element instanceof fakeElement)
                this.#list.forEach(e => element.into(e));
            else if(typeof element == 'string')
                this.#list.forEach(e => e.append(element));
            else throw new Error('Failed.Unknown param.');
        }
        set before(element){
            if(element instanceof fakeElement)
                this.#list.forEach(e => {
                    if(e.children.length == 0){
                        element.into(e)
                    }else{
                        element.unshift(e);
                        
                    }
                });
            else throw new Error('Failed.Unknown param.');
        }
        get child(){
            let childs = new this();
            for(let group of this.#list)
                for(let child of group.children)
                    childs.push(child);
            return childs;
        }
        set css(info){
            for(let key in info){
                let value = info[key];
                this.#list.forEach(e => e.style[key] = value);
            }
        }
        get width(){
            return this[0].clientWidth;
        }
        set width(width){
            width += 'px';
            this.css = {
                'boxSizing' : 'border-box',
                'width'     : width
            };
        }
        get height(){
            return this[0].clientHeight;
        }
        set height(height){
            height += 'px';
            this.css = {
                'boxSizing' : 'border-box',
                'width'     : height
            };
        }
        get parent(){
            let parents = new this();
            for(let element of this)
                parents.push(element.parentElement);
            return parents;
        }
        attr(name,val){
            name = name.trim();
            if(val){
                if(['src','href'].includes(name) || name.startsWith('on'))
                    throw new Error('illegal attribute('+name+')');
                this.#list.forEach(e => e.setAttribute(name,val));
            }else return this[0].getAttribute(name);
            return this;
        }
        findChild(snip){
            let childs = new this();
            for(let group of this)
                for(let child of grop.querySelectorAll())
                    childs.push(childs);
            return child;
        }
        del(){
            this.#list.forEach(e => e.remove());
            this.destroy();
        }
        into(group){
            group.append(...this.#list);
        }
        unshift(group){
            this.#list.forEach(element => group.insertBefore(element,group.children[0]));
        }
    }

    var VM;
    const create = ()=> VM = jspython.jsPython()
        .addFunction('DOM',{
            get     : query => new fakeElement(query),
            create  : name  => name.toLowerCase() == 'script' ? null : 
                new fakeElement(VIEW.contentDocument.createElement(name)),
            body    : ()    => new fakeElement(VIEW.contentDocument.body),
            css     : ctx   => {
                let style = VIEW.contentDocument.createElement('style');
                style.innerHTML = ctx;
                VIEW.contentDocument.body.append(style);
                return new fakeElement(style);
            }
        })
        .addFunction('IO', {
            fetch   : (url,info) => fetch(url),
            list    : () => $.list.list,
            match   : $.list.match,
            reload  : $.list.refresh,
            open    : (...param) => $.fs ? $.fs.open(...param) : null
        })
        .addFunction('API' ,{
            dialog  : (...param) => $.dialog.dialog(...param),
            message : (...param) => $.dialog.msg(...param),
            alert   : ctx => $.dialog.msg('info','',ctx),
            offcv   : (...param) => $.dialog.offcv(...param),
            openfile: (...param) => $.open(...param)
        })
        .addFunction('sleep'  , sec => new Promise(rs=>setTimeout(rs, sec*1000)))
        .addFunction('int'    , float => parseInt(float))
        .addFunction('float'  , num => parseFloat(num))
        .addFunction('str'    , obj => obj.toString())
        .addFunction('Error'  , Error)
        .addFunction('pass'   , false);
    
    $.list.onload(async function(){
        for(let file of $.list.list.file){
            if(file.name.toLowerCase() == 'autorun.py') try{
                if(!window.jspython)
                    create(await $.module.load('vendor/libpy.js'));
                let res = await VM.evaluate( await(await fetch(file.path) ).text(),{
                    '__name__' : '__main__',
                    '__file__' : file.path
                });
                  if(CONFIG.debug) console.log('from autorun.py:',res);
            }catch(e){
                console.error('Failed to execute autorun.py',e.message);
            }finally{
                break;
            }
        }
    });
})();
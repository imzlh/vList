/**
 * Light NodeJS Environment.
 */

// Only cors-site is enabled.
$.module.req_cache = {};
$.module.require = async function(path){
    if(path in this.req_cache) return this.req_cache[path];
    let text = await (await fetch(path)).text(),
        script = document.createElement('script');
    script.src = URL.createObjectURL(new Blob([
        'let module = new light_module(decodeURIComponent("'+encodeURIComponent(path)+'"));',
        text
    ])),
    await new Promise(rs=>script.src = rs);
    return this.req_cache[path];
}

class light_module{
    constructor(name){
        this.name = name;
    }
    set exports(val){
        $.module.req_cache[this.name] = val;
    }
}
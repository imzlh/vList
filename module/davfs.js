(function(){
    if(!CONFIG.admin.user || !CONFIG.admin.pw)
        return $.dialog.msg('error','权限不足','请登陆');
    $.fs = {
        _get:()=>VIEW.contentDocument.location.pathname.replace(CONFIG.prefix,CONFIG.admin.prefix),
        _ajax:function(method,path,rs,rj,header){
            let xhr = new XMLHttpRequest();
            xhr.open(method.toUpperCase(),path,true,CONFIG.admin.user,CONFIG.admin.pw);
            if(typeof header == 'object')
                for(let name in header)
                    xhr.setRequestHeader(name,header[name]);
            xhr.onerror = e => rj(e),xhr.onload =  e => Math.floor(xhr.status/100) == 2 ? rs(e) : rj(e);
            if(CONFIG.debug) console.log('New XHR created.',xhr);
            return xhr;
        },
        write:(path,stream,progress)=>new Promise(function(rs,rj){
            let xhr = $.fs._ajax('PUT',path,rs,rj);
            if(progress instanceof HTMLElement)
                xhr.upload.onprogress = function(e){
                    if(!e.lengthComputable) return;
                    let prog = e.loaded / e.total * 100;
                    progress.style.width = prog + '%';
                };
            xhr.send(stream);
            return xhr;
        }),
        delete : path=>new Promise((rs,rj)=>
            $.fs._ajax('DELETE',path,rs,rj).send()
        ),
        cm:(type,from,to)=>new Promise((rs,rj)=>
            $.fs._ajax(type,from,rs,rj,{
                Destination:to
            }).send()
        ),
        mkdir:path=>new Promise((rs,rj)=>
            $.fs._ajax('MKCOL',path,rs,rj).send()
        )
    };
})();
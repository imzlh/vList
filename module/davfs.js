(function(){
    if(!CONFIG.admin.user || !CONFIG.admin.pw)
        return $.dialog.msg('error','权限不足','请登陆');
    class fileWrite{
        constructor(path){
            this.file = path,this.tmp = '',this.closed = false;
        }
        write(data){
            if(this.closed) throw new Error('FileHandle is closed');
            this.tmp += data.toString();
        }
        rewind(){
            if(this.closed) throw new Error('FileHandle is closed');
            let data = this.tmp;
            this.tmp = '';
            return data;
        }
        // 将一个stream写入另一个文件
        // 支持[files blob](推荐) ReadableStream*
        async pipe(pipe){
            if(this.closed) throw new Error('FileHandle is closed');
            if(pipe instanceof fileRW) pipe = await pipe.read(null,true);//.getReader();
            else if(pipe instanceof ReadableStream) pipe = pipe.getReader();
            else if(!(pipe instanceof ReadableStreamBYOBReader) && !(pipe instanceof ReadableStreamDefaultReader))
                throw new Error('Unknown Stream:'+pipe.constructor.name);
            if(!(pipe instanceof Blob)) {
                const chunks = [];
                let result = await pipe.read();
                while (!result.done) {
                    chunks.push(result.value);
                    result = await reader.read();
                }
                pipe = new Blob(chunks);
            }
            this.tmp = '';
            return await $.fs.write(this.file,pipe);
        }
        close(){
            if(this.closed || !this.tmp.length) return false;
            $.fs.write(this.file,this.tmp);
            return this.closed = true;
        }
    }
    
    class fileRW extends fileWrite{
        constructor(path,bin=false){
            super(path);this.seekto = 0,this.binread = bin;
        }
        seek(to){
            if(typeof to != 'number') throw new Error('seek to an illegal position');
            this.seekto = Math.floor(to);
        }
        async read(end,blob=false){
            if(this.tmp.length > 0) return blob ? new Blob([this.tmp]) : 
                (this.binread ? (new Blob([this.tmp])).stream() : this.tmp);
            var f = await fetch(this.file,{
                headers: {
                    'Range':`bytes=${this.seekto}-${end || ''}`,
                },
                cache: "no-cache"
            });
            if(!f.ok) {
                if(f.status == 416)         throw new Error('Range overflow.');
                else if(f.status == 404)    throw new Error('File not exists.');
                else                        throw new Error('Error(Server returns with'+f.statusText+')');
            }
            if(blob)                return await f.blob();
            else if(this.binread)   return await f.body;
            else                    return await f.text();
        }
    }
    
    $.fs = {
        _get:() => VIEW.contentDocument.location.pathname.replace(CONFIG.prefix,CONFIG.admin.prefix),
        _url:uri => {
            let tag = VIEW.contentDocument.createElement('a');
            tag.href = uri;
            return tag.href.replace(CONFIG.prefix,CONFIG.admin.prefix);
        },
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
        ),
        info:path=>new Promise(rs=>{
            let solve = function(){
                    if(request.status == 404){
                        type = false;
                    }else if(request.status == 200 && path.substring(path.length-1) != '/'){
                        type = request.getResponseHeader('content-type');
                    }
                    rs({
                        length : parseInt(request.getResponseHeader('content-length')),
                        type,
                        date   : new Date(request.getResponseHeader('last-modified'))
                    });
                },request = $.fs._ajax('HEAD',path,solve,solve),type = 'dir';
            request.send();
        }),
        open:function(path,mode='rw'){
            if(typeof path != 'string') throw new TypeError('Path(#1) should be string.');
            path = this._url(path);
            if(mode == 'r' || mode=='t')         return new fileWrite(path);
            else if(mode == 'rb' || mode == 'b') return new fileRW(path,true);
            else if(mode == 'rw' || mode == 'w') return new fileRW(path);
            else throw new Error('only r:read (r)w:write rb:readbin should be passed.');
        }
    };
})();
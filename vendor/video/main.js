
class vp_list extends Array{
    constructor(...args){
        super(...args);
        this.i = -1;
    }
    
    match(value,prefix){
        for(let [i,obj] of this.entries())
            if(obj[prefix||'path'] == value) return i;
        return null;
    }
    
    get(i){
        return i < 0 ? this[this.length + i] : this[i];
    }
    
    push(obj){
        if(this.match(obj)) return;
        else super.push(obj);
    }
    
    get next(){
        return this.gets(1) || this.get(0);
    }
    get last(){
        return this.gets(-1) || this.get(0);
    }
    
    gets(add){
        if(add == 0) return this[this.i];
        let i = add + this.i;
        if(i < 0 || i >= this.length) return null;
        else return this[this.i = i];
    }
}

class vp{
    // API
    $(cl){
        return this.container.getElementsByClassName('vp_'+cl);
    }
    // 初始化元素
    set element(elem){
        // 初始化元素
        this.container = elem,this.video = this.$('video')[0];
        this.e = {
            top       : this.$('toplayer')[0],
            bottom    : this.$('bottomlayer')[0],
            progress  : this.$('progress')[0].children[0],
            menu      : this.$('menu')[0],
            alert     : this.$('alert')[0],
            title     : this.$('toplayer')[0],
            layer     : this.$('layer')[0],
            vcontainer  : this.$('video_box')[0],
            playlist    : this.$('playlist')[0],
            timenow     : this.$('time_current')[0],
            timetotal   : this.$('time_total')[0],
            func:{
                pause       : this.$('func_play')[0],
                play        : this.$('func_pause')[0],
                volume      : this.$('func_volume')[0],
                requestfs   : this.$('func_requestfs')[0],
                exitfs      : this.$('func_exitfs')[0],
                tracks      : this.$('func_track')[0],
                vlist       : this.$('func_list')[0]
            }
        };
        this.proxy = async url => url;
        // ===================== API ================================
        function timeToStr(times){
            var time = times.toFixed(),
                min = Math.floor(time/60),
                sec = time%60;
            return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
        }
        // ===================== 监听事件 ===========================
        let self = this;
        this.video.addEventListener('pause',function(){
            self.e.func.pause.style.display = 'block',self.e.func.play.style.display = 'none';
        });
        this.video.addEventListener('play', function(){
            self.e.func.pause.style.display = 'none',self.e.func.play.style.display = 'block';
        });
        this.video.addEventListener('timeupdate',function(){
            self.e.progress.style.width = (this.currentTime / this.duration * 100) + '%';
            self.e.timenow.innerHTML = timeToStr(this.currentTime);
        });
        this.video.addEventListener('canplay',function(){
            self.e.timetotal.innerHTML = timeToStr(this.duration);
            if(this.dataset.rate) this.playbackRate = parseFloat(this.dataset.rate);
        });
        this.video.addEventListener('volumechange',function(){
            self.alert('当前音量'+(this.volume * 100));
        });
        this.video.addEventListener('error',function(){
            self.alert('视频加载失败！')
        });
        this.video.addEventListener('ended',()=>self.use(self.list.next));
        this.e.func.play.parentElement.onclick = ()=>self.video.paused?self.video.play():self.video.pause();
        this.container.addEventListener('dblclick', function(e){
            if(e.target.classList.contains('vp_video_box'))
                self.video.paused?self.video.play():self.video.pause();
        });
        var timer,mouse = function(){
            if(timer) clearTimeout(timer),timer = null;
            else self.e.layer.classList.add('vp_active');
            timer = setTimeout(function(){
                self.e.layer.classList.remove('vp_active');
                timer = null;
            },5000);
        };
        this.container.addEventListener('mousemove',mouse);
        this.container.addEventListener('mouseover',mouse);
        this.container.addEventListener('click',mouse);
        // this.e.bottom.addEventListener('mouseover',()=>self.e.layer.classList.add('vp_force_active'));
        // this.e.bottom.addEventListener('mouseleave',()=>self.e.layer.classList.remove('vp_force_active'));
        this.e.progress.parentElement.onclick = function(e){
            let target = self.video.duration * e.offsetX / this.clientWidth;
            self.alert('前进 '+Math.floor(target - self.video.currentTime)+' 秒!');
            self.video.currentTime = target;
        };
        this.e.func.volume.onchange = function(){
            self.video.volume = this.value;
        };
        if(!document.fullscreenEnabled) this.e.func.requestfs.parentElement.hidden = true;
        this.e.func.requestfs.parentElement.onclick = function(){
            if(document.fullscreen){
                document.exitFullscreen();
                self.e.func.requestfs.style.display = 'block',
                self.e.func.exitfs.style.display = 'none';
            }else{
                try{
                    self.container.requestFullscreen();
                }catch(e){
                    // 使用妥协的方法全屏
                    this.container.classList.contains('vp_fullscreen')?
                        this.container.classList.remove('vp_fullscreen'):
                        this.container.classList.add('vp_fullscreen');
                }
                self.e.func.requestfs.style.display = 'none',
                self.e.func.exitfs.style.display = 'block';
            }
        };
        this.$('func_speed')[0].onchange = function(value){
            let val = parseFloat(value);
            self.video.dataset.rate = self.video.playbackRate = val;
            self.alert('倍速播放: '+value+' 倍');
        };
        this.e.func.tracks.onchange = tg => tg;
        this.$('func_next')[0].onclick = ()=>self.use(self.list.next);
        this.$('func_last')[0].onclick = ()=>self.use(self.list.last);
        this.$('func_videosize')[0].onchange = function(value,element){
            self.e.vcontainer.setAttribute('style',value);
            self.alert(element.dataset.msg);
        };
        this.e.playlist.onchange = ()=>void false;
        this.$('func_loop')[0].onchange = state => self.video.loop = state;
        this.$('func_screenshot')[0].onclick = ()=>this.cat();
        // ===================== 监听大小变化 =================
        let lastW,lastH;
        self.resize = setInterval(function(){
            if(self.e.vcontainer.clientWidth != lastW ||
                self.e.vcontainer.clientHeight != lastH){
                lastW = self.e.vcontainer.clientWidth,
                lastH = self.e.vcontainer.clientHeight;
                if(self.e.vcontainer.onresize) self.e.vcontainer.onresize();
            }
        },1000)
        // ===================== 启用特性 =====================
        // 初始化dialog
        for(let element of this.$('has_dialog'))
            element.tabIndex = -1;
        // 初始化单选盒子
        for(let element of this.$('checkbox'))
            if(element.onchange)
                element.onclick = function(e){
                    if(e.target.classList.contains('selected') || !e.target.dataset.value) return;
                    for(let child of element.children)
                        child.classList.remove('selected');
                    e.target.classList.add('selected');
                    element.onchange(e.target.dataset.value,e.target);
                };
        // 初始化选择盒子
        for(let element of this.$('check'))
            if(element.onchange)
                element.onclick = function(e){
                    let selected = e.target.classList.contains('checked');
                    selected ? e.target.classList.remove('checked') : e.target.classList.add('checked');
                    element.onchange(!selected);
                };
    }
    get element(){
        return this.container;
    }
    
    // 整体初始化
    constructor (div){
        if(!(div instanceof HTMLElement || div.classList.contains('vp_container')))
            throw new TypeError('Please pass an vp Element.');
        this.element = div;
        this.list = new vp_list();
    }
    
    // 截取视频图片
    cat(){
        let canvas = document.createElement('canvas');
        let w = canvas.width = this.video.videoWidth,h = canvas.height = this.video.videoHeight;
        canvas.getContext("2d").drawImage(this.video,0,0,w,h);
        canvas.toBlob(blob=>window.open(URL.createObjectURL(blob)).onunload = function(){
            URL.revokeObjectURL(this.location.href);    // 销毁链接
        } ,"image/webp");
        this.alert('截图完成');
    }
    
    // 弹窗
    alert(msg){
        if(this._alert_timer){
            clearTimeout(this._alert_timer);
            this._alert_timer = null;
        }
        let alert = this.e.alert;
        alert.innerHTML = msg,alert.classList.add('vp_active');
        this._alert_timer = setTimeout(function(){
            alert.classList.remove('vp_active');
        },3000);
    }
    
    // 视频地址
    switch(src,subtitle){
        let video = this.video,self = this;
        if(subtitle) this.subtitle(subtitle);
        this.e.title.innerText = decodeURIComponent(src.substring(src.lastIndexOf('/')+1));
        return new Promise(async function(rs,rj){
            if(video.src == src) return rs();
            // 视频地址切换
            video.dataset.path = video.src = await self.proxy(src);//video.load();
            video.onerror = e => rj(e); // 错误
            video.oncanplay = e  => rs(e); // 成功
            video.play();
        });
    }
    
    // 添加到列表
    add(info){
        if(typeof info != 'object' || typeof info.path != 'string')
            throw new TypeError('Please check your params.');
        if(this.list.match(info)){
            for(let child of this.e.playlist.children)
                if(child.dataset.value == info.path) return child;
            throw new Error('System Error.');
        }
        let id = this.list.length;
        this.list.push(info);
        let element = document.createElement('div'),span = document.createElement('span'),
            self = this;
        element.append(span);this.e.playlist.append(element);
        span.innerText = info.name || decodeURIComponent(info.path.substring(info.path.lastIndexOf('/')+1)),
        element.dataset.value = info.path,element.onclick = 
            ()=>{self.list.i = id;self.use(info);}
        return element;
    }
    
    // 解析JSON并播放
    use(info){
        try{
            if(typeof info != 'object') throw new TypeError('无效的视频');
            if(info.path == this.video.dataset.path) return this.alert('该视频正在播放中');
            if(typeof info.subtitle == 'object') this.subtitle(info.subtitle,true);
            this.switch(info.path);
        }catch(e){
            this.alert('播放失败:'+e.message);
            console.error(e);
        }
    }
    
    // 字幕
    subtitle(src,clear){
        let self = this;
        // 清空字幕列表
        function del(){
            self.e.func.tracks.innerHTML = '';
        }
        // 截取
        function splitLast(find,string){
            let pos = string.lastIndexOf(find);
            return [string.substring(0,pos),string.substring(pos+1)];
        }
        // 取消所有字幕
        function remove(){
            self.video.innerHTML = '';                      // 清空<track>
            if(self.ass) self.ass.destroy(),self.ass = null;// 销毁ASS
            self.video.onresize = null;                     // 清空缩放事件
        }
        // 添加字幕
        function addTrack(url,def){
            if(typeof url != 'string')
                throw new TypeError('Failed to load sub:Please pass an string[]');
            let element = document.createElement('div');
            let [fake_url,ext] = splitLast('.',url),
                [,base] = splitLast('/',fake_url);
            element.innerHTML = `<span>${decodeURIComponent(base)}(${ext})</span>`,
            element.onclick = ()=>useTrack(url),element.dataset.value = url;
            self.e.func.tracks.append(element);
            if(def) element.click();
        }
        // 使用指定字幕
        async function useTrack(url,i){
            let ext = splitLast('.',url)[1];
            remove();
            if(ext == 'ass' && ASS){    // 使用libass
                try{
                    var text = await (await fetch(await self.proxy(url))).text();
                }catch(e){
                    self.alert('字幕加载失败');
                    throw new URIError('Cannot fetch subtitle!Reason:'+e.message);
                }
                // 创建ASS
                self.ass = new ASS(text, self.video,{
                    container: self.e.vcontainer,
                    resampling: 'script_width'
                });
                // 监听缩放
                var timer;
                function resize(){
                    if(!timer) setTimeout(function() {
                        timer = null;
                        self.ass.resize();  // 延迟调整大小
                    }, 100);
                }
                resize();
                self.e.vcontainer.onfullscreenchange = ()=>resize(),
                self.e.vcontainer.onresize = resize;
                self.alert('ASS字幕解析成功!');
            }else if(ext == 'vtt'){     // 使用浏览器自带的
                // self._blob = await xhr.blob();
                // let url = URL.createObjectURL(self._blob);
                let track = document.createElement('track');
                track.default = true,track.src = await self.proxy(url),
                track.onerror = ()=>self.alert('字幕加载失败'),
                track.onload = ()=> self.alert('VTT字幕加载成功!');
                self.video.innerHTML = `<track src="${url}" srckind="zh" default>`;
            }else{
                self.alert('未知的字幕格式: '+ext);
                throw new Error('Unsupport format '+ext);
            }
        }
        if(clear) remove(),del();                    // 删除字幕
        if(!src || src.length == 0) return remove(),del();// 仅仅关闭字幕
        src.forEach((url,i)=>addTrack(url,!i));      // 全部添加
    }
}
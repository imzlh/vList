/**
 * h5Video(RAW)
 */
 
{
    let box = $.tool.box('h5-player','div',`<svg fill="#cbd583" viewBox="0 0 16 16">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/>
    </svg>`,()=>
        $.dialog.dialog('选项',`
            <p>h5Player使用HTML5的Video标签播放</p>
            <p>对VTT支持很好，但是功能单一(不支持列表)</p>
            <p>你可以加载aPlayer并重新播放获取优秀体验</p>
        `,{
            "加载artPlayer:success":function(self){
                self.remove();
                $.module.load('opener/artplayer.js').then(()=>{
                    $.dialog.msg('success','成功','加载artPlayer成功',5);
                    CONFIG.opener.video(box.getElementsByTagName('video')[0].src);
                    box.innerHTML = '<h1 style="color:white">请在artPlayer中观看</h1>';
                }).catch(()=>
                    $.dialog.msg('error','失败','加载artPlayer出现错误',10)
                );
            },
            "关闭:info":function(self){
                self.remove();
            }
        })
    );
    let sty = document.createElement('style');
    sty.innerHTML = `
#view>div#h5-player>video{
    max-width:90vw;max-height:90vh;
}
#view>div#h5-player>video::cue{
    background : none;
    color:white;
    text-shadow : black .05em 0 .05em,
        black 0 .05em .05em,
        black -.05em 0 .05em,
        black 0 -.05em .05em,
        black .05em .05em .05em,
        black -.05em -.05em .05em,
        black .05em -.05em .05em,
        black -.05em .05em .05em;
    margin:.2rem;
}
#view>div#h5-player>div{
    position:fixed;
    top:calc(50vh - 5rem);right:.5rem;
    background:rgba(255,255,255,0.6);
    width:1rem;height:10rem;
    border-radius:.5rem;
    transform:rotate(0.5turn);
}
#view>div#h5-player>div>div{
    background-color: #5f88ff;
    width:100%;border-radius:.5rem;
}
`;
    // V2 添加小工具
    // let tool = document.createElement('div'),
    //     vlist = [],aid = -1,
    //     func = [
    //         {
    //             svg : ` <svg style="padding: 4px;" class="art-icon" viewBox="0 0 16 16">
    //                         <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"/>
    //                     </svg>`,
    //             title : '上一个视频',
    //             class : 'next',
    //             func : function(self){
                    
    //             }
    //         },{
    //             svg : `<svg class="art-icon" style="padding:4px;" viewBox="0 0 16 16">
    //                         <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
    //                     </svg>`,
    //             title : '下一个视频',
    //             class : 'last',
    //             func : function(){
                    
    //             }
    //         }
    //     ];
    // tool.classList.add('btns');
    // box.append(tool);
    
    
    document.body.append(sty);
    $.module.bind('video',async function(path){
        let vtt,video = document.createElement('video');
        video.src = path,video.autoplay = true,video.controls = true;
        box.innerHTML = '<div hidden><div class="volume" style="height:10rem"></div></div>';box.append(video);
        (box.autoFocus = video).focus();
        let vol = box.getElementsByClassName('volume')[0],
            vol_level = 10,vol_timer,vol_set = function(value){
                vol.parentElement.hidden = false;
                if(vol_timer) clearTimeout(vol_timer);
                vol_timer = setTimeout(function(){
                    vol.parentElement.hidden = true;
                }, CONFIG.video.notice);
                if(vol_level+value > 10 || vol_level+value < 0)
                    return $.dialog.msg('info','音量','已经极限啦',CONFIG.video.notice/1000);
                vol_level += value;
                video.volume = vol_level/10;            // 增大音量
                vol.style.height = vol_level + 'rem';   // 设置进度
            };
        video.onkeydown = function(e){
            switch (e.key) {
                case 'ArrowUp':
                    vol_set(1);
                    break;
                
                case 'ArrowDown':
                    vol_set(-1);
                    break;
                
                case 'Home':
                    video.currentTime = 0.0;
                    break;
                
                case 'End':
                    video.currentTime = video.duration;
                    break;
                    
                case 'Delete':
                    $.dialog.dialog('退出播放器',
                        '<p>确定退出播放吗?</p><p>你的播放记录不会被保存</p>',{
                            "取消:info":function(self){
                                self.remove();
                                VIEW.contentWindow.focus();
                            },"确定:danger":function(self){
                                self.remove();video.remove();
                                $.tool.view.hidden = true;
                                VIEW.contentWindow.focus();
                            }
                        });
                    break;
                    
                default:
                    return true;
            }
            e.preventDefault();return false;
        };
        $.tool.show(box);
        for(let s of $.list.match($.tool.base(path),'subtitle'))
            if(s.name.splitLast('.')[1] == 'vtt'){
                let track = document.createElement('track');
                track.default = true,track.src = s.path;
                video.append(track);
            }
    });
}
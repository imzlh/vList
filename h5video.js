/**
 * h5Video(RAW)
 */
 
{
    let box = $.tool.box('h5-player','div',`<svg fill="#cbd583" viewBox="0 0 16 16">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/>
    </svg>`,function(){
        $.dialog.dialog('选项',`
            <p>h5Player使用HTML5的Video标签播放</p>
            <p>对VTT支持很好，但是功能单一</p>
            <p>你可以加载aPlayer并重新播放获取优秀体验</p>
        `,{
            "加载artPlayer:success":function(self){
                self.remove();
                $.module.load('artplayer.js').then(()=>{
                    $.dialog.msg('success','成功','加载artPlayer成功',5);
                    box.children[0].remove();
                }).catch(()=>
                    $.dialog.msg('error','失败','加载artPlayer出现错误',10)
                );
            },
            "关闭:info":function(self){
                self.remove();
            }
        })
    });
    let sty = document.createElement('style');
    sty.innerHTML = `
#view>div#h5-player>video::cue{
    background : none;
    text-shadow : black 1px 0 1px,
        black 0 1px 1px,
        black -1px 0 1px,
        black 0 -1px 1px,
        black 1px 1px 1px,
        black -1px -1px 1px,
        black 1px -1px 1px,
        black -1px 1px 1px;
}`;
`
#view>div#h5-player>div{
    position:fixed;
    bottom:0;left:0;right:0;margin:auto;
    display:inline-block;
    background:rgba(255,255,255,0.6);
    padding:.5rem;
    border-raduis:.5rem;
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
        video.style.maxWidth = '90vw',video.style.maxHeight = '90vh';
        box.innerHTML = '';box.append(video);
        $.tool.show(box);
        $.list.match($.tool.base(path),'subtitle').forEach(s=>{
            if(s.name.splitLast('.')[1] == 'vtt'){
                let track = document.createElement('track');
                track.default = true,track.src = s.path;
                video.append(track);
            }
        });
        
    });
}
/**
 * 文件选取
 */
let style = document.createElement('style');
style.innerHTML = `
    .fpicker > span{
        display:block;
        padding: .4rem 1rem;
    }
    .fpicker > span:hover{
        background-color:#e9e5e5;
    }
    .fpicker > span.selected{
        background-color:lightgray;
    }
`;
document.body.append(style);
$.list.pick = (type,fileonly)=>new Promise(function(rs,rj){
    let list = (type == undefined || type == '*')
        ?$.list.list.file.concat(fileonly?[]:$.list.list.dir)
        :$.list.match('*',type),tmp = '';
    for(let file of list)
        tmp += `<span data-src="${file.path||file.href}">${file.name}</span>`;
    let element = $.dialog.dialog('选取文件(夹)',tmp,{
        '确定:success':function(self){
            let selected = self.getElementsByClassName('selected');
            if(!selected.length) $.dialog.msg('error','文件选取','至少选择1个文件',5);
            else{
                let select = [];
                for (var i = 0; i < selected.length; i++) 
                    select.push(selected[i].dataset.src);
                self.remove();rs(select);
            }
        },'取消:info':function(self){
            self.remove();rj();
        }
    }).getElementsByClassName('wbody')[0];
    element.classList.add('fpicker');
    element.onclick = function(e){
        if(e.target.tagName != 'SPAN') return;
        let fname = e.target.innerHTML;
        if(e.target.classList.contains('selected'))
            e.target.classList.remove('selected');
        else
            e.target.classList.add('selected');
    };
});
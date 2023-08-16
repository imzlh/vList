/**
 * view code with highlight.js
 */

// 加载VS主题
$.module.css('https://cdn.bootcdn.net/ajax/libs/highlight.js/11.6.0/styles/vs.min.css');

{
    // 语言MAP
    let l = {
        "arduino"   :   ['arduino', 'ino'],
        "apache"    :	['apache', 'apacheconf'],
        "awk"	    :   ['awk', 'mawk', 'nawk', 'gawk'],
        "bash"      :	['bash', 'sh', 'zsh'],
        "csharp"    :   ["csharp", "cs"],
        "c"         :	['c', 'h'],
        "cpp"       :   ['cpp', 'hpp', 'cc', 'hh', 'cxx', 'hxx'],
        "cmake"     :	['cmake'],
        "css"       :   ['css'],
        "dockerfile":	['docker'],
        "dos"       :	['dos', 'bat', 'cmd'],
        "dts"       :   ['dts'],
        "go"        :	['go', 'golang'],
        "gradle"    :	['gradle'],
        "xml"       :	['xml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist', 'svg'],
        "html"      :   ['html', 'xhtml'],
        "json"      :	['json'],
        "javascript":	['javascript', 'js', 'jsm', 'jsd'],
        "makefile"  :	['makefile', 'mk', 'mak', 'make'],
        "markdown"  :	['markdown', 'md', 'mkdown', 'mkd'],
        "objectivec":   ['objectivec', 'mm', 'objc'],
        "php"       :   ['php'],
        "perl"      :	['perl', 'pl', 'pm'],
        "plaintext" :	['log', 'txt', 'text'],
        "r"         :   ['r'],
        "scss"      :   ['scss'],
        "typescript":	['typescript', 'ts', 'tsx', 'mts', 'cts'],
        "vbscript"  :	['vbscript', 'vbs'],
        "yaml"      :	['yml', 'yaml']
    };
    $.module.bind('text',async function(path){
        if(typeof hljs == 'undefined'){
            await $.module.load('https://cdn.bootcdn.net/ajax/libs/highlight.js/11.6.0/highlight.min.js');
        }
        try{
            var r = await (await fetch(path)).text(),
                e = path.splitLast('.')[1];
                t = (function(){
                    for (let ty in l) 
                        if(l[ty].includes(e)) return ty;
                })() || 'plaintext';
            // await $.module.load('https://cdn.bootcdn.net/ajax/libs/highlight.js/11.6.0/languages/'+t+'.min.js');
            // hljs.registerLanguage(t, window[t]);
        }catch(e){
            $.dialog.msg('error','错误','获取数据失败',10);
            if(CONFIG.debug) throw e;
        }
        let ru = hljs.highlight(r, {language: t }).value;
        $.dialog.dialog('代码预览','<pre style="margin:0;font-size:.9rem;">'+ru+'</pre>',{
            "关闭:info":self=>self.remove(),
            "编辑:success":function(self){
                if(!$.fs) $.dialog.msg('error','失败','编辑需要权限,请先登录!',10);
                else $.module.load('module/edit.js').then(()=>self.remove($.edit(path,t)));
            }
        });
    })
}
/**
 * EditIT with MonacoEditor.
 ***********izGroup Notice************
 * 项目已经废弃，因为我们觉得已经有好用的vscode.dev了
 * 在线编辑需要考虑安全问题，而vList是可预览列表没必要实现编辑
 */

$.edit = async function open(path) {
    if (typeof require == 'undefined') {
        await $.module.load('/vendor/vs/loader.js');
        require.config({
            paths: {
                'vs': 'vendor/'
            }
        });
        require(['editor/editor.main'], async function() {
            // 获取数据
            let d = await fetch(path),
                r = await d.text(),
                lang = getLang(path);
            // 定义编辑器主题
            monaco.editor.defineTheme('myTheme', {
                base: 'vs',
                inherit: true,
                rules: [{
                        background: 'EDF9FA'
                    }
                ],
            });
            monaco.editor.setTheme('myTheme');
            let model = monaco.editor.createModel(data, language);
            globalThis.viewer = monaco.editor.create(globalThis.view, {
                model: model,
            });
            addNewEditor(data, lang);
        });
    }
}
$.editor = {
    open: function(path) {

    }
}
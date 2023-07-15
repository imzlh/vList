/**
 * Open with PhotoSwipe
 */

{
    let psbox = $.tool.box('pswp-box'), ps, imglist;
    psbox.classList.add('pswp');
    let reload = function(){
        // 初始化内容
        psbox.innerHTML = `<div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><!-- element will get class pswp__preloader--active when preloader is running --><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div>`;
        // 获取所有图片
        let img = $.list.match('*','image');
        imglist = [];
        for (var i = 0; i < img.length; i++) {
            imglist.push({
                src : img[i].path,
                msrc: img[i].path.replace(CONFIG.prefix,CONFIG.thumb_prefix)
            });
        }
        // 初始化PhotoSwipe
        ps = new PhotoSwipe( psbox, PhotoSwipeUI_Default, imglist);
        ps.init();
    };
    // 监听URL变化
    view.addEventListener('load',()=>reload());
    // 绑定模块
    $.module.bind('audio',async function(path){
        if(undefined == ps){    // 导入文件
            await $.module.css('vendor/pswd.css');
            await $.module.load('vendor/pswd.js');
            reload();
        }
        // 找到指定文件
        for (var i = 0; i < imglist.length; i++) {
            if(imglist[i].src == path);
        }
    });
}




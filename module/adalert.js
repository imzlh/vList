/**
 * 启动时弹窗
 */
if(CONFIG.alert){
    // 初始化样式
    let style = document.createElement('style');
    style.innerHTML = `
.adalert {
    position: fixed;
    bottom: 2rem;
    padding: 1rem 1.5rem;
    border-radius: .8rem;
    overflow: hidden;
    min-width: 15rem;
    background-color: rgb(255 255 255 / 80%);
    animation: adin .5s;
    animation-fill-mode: forwards;
    line-height:1.75rem;
}
.adalert a{
    text-decoration: none;
}
@keyframes adin{
    from{
        opacity:0;right: -100vw;
    }to{
        opacity:1;right:2rem;
    }
}
    `;
    document.body.append(style);
    
    // 立即弹窗
    let alert = document.createElement('div');
    alert.innerHTML = CONFIG.alert;
    alert.classList.add('adalert');
    document.body.append(alert);
    setTimeout(()=>alert.remove(), CONFIG.alert_delay || CONFIG.alert.length * 375);
}
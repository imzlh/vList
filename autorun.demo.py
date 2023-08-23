'''
    尝试autorun.py的刺激吧
    在前端使用python
    
    (!) 注意
    1. 请不要随尾分号，会报错:Unexpected symbol ';' in the end
    2. IO.open() 读写仅登陆用户使用，一般读模式就差不多了
'''
# 文件系统demo
def write_file():
    # 创建text.txt并对拷内容
    file = IO.open('text.txt','w')
    file2 = IO.open('test.txt','rw')
    # file.write('Test')
    file.write(Math.random())
    file2.pipe(file)
    file.close()
    file2.close()

# DOM示例
async def block():
    arr = [
        '不能看',
        '这是秘密',
        '私人领域',
        '违法行为',
        '居然还打开了控制台?'
    ]
    # DOM.body().html = '<h1 style="text-align:center;">不准看!</h1>'
    body = DOM.body()
    body.html = ''
    ele2 = DOM.create('h1')
    ele2.text = '看什么看?'
    ele2.attr('style','text-align:center;')
    body.append = ele2
    API.message('warn','注意','你在看什么?',10)
    API.alert('小心我举报你!')
    for i in range(10):
        sleep(1)
        print(i + 1,'<!> 危险 <!>',arr[ int( i / 2 ) ])
    raise Error('请离开!')

# XSS拦截事例
def xss():
    try:
        # 图片onerror注入
        DOM.body().html = '<img onerror="alert(\'xss\');" src="http://empty.sb"></img>'
    except:
        pass
    
    try:
        # 创建script注入
        DOM.body().append = DOM.create('script')
    except:
        pass
    
    try:
        # 修改脚本路径注入
        DOM.get('script').attr('src','eydm').attr('onerror','alert("XSS");')
    except:
        pass
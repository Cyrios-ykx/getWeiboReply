/// <reference types="chrome" />

// 嵌入页面
const div = document.createElement('div')
div.style.position = 'fixed'
div.style.transform = 'translateX(100%)'
div.style.transition = 'transform 0.5s'
div.style.zIndex = '1500'
div.style.height = '100vh'
div.style.right = '0'
div.style.top = '0'

// 折叠按钮
const button = document.createElement('div')
button.style.width = '80px'
button.style.height = '35px'
button.style.cursor = 'pointer'
button.style.borderRadius = '6px'
button.style.lineHeight = '35px'
button.style.textAlign = 'center'
button.style.color = '#fff'
button.style.backgroundColor = '#ea8011'
button.style.fontSize = '14px'
button.style.fontWeight = '500'
button.style.fontFamily =
  '-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif'
button.style.position = 'absolute'
button.style.left = '0'
button.style.top = '50%'
button.style.transform = 'translateX(-100%) translateY(-50%)'
button.innerText = '搜索评论'
button.addEventListener('click', () => {
  const insetApp = document.getElementById('get-weibo-reply')
  if (insetApp) {
    if (div.style.transform === 'translateX(100%)') {
      // document.body.style.overflowY = 'hidden'
      div.style.transform = ''
    } else if (div.style.transform === '') {
      // document.body.style.overflowY = 'scroll'
      div.style.transform = 'translateX(100%)'
    }
  }
})
div.append(button)

// 加载项目
const app = document.createElement('div')
app.id = 'get-weibo-reply'
app.style.height = '100vh'
app.style.backgroundColor = '#fff'
app.style.overflowY = 'scroll'

div.append(app)
document.body.append(div)

// 添加样式
const cssPath = ['main.css']
cssPath.forEach((item: string) => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', chrome.runtime.getURL(item))
  document.body.append(link)
})

// 嵌入js
const main_script = document.createElement('script')
main_script.setAttribute('type', 'module')
main_script.src = chrome.runtime.getURL('main.js') // 而不是popup.js
document.body.append(main_script)

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

//
const app = document.createElement('div')
app.id = 'app'
app.style.height = '100vh'
app.style.backgroundColor = '#fff'
app.style.overflowY = 'scroll'

//
div.append(app)
document.body.append(div)

// 嵌入js
const script = document.createElement('script')
script.setAttribute('type', 'module')
script.src = chrome.extension.getURL('main.js')
document.body.append(script)

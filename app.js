const express = require("express")
const moment = require('moment')
const path = require('path')

// 引入封装好的mysql文件
// const db = require("./core/mysql")

const server = express()

server.use('/static', express.static(path.join(__dirname,'/public')))
// app.use('/img/', express.static('./public/'))

server.use(express.urlencoded({ extended: false }))
server.use(express.json())

server.use('/account', require('./routers/account'))
server.use('/menus', require('./routers/menus'))
server.use('/upload', require('./routers/upload'))
server.use('/collection', require('./routers/collection'))

server.listen(8080, () => {
  console.log("启动服务器完毕!")
})
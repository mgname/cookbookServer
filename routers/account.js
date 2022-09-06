const express = require("express")
const db = require("../core/mysql")

// 创建一个路由
const router = express.Router()


// 登录
router.post('/login', require('../controller/account').login)
// 注册
router.post('/reg', require('../controller/account').register)

// 修改用户信息
router.post('/updateUser', require('../controller/account').updateUser)

module.exports = router
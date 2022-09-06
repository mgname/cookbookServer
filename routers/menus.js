const express = require("express")
const jwt = require('jwt-simple')

// 创建一个路由
const router = express.Router()

// 需要token（登录情况下），拦截，如果带了token，才能访问以下接口
router.use((req, res, next) => {
  if (req.body.token || req.query.token || req.headers.token || req.cookies.token) {
    let token = req.body.token || req.query.token || req.headers.token || req.cookies.token
    try {
      let result = jwt.decode(token, require('../config').tokenKey)
      if (result) {
        // 用户信息存入req中
        req.userinfo = result.info
        next()
      }
    } catch (error) {
      res.json({
        code: -200,
        msg: 'token失效，请重新登录'
      })
    }
  }
})


// 获取菜单列表
router.get('/getMenusList', require('../controller/menus').getMenusList)
router.get('/getAllMyMenusList', require('../controller/menus').getAllMyMenusList)
// 获取菜单详情
router.get('/getMenuDetail', require('../controller/menus').getMenuDetail)
// 获取所有菜单标题
router.get('/getMenusTitle', require('../controller/menus').getMenusTitle)
// 上传菜单
router.post('/uploadMenu', require('../controller/menus').uploadMenu)

module.exports = router
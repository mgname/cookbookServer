const express = require("express")

// 创建一个路由
const router = express.Router()

// 收藏食谱
router.get('/addCollection', require('../controller/collection').addCollection)
// 取消收藏食谱
router.get('/cancelCollection', require('../controller/collection').cancelCollection)

// 查询是否收藏
router.get('/isCollection', require('../controller/collection').isCollection)
// 获取全部收藏列表
router.get('/getAllCollectionMenus', require('../controller/collection').getAllCollectionMenus)

module.exports = router
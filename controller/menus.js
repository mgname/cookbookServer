const db = require("../core/mysql")
const moment = require('moment')

class MenusController {
  // 上传菜单
  async uploadMenu(req, res, next) {
    let params = [
      req.body.title,
      req.body.pic,
      req.body.categoryTime,
      req.body.category,
      req.body.step,
      req.body.status ? req.body.status : '1',
      moment().format('YYYY-MM-DD HH:mm:ss'),
      req.userinfo.u_id
    ]
    let uploadSql = 'INSERT INTO menu (m_title, m_pic, m_category_time, m_category, m_step, m_status, m_createtime, u_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?);'

    try {
      let result = await db.exec(uploadSql, params)
      if (result && result.affectedRows >= 1) {
        res.json({
          code: 200,
          msg: '上传成功'
        })
      } else {
        res.json({
          code: -200,
          msg: '上传失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }
  }

  // 获取菜单列表
  async getMenusList(req, res, next) {
    console.log(typeof req.query.classificationPublisher)
    // console.log(moment(1651740358900).format('YYYY-MM-DD'))
    // 如果携带搜索参数则 要加判断条件AND LOCATE('焦糖',m_title) > 0;
    let getAllMenusSql = 'SELECT COUNT(*) AS total FROM menu LEFT JOIN users ON menu.u_id=users.u_id WHERE m_status=1 AND u_status=1 AND u_status=1 AND LOCATE(? ,m_title) > 0 AND LOCATE(? ,m_category_time) > 0 AND LOCATE(? ,m_category) > 0 AND LOCATE(? ,menu.u_id) > 0;'
    
    let pageSize = req.query.pageSize ? req.query.pageSize : 5  // 每页5条
    let pageIndex = req.query.pageIndex ? req.query.pageIndex : 1 // 第几页
    let menuTitle = req.query.menuTitle ? req.query.menuTitle : ''  // 搜索菜谱标题
    let params = [menuTitle, req.query.classificationTime, req.query.classification, req.query.classificationPublisher, (pageIndex - 1) * pageSize, parseInt(pageSize)]
    let getMenusListSql = 'SELECT m_title, u_nick, m_pic, m_id FROM menu LEFT JOIN users ON menu.u_id=users.u_id WHERE m_status=1 AND u_status=1 AND LOCATE(? ,m_title) > 0 AND LOCATE(? ,m_category_time) > 0 AND LOCATE(? ,m_category) > 0 AND LOCATE(? ,menu.u_id) > 0 LIMIT ?,?;'

    // console.log(req.query.menuTitle, req.query.classificationTime, req.query.classification, req.query.classificationPublisher)
    try {
      let total = await db.exec(getAllMenusSql, [menuTitle, req.query.classificationTime, req.query.classification, req.query.classificationPublisher])
      let result = await db.exec(getMenusListSql, params)
      // console.log(result)
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '菜单列表获取成功',
          size: parseInt(pageSize),
          total: total,
          data: result
        })
      } else {
        res.json({
          code: -200,
          msg: '菜单列表获取失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }
  }

  // 获取我的全部菜单列表
  async getAllMyMenusList(req, res, next) {
    // m_status = 1
    let getAllMenusSql = 'SELECT COUNT(*) AS total FROM menu LEFT JOIN users ON menu.u_id=users.u_id WHERE LOCATE(?,m_status) > 0 AND u_status=1 AND users.u_id=?;'

    let pageSize = req.query.pageSize ? req.query.pageSize : 5  // 每页5条
    let pageIndex = req.query.pageIndex ? req.query.pageIndex : 1 // 第几页

    let getMenusListSql = 'SELECT m_title, u_nick, m_pic, m_id FROM menu LEFT JOIN users ON menu.u_id=users.u_id WHERE LOCATE(?,m_status) > 0 AND u_status=1 AND users.u_id=? LIMIT ?,?;'


    // console.log(req.query.id)

    try {
      let total = await db.exec(getAllMenusSql, [req.query.status, req.query.id])
      console.log('total')
      let result = await db.exec(getMenusListSql, [req.query.status, req.query.id, (pageIndex - 1) * pageSize, parseInt(pageSize)])

      // console.log(result)
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '菜单列表获取成功',
          size: parseInt(pageSize),
          total: total,
          data: result
        })
      } else {
        res.json({
          code: -200,
          msg: '菜单列表获取失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }
  }

  // 获取菜单详情
  async getMenuDetail(req, res, next) {
    console.log('aaa', req.query)
    let params = [
      parseInt(req.query.id)
    ]
    let getMenuDetailSql = 'SELECT * FROM menu WHERE m_id = ?;'
    try {
      let result = await db.exec(getMenuDetailSql, params)
      // console.log(result)
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '菜单详情获取成功',
          data: result
        })
      } else {
        res.json({
          code: -200,
          msg: '菜单详情获取失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }
  }

  // 获取所有菜单标题
  async getMenusTitle(req, res, next) {
    let getMenusTitleSql = 'SELECT m_title FROM menu WHERE m_status=1;'
    try {
      let result = await db.exec(getMenusTitleSql, [])
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '菜单标题获取成功',
          data: result
        })
      } else {
        res.json({
          code: -200,
          msg: '菜单标题获取失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }
  }
}

module.exports = new MenusController()
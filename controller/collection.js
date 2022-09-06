const db = require("../core/mysql")

class CollectionController {
  // 收藏食谱
  async addCollection(req, res, next) {
    // =0则插入食谱，=1 c_status改为1
    let selectSql = 'SELECT COUNT(*) AS num FROM collection WHERE u_id=? AND m_id=?;'
    let insertSql = 'INSERT INTO collection (u_id, m_id) VALUES(?, ?);'
    let updateSql = 'UPDATE collection SET c_status=1 WHERE u_id=? AND m_id=?;'
    let params = [
      req.query.uId,
      req.query.mId
    ]
    
    try {
      let result
      let data = await db.exec(selectSql, params)
      // console.log(data[0].num)
      if (data[0].num === 0) {
        console.log('insert')
        result = await db.exec(insertSql, params)
      } else if (data[0].num === 1) {
        console.log('update')
        result = await db.exec(updateSql, params)
        console.log(result.affectedRows)
      }
      if (result && result.affectedRows >= 1) {
        res.json({
          code: 200,
          msg: '收藏成功'
        })
      } else {
        res.json({
          code: -200,
          msg: '收藏失败'
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

  // 取消收藏食谱
  async cancelCollection(req, res, next) {

    let updateSql = 'UPDATE collection SET c_status=0 WHERE u_id=? AND m_id=?;'
    let params = [
      req.query.uId,
      req.query.mId
    ]
    
    try {
      let result = await db.exec(updateSql, params)
      if (result && result.affectedRows >= 1) {
        res.json({
          code: 200,
          msg: '取消收藏成功'
        })
      } else {
        res.json({
          code: -200,
          msg: '取消收藏失败'
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

  // 查询是否收藏
  async isCollection(req, res, next) {

    let selectSql = 'SELECT * FROM collection WHERE u_id=? AND m_id=? AND c_status=1;'
    let params = [
      req.query.uId,
      req.query.mId
    ]
    
    try {
      let result = await db.exec(selectSql, params)
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '已收藏'
        })
      } else {
        res.json({
          code: -200,
          msg: '未收藏'
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

  // 获取全部收藏列表
  async getAllCollectionMenus(req, res, next) {
    let getAllMenusSql = 'SELECT COUNT(*) AS total FROM collection WHERE u_id=? AND c_status=1;'

    let pageSize = req.query.pageSize ? req.query.pageSize : 5  // 每页5条
    let pageIndex = req.query.pageIndex ? req.query.pageIndex : 1 // 第几页

    let getMenusListSql = 'SELECT m_title, u_nick, m_pic, menu.m_id FROM collection INNER JOIN users on collection.u_id=users.u_id INNER JOIN menu ON collection.m_id=menu.m_id WHERE users.u_id=? AND c_status=1 LIMIT ?,?;'

    // console.log(req.query.id)

    try {
      let total = await db.exec(getAllMenusSql, [req.query.id])
      let result = await db.exec(getMenusListSql, [req.query.id, (pageIndex - 1) * pageSize, parseInt(pageSize)])

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
}

module.exports = new CollectionController()
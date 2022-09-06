const db = require("../core/mysql")
const moment = require('moment')
// json web token
const jwt = require('jwt-simple')

class AccountController {
  // 注册
  async register(req, res, next) {

    let insertSql = 'INSERT INTO users (u_name, u_pwd, u_nick, u_sex, u_birthday, u_createtime) VALUES(?, ?, ?, ?, ?, ?);'
    let params = [
      req.body.name,
      req.body.pwd,
      req.body.nick,
      req.body.sex ? req.body.sex : '男',
      moment(req.body.birthday).format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD HH:mm:ss')
    ]
    
    try {
      let result = await db.exec(insertSql, params)
      if (result && result.affectedRows >= 1) {
        res.json({
          code: 200,
          msg: '注册成功'
        })
      } else {
        res.json({
          code: -200,
          msg: '注册失败'
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

  // 登录
  async login(req, res, next) {
    let loginSql = 'SELECT u_id, u_name, u_nick ,u_sex, u_birthday, u_createtime FROM users WHERE u_name=? AND u_pwd=? AND u_status=1;'
    let params = [
      req.body.name,
      req.body.pwd
    ]
    console.log(params)
    try {
      let result = await db.exec(loginSql, params)
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '登录成功',
          data: result[0],
          token: createToken(result[0])
        })
      } else {
        res.json({
          code: -200,
          msg: '登录失败'
        })
      }
    } catch (error) {
      res.json({
        code: 500,
        msg: '服务器异常',
        error
      })
    }

    function createToken(data) {
      return jwt.encode({
        exp: Date.now() + (1000 * 60 * 60 * 24),
        info: data
      }, require('../config').tokenKey)
    }
  }

  // 修改用户信息
  async updateUser(req, res, next) {
    // 修改用户信息
    let updateSql = 'UPDATE users SET u_nick=?,u_sex=?,u_birthday=? WHERE u_id=?;'
    let params = [
      req.body.nick,
      req.body.sex ? req.body.sex : '男',
      moment(parseInt(req.body.birthday)).format('YYYY-MM-DD'),
      req.body.id
    ]

    // 返回用户信息
    let selectSql = 'SELECT u_id, u_name, u_nick ,u_sex, u_birthday, u_createtime FROM users WHERE u_id=? AND u_status=1;'

    try {
      await db.exec(updateSql, params)
      let result = await db.exec(selectSql, [req.body.id])
      if (result && result.length >= 1) {
        res.json({
          code: 200,
          msg: '修改信息成功',
          data: result[0]
        })
      } else {
        res.json({
          code: -200,
          msg: '修改信息失败'
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

module.exports = new AccountController()
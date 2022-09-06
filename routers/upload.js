const express = require("express")

const multer = require('multer')
const path = require('path')
const fs = require('fs');

// 创建一个路由
const router = express.Router()


//设置临时目录 存放上传的图片
const upload = multer({dest: "tmp/"})

router.post("/uploadImg", upload.single("file"), (req, res) => {
  let imgFile = req.file;//获取图片上传的资源
  console.log(imgFile)
  let tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = "../public/images/" + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  console.log('http://192.168.1.5:8080/static/images/' + newName)
  let newurl = 'http://192.168.1.5:8080/static/images/' + newName;

  res.send(newurl)//上传成功之后  给客户端响应
})

module.exports = router

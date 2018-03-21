const express = require('express')
const password = require('../controllers/password')

const route = express.Router()

// 查询密码
route.get('/passwords', password.getPasswords.bind(password))
// 添加密码
route.post('/password', password.addPassword.bind(password))
// 编辑密码
route.put('/password/:id', password.editPassword.bind(password))
// 删密码
route.delete('/password/:id', password.deletePassword.bind(password))

module.exports = route

const express = require('express')
const user = require('../controllers/user')

const route = express.Router()

// 账户
route.post('/login', user.login.bind(user))
route.post('/register', user.register.bind(user))
route.put('/user', user.updateUserInfo.bind(user))
route.post('/getValidCode', user.getValidCode.bind(user))
route.put('/password', user.changePassword.bind(user))

module.exports = route

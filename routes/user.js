const express = require('express')
const user = require('../controllers/user')

const route = express.Router()

// 账户
route.post('/api/login', user.login.bind(user))
route.post('/api/register', user.register.bind(user))
// route.put('/api/user', user.updateUserInfo.bind(user))
// route.post('/api/getValidCode', user.getValidCode.bind(user))
// route.put('/api/password', user.changePassword.bind(user))

module.exports = route

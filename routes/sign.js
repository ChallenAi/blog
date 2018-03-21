const express = require('express')
const sign = require('../controllers/sign')

const route = express.Router()

// 签到
route.post('/sign', sign.sign.bind(sign))
route.get('/signs', sign.getSigns.bind(sign))

module.exports = route

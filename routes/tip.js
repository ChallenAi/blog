const express = require('express')
const tip = require('../controllers/tip')

const route = express.Router()

// 根据条件查询tip
route.get('/api/tips', tip.getTips.bind(tip))
// 添加tip
route.post('/api/tip', tip.addTip.bind(tip))
// 编辑tip
route.put('/api/tip/:id', tip.editTip.bind(tip))
// 删tip
route.delete('/api/tip/:id', tip.deleteTip.bind(tip))

module.exports = route

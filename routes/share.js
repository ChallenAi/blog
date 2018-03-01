const express = require('express')
const share = require('../controllers/share')

const route = express.Router()

// 查询所有分享
route.get('/shares', share.getShares.bind(share))
// 添加分享
route.post('/share', share.addShare.bind(share))
// 编辑分享
route.put('/share/:id', share.editShare.bind(share))
// 删分享
route.delete('/share/:id', share.deleteShare.bind(share))

module.exports = route

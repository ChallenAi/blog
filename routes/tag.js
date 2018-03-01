const express = require('express')
const tag = require('../controllers/tag')

const route = express.Router()

// 根据条件查询标签
route.get('/api/tags', tag.getTags.bind(tag))
// 添加标签
route.post('/api/tag', tag.addTag.bind(tag))
// 编辑标签
route.put('/api/tag/:id', tag.editTag.bind(tag))
// 删标签
route.delete('/api/tag/:id', tag.deleteTag.bind(tag))

module.exports = route

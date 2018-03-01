const express = require('express')
const tag = require('../controllers/tag')

const route = express.Router()

// 根据条件查询标签
route.get('/tags', tag.getTags.bind(tag))
// 添加标签
route.post('/tag', tag.addTag.bind(tag))
// 编辑标签
route.put('/tag/:id', tag.editTag.bind(tag))
// 删标签
route.delete('/tag/:id', tag.deleteTag.bind(tag))

module.exports = route

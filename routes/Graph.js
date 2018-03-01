const express = require('express')
const graph = require('../controllers/graph')

const route = express.Router()

// 查询图所有节点
route.get('/nodes', graph.getNodes.bind(graph))
// 添加节点
route.post('/node', graph.addNode.bind(graph))
// 编辑节点
route.put('/node', graph.editNode.bind(graph))
// 删密节点
route.delete('/node', graph.deleteNode.bind(graph))

module.exports = route

const express = require('express')
const stock = require('../controllers/stock')

const route = express.Router()

// 股票
route.post('/stock/follow', stock.followStock.bind(stock))
route.post('/stock/unfollow', stock.unfollowStock.bind(stock))
route.get('/stocks', stock.getStocks.bind(stock))
route.get('/myStocks', stock.getMyStocks.bind(stock))

module.exports = route

const express = require('express')
const qs = require('../controllers/qs')

const route = express.Router()

// 量化选股和今日关注
route.get('/stock/quantifications', qs.getQuantifications.bind(qs))
route.get('/stock/categorys', qs.getCategorys.bind(qs))
route.get('/stock/focuses', qs.getFocuses.bind(qs))

module.exports = route

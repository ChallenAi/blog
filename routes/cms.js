const express = require('express')
const cms = require('../controllers/cms')

const route = express.Router()

// 学院内容
// route.post('/article', cms.addArticle.bind(cms))
route.get('/articles', cms.getArticles.bind(cms))
route.get('/categorys', cms.getCategorys.bind(cms))
route.get('/article/:articleId', cms.getArticle.bind(cms))
route.get('/adCotegorys', cms.getAdCotegorys.bind(cms))
route.get('/ads', cms.getAds.bind(cms))

module.exports = route

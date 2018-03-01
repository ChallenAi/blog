const express = require('express')
const article = require('../controllers/article')

const route = express.Router()

// 查找文章列表
route.get('/api/articles', article.getArticles.bind(article))
// 根据类别获取文章标题
route.get('/api/articlesTitles', article.getArticlesTitles.bind(article))
// 获取文章
route.get('/api/article/:id', article.getArticle.bind(article))
// 发送文章
route.post('/api/article', article.postArticle.bind(article))

module.exports = route

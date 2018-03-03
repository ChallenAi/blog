const express = require('express')
const bookmark = require('../controllers/bookmark')

const route = express.Router()

// 查找书签
route.get('/api/bookmarks', bookmark.getBookmarks.bind(bookmark))
// 删书签
route.delete('/api/bookmark/:id', bookmark.deleteBookmark.bind(bookmark))

module.exports = route

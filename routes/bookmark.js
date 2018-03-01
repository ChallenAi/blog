const express = require('express')
const bookmark = require('../controllers/bookmark')

const route = express.Router()

// 查找书签
route.get('/bookmarks', bookmark.getBookmarks.bind(bookmark))
// 删书签
route.delete('/bookmark/:id', bookmark.deleteBookmark.bind(bookmark))

module.exports = route

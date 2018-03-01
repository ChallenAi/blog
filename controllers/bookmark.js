const Controller = require('../base/Controller')
const bookmarkService = require('../business/bookmark')

class BookmarkController extends Controller {
    /**
     * @api {get} /bookmarks 根据条件查询书签
     * @apiVersion 1.0.0
     * @apiName getBookmarks
     * @apiGroup bookmark_new
     * @apiPermission anyone
     *
     * @apiParam {String} cotegoryId 书签名
     * @apiParam {String} pageNumber 第几页
     * @apiParam {String} pageSize 每页几条数据
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "id": "1",
     *         "desc": "Project Structure",
     *         "url": "http://vuejs-templates.gith.io",
     *         "add_time": "Thu, 23 Mar 2017 17:49:37 GMT",
     *         "icon": "data:image/png;base64,iVB"
     *       }
     *     ]
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getBookmarks(req, res, next) {
        try {
            let limit
            let offset = 0
            if (req.query.pageSize) limit = parseInt(req.query.pageSize || 20, 10)
            if (req.query.pageNumber) {
                offset = parseInt((req.query.pageNumber - 1) * limit, 10)
            }
            const resu = await bookmarkService
                .getArticles({
                    categoryId: req.query.categoryId,
                    limit,
                    offset,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {delete} /bookmark/<id> 根据id删除书签
     * @apiVersion 1.0.0
     * @apiName deleteBookmark
     * @apiGroup bookmark_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少文章id
     *   {
     *     "code": 500,
     *     "msg": "缺少文章id"
     *   }
     *
     * @apiErrorExample {json} 未找到书签
     *   {
     *     "code": 500,
     *     "msg": "未找到书签"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async deleteBookmark(req, res, next) {
        if (!req.params.articleId) return this.reqFail(res, '缺少文章id')
        try {
            const resu = await bookmarkService.deleteBookmark({
                articleId: req.params.articleId,
            })
            return this.querySuccess(res, resu)
        } catch (err) {
            if (err.message === 'BadArticleId') {
                return this.reqFail(res, '无效的文章id')
            }
            next(err)
        }
    }
}

module.exports = new BookmarkController()

const Controller = require('../base/Controller')
const articleService = require('../business/article')

class ArticleController extends Controller {
    /**
     * @api {get} /articles 根据条件查询文章
     * @apiVersion 1.0.0
     * @apiName getarticles
     * @apiGroup article_new
     * @apiPermission anyone
     *
     * @apiParam {String} deleted 是否被删除,'1'是选择已被删的，其他则是选未删除的，不传deleted则会查询所有的
     * @apiParam {String} uid 根据用户id查帖子
     * @apiParam {String} typeId 根据标签id来查找帖子
     * @apiParam {String} pageNumber 第几页
     * @apiParam {String} pageSize 每页几条数据
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "count": 1, 
     *     "data": [
     *       {
     *         "articleId": "1",
     *         "userId": "1",
     *         "title": "标题",
     *         "content": "### 则是一片文章的征文",
     *         "typeId": "1",
     *         "view": "0",
     *         "like": "0",
     *         "collect": "0",
     *         "rank": "0",
     *         "deleted": false,
     *         "createdAt": "2018-03-01T14:45:35.000Z",
     *         "updatedAt": "2018-03-01T14:45:38.000Z"
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
    async getArticles(req, res, next) {
        try {
            const q = req.query
            // 查询参数
            const condition = {}
            // 查询参数：带默认值的，必须有的
            condition.deleted = (q.deleted === '1')?true:false
            const page = parseInt(q.page || 1)
            const limit = parseInt(q.perpage || 10)
            const offset = limit * (page - 1)
            // 如果查询特定用户/类型的文章
            if (q.uid) condition.userId = q.uid
            if (q.typeId) condition.typeId = q.typeId
            const resu = await articleService
                .getArticles({
                    condition,
                    limit,
                    offset,
                })
            return this.querySuccessCount(res, resu, resu.length)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /articles 根据条件查询文章标题
     * @apiVersion 1.0.0
     * @apiName getarticles
     * @apiGroup article_new
     * @apiPermission anyone
     *
     * @apiParam {String} typeId(必须) 根据标签id来查找帖子
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "count": 1, 
     *     "data": [
     *       {
     *         "articleId": "1",
     *         "title": "标题",
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
    async getArticlesTitles(req, res, next) {
        try {
            const q = req.query
            if (!q.typeId) return this.reqFail(res, '缺少类别id')
            const resu = await articleService
                .getTitles({ deleted: false, typeId: q.typeId })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {delete} /article/<id> 根据id删除文章
     * @apiVersion 1.0.0
     * @apiName deletearticle
     * @apiGroup article_new
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
     * @apiErrorExample {json} 未找到文章
     *   {
     *     "code": 500,
     *     "msg": "未找到文章"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async deleteArticle(req, res, next) {
        // if (!req.params.articleId) return this.reqFail(res, '缺少文章id')
        // try {
        //     const resu = await articleService.deletearticle({
        //         articleId: req.params.articleId,
        //     })
        //     return this.querySuccess(res, resu)
        // } catch (err) {
        //     if (err.message === 'BadArticleId') {
        //         return this.reqFail(res, '无效的文章id')
        //     }
        //     next(err)
        // }
    }

    /**
     * @api {delete} /article/<id> 根据id删除文章
     * @apiVersion 1.0.0
     * @apiName deletearticle
     * @apiGroup article_new
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
     * @apiErrorExample {json} 未找到文章
     *   {
     *     "code": 500,
     *     "msg": "未找到文章"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getArticle(req, res, next) {
        if (!req.params.id) return this.reqFail(res, '缺少文章id')
        try {
            const resu = await articleService.getArticle(req.params.id)
            return this.querySuccess(res, resu)
        } catch (err) {
            if (err.message === 'BadArticleId') {
                return this.reqFail(res, '无效的文章id')
            }
            next(err)
        }
    }

    /**
     * @api {delete} /article/<id> 根据id删除文章
     * @apiVersion 1.0.0
     * @apiName deletearticle
     * @apiGroup article_new
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
     * @apiErrorExample {json} 未找到文章
     *   {
     *     "code": 500,
     *     "msg": "未找到文章"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async postArticle(req, res, next) {
        // if (!req.params.articleId) return this.reqFail(res, '缺少文章id')
        // try {
        //     const resu = await articleService.deletearticle({
        //         articleId: req.params.articleId,
        //     })
        //     return this.querySuccess(res, resu)
        // } catch (err) {
        //     if (err.message === 'BadArticleId') {
        //         return this.reqFail(res, '无效的文章id')
        //     }
        //     next(err)
        // }
    }
}

module.exports = new ArticleController()

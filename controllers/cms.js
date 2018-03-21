const Controller = require('../base/Controller')
const cmsService = require('../business/cms')

class CmsController extends Controller {
    /**
     * @api {post} /article 发文章
     * @apiVersion 1.0.0
     * @apiName addArticle
     * @apiGroup article
     * @apiPermission logginedIn
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "title": "文章标题"
     *   }
     *
     * @apiSuccessExample {json} 成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少标题
     *   {
     *     "code": 400,
     *     "msg": "缺少标题"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async addArticle(req, res, next) {
        if (!this.loggedIn(res)) return
        const d = req.body
        try {
            if (!d.title) return this.reqFail(res, '缺少标题')
            const resu = await cmsService.addArticle({
                title: d.title,
            })
            return this.success(res)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /articles 查询文章列表
     * @apiVersion 1.0.0
     * @apiName getArticles
     * @apiGroup article
     * @apiPermission anyone
     *
     * @apiParam {String} cotegoryId 文章类别id
     * @apiParam {String} pageNumber 第几页
     * @apiParam {String} pageSize 每页几条数据
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "cmsContentId": "1",
     *         "contentType": "text",
     *         "title": "基本面学习",
     *         "author": "选股大师",
     *         "addTime": "2017-12-08 00:01:01",
     *         "published": 1,
     *         "description": "简述...",
     *         "content": "cccc",
     *         "thumbnailUrl": "https://",
     *         "collectQty": 0,
     *         "goodQty": 0
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
            let limit
            let offset = 0
            if (req.query.pageSize) limit = parseInt(req.query.pageSize || 20, 10)
            if (req.query.pageNumber) {
                offset = parseInt((req.query.pageNumber - 1) * limit, 10)
            }
            const resu = await cmsService
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
     * @api {get} /categorys 查询内容分类
     * @apiVersion 1.0.0
     * @apiName getCategorys
     * @apiGroup article
     * @apiPermission anyone
     *
     * @apiParam {String} parentId 父类别id(-1/1/...)
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {"categoryId": "2", "categoryCode": "college_basic", "categoryName": "基本面"},
     *       {"categoryId": "3", "categoryCode": "college_tec", "categoryName": "技术面"}
     *     ]
     *   }
     *
     * @apiErrorExample {json} 缺少父类别id
     *   {
     *     "code": 500,
     *     "msg": "缺少父类别id"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getCategorys(req, res, next) {
        if (!req.query.parentId) return this.reqFail(res, '缺少父类别id')
        try {
            const resu = await cmsService
                .getCategorys({ parentId: req.query.parentId })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /article/<id> 根据id查询文章
     * @apiVersion 1.0.0
     * @apiName getArticle
     * @apiGroup article
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": {
     *       "cmsContentId": "1",
     *       "contentType": "text",
     *       "title": "基本面学习",
     *       "author": "选股大师",
     *       "addTime": "2017-12-08 00:01:01",
     *       "published": 1,
     *       "description": "简述...",
     *       "content": "cccc",
     *       "thumbnailUrl": "https://",
     *       "collectQty": 0,
     *       "goodQty": 0
     *     }
     *   }
     *
     * @apiErrorExample {json} 缺少文章id
     *   {
     *     "code": 500,
     *     "msg": "缺少文章id"
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
        if (!req.params.articleId) return this.reqFail(res, '缺少文章id')
        try {
            const resu = await cmsService.getArticle({
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

    /**
     * @api {get} /adCotegorys 查询轮播图分类
     * @apiVersion 1.0.0
     * @apiName getAdCotegorys
     * @apiGroup article
     * @apiPermission anyone
     *
     * @apiParam {String} parentId 父类别id(-1/1/...)
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {"categoryId": "2", "categoryCode": "college", "categoryName": "学院广告"},
     *       {"categoryId": "3", "categoryCode": "college_tec", "checkIn": "每日签到"}
     *     ]
     *   }
     *
     * @apiErrorExample {json} 缺少父类别id
     *   {
     *     "code": 500,
     *     "msg": "缺少父类别id"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getAdCotegorys(req, res, next) {
        if (!req.query.parentId) return this.reqFail(res, '缺少父类别id')
        try {
            const resu = await cmsService
                .getAdCotegorys({ parentId: req.query.parentId })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /ads 查询轮播图列表
     * @apiVersion 1.0.0
     * @apiName getAds
     * @apiGroup article
     * @apiPermission anyone
     *
     * @apiParam {String} adCategoryId 轮播图类别id
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "cmsAdContentId": "1",
     *         "cmsAdCategoryId": "1",
     *         "thumbnailUrl": "dfbwvjwkc.png",
     *         "linkUrl": "sina.com",
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
    async getAds(req, res, next) {
        const d = req.body
        try {
            const resu = await cmsService.getAds({
                adCategoryId: req.query.adCategoryId,
            })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new CmsController()

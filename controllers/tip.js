const Controller = require('../base/Controller')
const tipService = require('../business/tip')

class TipController extends Controller {
    /**
     * @api {get} /tips 根据条件查询gist
     * @apiVersion 1.0.0
     * @apiName getTips
     * @apiGroup tip_new
     * @apiPermission anyone
     *
     * @apiParam {String} deleted 是否被删除,'1'是选择已被删的，其他则是选未删除的，不传deleted则会查询所有的
     * @apiParam {String} keyword 根据关键词来查找tip
     * @apiParam {String} typeId 根据标签id来查找tip
     * @apiParam {String} pageNumber 第几页
     * @apiParam {String} pageSize 每页几条数据
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "count": 1, 
     *     "data": [
     *       {
     *         "tipId": "1",
     *         "userId": "1",
     *         "title": "标题",
     *         "content": "### 则是一片gist的征文",
     *         "typeId": "1",
     *         "is_deleted": false,
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
    async getTips(req, res, next) {
        try {
            const q = req.query
            // 查询参数
            const condition = {}
            // 查询参数：带默认值的，必须有的
            condition.deleted = (q.deleted === '1')?true:false
            const page = parseInt(q.page || 1)
            const limit = parseInt(q.perpage || 50)
            const offset = limit * (page - 1)
            // 如果查询特定类型的gist
            if (q.typeId) condition.typeId = q.typeId
            if (q.keyword) condition.keyword = q.keyword
            const resu = await tipService
                .getTips({
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
     * @api {delete} /tip/<id> 根据id删除gist
     * @apiVersion 1.0.0
     * @apiName deleteBookmark
     * @apiGroup bookmark_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 删除成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少gistId
     *   {
     *     "code": 500,
     *     "msg": "缺少gistId"
     *   }
     *
     * @apiErrorExample {json} 未找到gist
     *   {
     *     "code": 500,
     *     "msg": "未找到gist"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async deleteTip(req, res, next) {
        if (!req.params.id) return this.reqFail(res, '缺少gistId')
        try {
            await tipService.deleteTip({
                tipId: req.params.id,
            })
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadTipId') {
                return this.reqFail(res, '无效的gistId')
            }
            next(err)
        }
    }

    /**
     * @api {post} /tip/<id> 根据id编辑
     * @apiVersion 1.0.0
     * @apiName deleteTip
     * @apiGroup tip_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少gistId
     *   {
     *     "code": 500,
     *     "msg": "缺少gistId"
     *   }
     *
     * @apiErrorExample {json} 未找到gist
     *   {
     *     "code": 500,
     *     "msg": "未找到gist"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async editTip(req, res, next) {
        if (!req.params.id) return this.reqFail(res, '缺少gistId')
        const { title, content, typeId } = req.body
        const updation = {}
        if (title) updation.title = title
        if (content) updation.content = content
        if (typeId) updation.tag_id = typeId

        if (!title && !content && !typeId) return this.reqFail(res, '没有可编辑的内容')

        try {
            await tipService.editTip(req.params.id, updation)
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadTipId') {
                return this.reqFail(res, '无效的gistId')
            }
            next(err)
        }
    }

    /**
     * @api {post} /tip/<id> 新增gist
     * @apiVersion 1.0.0
     * @apiName addTip
     * @apiGroup tip_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少gistId
     *   {
     *     "code": 500,
     *     "msg": "缺少gistId"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async addTip(req, res, next) {
        const { title, content, authorId, typeId } = req.body
        if (!title) return this.reqFail(res, '缺少gist标题')
        if (!content) return this.reqFail(res, '缺少gist内容')
        if (!authorId) return this.reqFail(res, '无效的作者id')
        if (!typeId) return this.reqFail(res, '无效的类型id')
        try {
            await tipService.addTip({
                title, content, authorId, typeId,
            })
            return this.success(res)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new TipController()

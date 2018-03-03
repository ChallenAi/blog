const Controller = require('../base/Controller')
const shareService = require('../business/share')

class ShareController extends Controller {
    /**
     * @api {get} /shares 根据条件查询分享
     * @apiVersion 1.0.0
     * @apiName getShares
     * @apiGroup share_new
     * @apiPermission anyone
     *
     * @apiParam {String} deleted 是否被删除,'1'是选择已被删的，其他则是选未删除的，不传deleted则会查询所有的
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
     *         "shareId": "1",
     *         "userId": "1",
     *         "title": "标题",
     *         "content": "### 则是一片分享的征文",
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
    async getShares(req, res, next) {
        try {
            const q = req.query
            // 查询参数
            const condition = {}
            // 查询参数：带默认值的，必须有的
            condition.deleted = (q.deleted === '1')?true:false
            const page = parseInt(q.page || 1)
            const limit = parseInt(q.perpage || 50)
            const offset = limit * (page - 1)
            // 如果查询特定类型的分享
            if (q.typeId) condition.typeId = q.typeId
            const resu = await shareService
                .getShares({
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
     * @api {delete} /bookmark/<id> 根据id删除分享
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
     * @apiErrorExample {json} 缺少分享id
     *   {
     *     "code": 500,
     *     "msg": "缺少分享id"
     *   }
     *
     * @apiErrorExample {json} 未找到分享
     *   {
     *     "code": 500,
     *     "msg": "未找到分享"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async deleteShare(req, res, next) {
        if (!req.params.id) return this.reqFail(res, '缺少分享id')
        try {
            await shareService.deleteShare({
                shareId: req.params.id,
            })
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadShareId') {
                return this.reqFail(res, '无效的分享id')
            }
            next(err)
        }
    }

    /**
     * @api {post} /share/<id> 根据id编辑
     * @apiVersion 1.0.0
     * @apiName deleteshare
     * @apiGroup share_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少分享id
     *   {
     *     "code": 500,
     *     "msg": "缺少分享id"
     *   }
     *
     * @apiErrorExample {json} 未找到分享
     *   {
     *     "code": 500,
     *     "msg": "未找到分享"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async editShare(req, res, next) {
        if (!req.params.id) return this.reqFail(res, '缺少分享id')
        try {
            const resu = await shareService.editShare(req.params.id)
            return this.querySuccess(res, resu)
        } catch (err) {
            if (err.message === 'BadshareId') {
                return this.reqFail(res, '无效的分享id')
            }
            next(err)
        }
    }

    /**
     * @api {post} /share/<id> 新增分享
     * @apiVersion 1.0.0
     * @apiName addShare
     * @apiGroup share_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少分享id
     *   {
     *     "code": 500,
     *     "msg": "缺少分享id"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async addShare(req, res, next) {
        const { title, content, authorId, typeId } = req.body
        if (!title) return this.reqFail(res, '缺少分享标题')
        if (!content) return this.reqFail(res, '缺少分享内容')
        if (!authorId) return this.reqFail(res, '无效的作者id')
        if (!typeId) return this.reqFail(res, '无效的类型id')
        try {
            await shareService.addShare({
                title, content, authorId, typeId,
            })
            return this.success(res)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ShareController()

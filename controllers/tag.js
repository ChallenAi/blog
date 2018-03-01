const Controller = require('../base/Controller')
const tagService = require('../business/tag')

class TagController extends Controller {
    /**
     * @api {get} /tags 根据条件查询标签
     * @apiVersion 1.0.0
     * @apiName gettags
     * @apiGroup tag_new
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
     *         "tagId": "1",
     *         "userId": "1",
     *         "title": "标题",
     *         "content": "### 则是一片标签的征文",
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
    async getTags(req, res, next) {
        try {
            const resu = await tagService
                .getTags()
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {delete} /tag/<id> 根据id删除标签
     * @apiVersion 1.0.0
     * @apiName deletetag
     * @apiGroup tag_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少标签id
     *   {
     *     "code": 500,
     *     "msg": "缺少标签id"
     *   }
     *
     * @apiErrorExample {json} 未找到标签
     *   {
     *     "code": 500,
     *     "msg": "未找到标签"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async deleteTag(req, res, next) {
        // if (!req.params.tagId) return this.reqFail(res, '缺少标签id')
        // try {
        //     const resu = await tagService.deletetag({
        //         tagId: req.params.tagId,
        //     })
        //     return this.querySuccess(res, resu)
        // } catch (err) {
        //     if (err.message === 'BadtagId') {
        //         return this.reqFail(res, '无效的标签id')
        //     }
        //     next(err)
        // }
    }

    /**
     * @api {delete} /tag/<id> 根据id删除标签
     * @apiVersion 1.0.0
     * @apiName deletetag
     * @apiGroup tag_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少标签id
     *   {
     *     "code": 500,
     *     "msg": "缺少标签id"
     *   }
     *
     * @apiErrorExample {json} 未找到标签
     *   {
     *     "code": 500,
     *     "msg": "未找到标签"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async editTag(req, res, next) {
        // if (!req.params.tagId) return this.reqFail(res, '缺少标签id')
        // try {
        //     const resu = await tagService.deletetag({
        //         tagId: req.params.tagId,
        //     })
        //     return this.querySuccess(res, resu)
        // } catch (err) {
        //     if (err.message === 'BadtagId') {
        //         return this.reqFail(res, '无效的标签id')
        //     }
        //     next(err)
        // }
    }

    /**
     * @api {delete} /tag/<id> 根据id删除标签
     * @apiVersion 1.0.0
     * @apiName deletetag
     * @apiGroup tag_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少标签id
     *   {
     *     "code": 500,
     *     "msg": "缺少标签id"
     *   }
     *
     * @apiErrorExample {json} 未找到标签
     *   {
     *     "code": 500,
     *     "msg": "未找到标签"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async addTag(req, res, next) {
        // if (!req.params.tagId) return this.reqFail(res, '缺少标签id')
        // try {
        //     const resu = await tagService.deletetag({
        //         tagId: req.params.tagId,
        //     })
        //     return this.querySuccess(res, resu)
        // } catch (err) {
        //     if (err.message === 'BadtagId') {
        //         return this.reqFail(res, '无效的标签id')
        //     }
        //     next(err)
        // }
    }
}

module.exports = new TagController()

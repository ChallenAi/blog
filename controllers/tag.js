const Controller = require('../base/Controller')
const tagService = require('../business/tag')

class TagController extends Controller {
    /**
     * @api {get} /tags 根据条件查询标签
     * @apiVersion 1.0.0
     * @apiName getTags
     * @apiGroup tag_new
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *           "id": "1",
     *           "name": "root",
     *           "children": [
     *             {
     *                 "id": "2",
     *                 "name": "机器学习",
     *                 "children": []
     *             },
     *             {
     *                 "id": "6",
     *                 "name": "web",
     *                 "children": [
     *                     {
     *                         "id": "7",
     *                         "name": "javascript",
     *                         "children": [
     *                           {
     *                               "id": "9",
     *                               "name": "react",
     *                               "children": []
     *                           }
     *                        ]
     *                     }
     *                 ]
     *             }
     *         ]
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
     * @api {get} /tags 根据条件查询标签
     * @apiVersion 1.0.0
     * @apiName getTags
     * @apiGroup tag_new
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *           "id": "1",
     *           "name": "root",
     *           "children": [
     *             {
     *                 "id": "2",
     *                 "name": "机器学习",
     *                 "children": []
     *             },
     *             {
     *                 "id": "6",
     *                 "name": "web",
     *                 "children": [
     *                     {
     *                         "id": "7",
     *                         "name": "javascript",
     *                         "children": [
     *                           {
     *                               "id": "9",
     *                               "name": "react",
     *                               "children": []
     *                           }
     *                        ]
     *                     }
     *                 ]
     *             }
     *         ]
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getTagsTree(req, res, next) {
        try {
            const resu = await tagService
                .getTags()

            const arrToTree = nodes => {
                // 先排序
                nodes.sort((i, j) => i.id - j.id)
                // 根节点的父元素id
                const rootParentId = 0, map = {}, roots = [];
                let node;
                for (let i = 0; i < nodes.length; i += 1) {
                    //获取当前元素
                    node = nodes[i];
                    node.children = [];
                    // 键是当前元素id, 值是idx
                    map[node.id] = i; // 使用map来找到parent
                    if (node.parentId !== rootParentId) {
                        // 节点中的id等于当前节点父id的元素.children
                        // 即找寻到了当前节点的父元素
                        nodes[map[node.parentId]].children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots
            }

            const tagsTree = arrToTree(resu)

            // 遍历对象树,格式化成前端需要的格式
            const ObjTreeTravel = node => {
                node.name = node.content
                delete node.content
                delete node.parentId
                if (node.children.length === 0 ) {
                    delete node.children
                } else {
                    node.children.map(ObjTreeTravel)
                }
            }

            tagsTree.map(ObjTreeTravel)

            return this.querySuccess(res, tagsTree[0])
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {delete} /tag/<id> 根据id删除标签
     * @apiVersion 1.0.0
     * @apiName deleteTag
     * @apiGroup tag_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 删除成功
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
        if (!req.params.id) return this.reqFail(res, '缺少标签id')
        try {
            await tagService.deleteTag({
                tagId: req.params.id,
            })
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadTagId') {
                return this.reqFail(res, '无效的标签id')
            }
            next(err)
        }
    }

    /**
     * @api {post} /tag/<id> 根据id编辑
     * @apiVersion 1.0.0
     * @apiName editTag
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
        if (!req.params.id) return this.reqFail(res, '缺少标签id')
        try {
            const resu = await tagService.editTag(req.params.id)
            return this.querySuccess(res, resu)
        } catch (err) {
            if (err.message === 'BadTagId') {
                return this.reqFail(res, '无效的标签id')
            }
            next(err)
        }
    }

    /**
     * @api {post} /tag/<id> 新增标签
     * @apiVersion 1.0.0
     * @apiName addTag
     * @apiGroup tag_new
     * @apiPermission admin
     *
     * @apiSuccessExample {json} 新增成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 缺少标签内容
     *   {
     *     "code": 500,
     *     "msg": "缺少标签内容"
     *   }
     *
     * @apiErrorExample {json} 无效的父标签id
     *   {
     *     "code": 500,
     *     "msg": "无效的父标签id"
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
        const { content, parentId } = req.body
        if (!content) return this.reqFail(res, '缺少标签内容')
        if (!parentId) return this.reqFail(res, '无效的父标签id')
        try {
            const resu = await tagService.addTag({
                content, parentId,
            })
            return this.success(res)
        } catch (err) {
            if (err.code === "23505") {
                return this.reqFail(res, '标签名重复了')
            }
            next(err)
        }
    }
}

module.exports = new TagController()

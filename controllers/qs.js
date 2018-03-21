const Controller = require('../base/Controller')
const qsService = require('../business/qs')

class StockController extends Controller {
    /**
     * @api {get} /stock/quantifications 查询量化选股
     * @apiVersion 1.0.0
     * @apiName getQuantifications
     * @apiGroup qs
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "stockCode": "002916",
     *         "name": "勘设股份",
     *         "price": "72.86",
     *         "upDown": "9.994%",
     *         "upDownPrice": "6.62",
     *         "plusMinus": "+",
     *         "qsId": "1",
     *         "targetPrice": "100.00",
     *         "stopPrice": "60.00"
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
    async getQuantifications(req, res, next) {
        try {
            const resu = await qsService
                .getQuantifications({
                    keyword: req.query.keyword,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /stock/focuses 根据今日关注类型查询股票
     * @apiVersion 1.0.0
     * @apiName getFocuses
     * @apiGroup qs
     * @apiPermission anyone
     *
     * @apiParam {String} focusType 类别
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "cmsContentId": "1",
     *         "contentType": "text",
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
    async getFocuses(req, res, next) {
        if (!req.query.focusType) return this.reqFail(res, '缺少类型')
        try {
            const resu = await qsService
                .getFocuses({
                    focusType: req.query.focusType,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /stock/categorys 查询今日关注分类
     * @apiVersion 1.0.0
     * @apiName getCategorys
     * @apiGroup qs
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "thumbnailUrl": "http://",
     *         "focusType": "new_stock",
     *         "focusName": "新股申购"
     *       }
     *     ]
     *   }
     *
     * @apiErrorExample {json} 缺少类型
     *   {
     *     "code": 500,
     *     "msg": "缺少类型"
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
        try {
            const resu = await qsService
                .getCategorys()
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new StockController()

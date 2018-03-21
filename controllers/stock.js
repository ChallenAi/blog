const Controller = require('../base/Controller')
const stockService = require('../business/stock')

class StockController extends Controller {
    /**
     * @api {get} /stocks 根据条件查询股票
     * @apiVersion 1.0.0
     * @apiName getStocks
     * @apiGroup stock
     * @apiPermission anyone
     *
     * @apiParam {String} keyword 关键词
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "stockCode": "002916",
     *         "name": "N深南",
     *         "price": "27.79",
     *         "upDown": "43.990%",
     *         "upDownPrice": "8.49",
     *         "plusMinus": "+"
     *       }
     *     ]
     *   }
     *
     * @apiErrorExample {json} 关键词格式错误
     *   {
     *     "code": 400,
     *     "msg": "关键词格式错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getStocks(req, res, next) {
        if (!req.query.keyword && req.query.keyword !== '0') return this.reqFail(res, '缺少关键词')
        try {
            const resu = await stockService
                .getStocks({
                    keyword: req.query.keyword,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /myStocks 查询我的自选股
     * @apiVersion 1.0.0
     * @apiName getMyStocks
     * @apiGroup stock
     * @apiPermission logginedIn
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {
     *         "stockCode": "002916",
     *         "name": "N深南",
     *         "price": "27.79",
     *         "upDown": "43.990%",
     *         "upDownPrice": "8.49",
     *         "plusMinus": "+"
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
    async getMyStocks(req, res, next) {
        if (!this.loggedIn(res)) return
        try {
            const resu = await stockService
                .getMyStocks({
                    userId: res.locals.user.userId,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {post} /stock/follow 关注股票
     * @apiVersion 1.0.0
     * @apiName followStock
     * @apiGroup stock
     * @apiPermission logginedIn
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "stockCode": "SHLY"
     *   }
     *
     * @apiSuccessExample {json} 关注成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 股票代码格式错误
     *   {
     *     "code": 400,
     *     "msg": "股票代码格式错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async followStock(req, res, next) {
        if (!this.loggedIn(res)) return
        if (!req.body.stockCode) return this.reqFail(res, '缺少股票代码')
        try {
            await stockService.followStock({
                userId: res.locals.user.userId,
                stockCode: req.body.stockCode,
            })
            return this.success(res)
        } catch (err) {
            if (err.code && err.code === '23505') {
                return this.reqFail(res, '已关注该股票')
            }
            next(err)
        }
    }

    /**
     * @api {post} /stock/unfollow 取消关注股票
     * @apiVersion 1.0.0
     * @apiName unfollowStock
     * @apiGroup stock
     * @apiPermission logginedIn
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "stockCode": "SHLY"
     *   }
     *
     * @apiSuccessExample {json} 取消成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 股票代码格式错误
     *   {
     *     "code": 400,
     *     "msg": "股票代码格式错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async unfollowStock(req, res, next) {
        if (!this.loggedIn(res)) return
        if (!req.body.stockCode) return this.reqFail(res, '缺少股票代码')
        try {
            await stockService.unfollowStock({
                userId: res.locals.user.userId,
                stockCode: req.body.stockCode,
            })
            return this.success(res)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new StockController()

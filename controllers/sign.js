const Controller = require('../base/Controller')
const signService = require('../business/sign')

class SignController extends Controller {
    /**
     * @api {post} /sign 用户签到
     * @apiVersion 1.0.0
     * @apiName 用户签到
     * @apiGroup sign
     * @apiPermission logginedIn
     *
     * @apiSuccessExample {json} 签到成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 日期格式错误
     *   {
     *     "code": 400,
     *     "msg": "日期格式错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async sign(req, res, next) {
        if (!this.loggedIn(res)) return
        try {
            await signService.sign({
                userId: res.locals.user.userId,
            })
            return this.success(res)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /signs 查询签到日期
     * @apiVersion 1.0.0
     * @apiName 查询签到日期
     * @apiGroup sign
     * @apiPermission logginedIn
     *
     * @apiParam {String} dateYM 日期中的年月(格式:2017-09)
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": ["01", "11"]
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "日期dateYM的格式:2017-09"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async getSigns(req, res, next) {
        if (!this.loggedIn(res)) return
        if (!req.query.dateYM) return this.reqFail(res, '日期dateYM的格式:2017-09')
        try {
            const resu = await signService
                .getSigns({
                    userId: res.locals.user.userId,
                    dateYM: req.query.dateYM,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new SignController()

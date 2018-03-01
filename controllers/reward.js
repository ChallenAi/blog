const Controller = require('../base/Controller')
const rewardService = require('../business/reward')

class RewardController extends Controller {
    /**
     * @api {post} /reward 加减积分
     * @apiVersion 1.0.0
     * @apiName 加减积分
     * @apiGroup reward
     * @apiPermission logginedIn
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "operation": "积分类型，如：签到"
     *   }
     *
     * @apiSuccessExample {json} 成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 积分id错误
     *   {
     *     "code": 400,
     *     "msg": "缺少操作类型"
     *   }
     *
     * @apiErrorExample {json} 积分类型错误
     *   {
     *     "code": 400,
     *     "msg": "没有该种类型的积分"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async addReward(req, res, next) {
        if (!this.loggedIn(res)) return
        const d = req.body
        try {
            if (!d.operation) return this.reqFail(res, '缺少操作类型')
            const resu = await rewardService.addReward({
                operation: d.operation,
                userId: res.locals.user.userId,
            })
            return this.success(res)
        } catch (err) {
            if (err.code === '23502') {
                return this.reqFail(res, '没有该种类型的积分')
            }
            next(err)
        }
    }

    /**
     * @api {get} /rewards 查询积分详情
     * @apiVersion 1.0.0
     * @apiName 查询积分详情
     * @apiGroup reward
     * @apiPermission logginedIn
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {operation: "签到", rewardNum: 35, date: "2017-10-12"},
     *       {operation: "签到", rewardNum: 35, date: "2017-10-11"}
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
    async getMyRewards(req, res, next) {
        if (!this.loggedIn(res)) return
        const d = req.body
        try {
            const resu = await rewardService
                .getMyRewards({
                    userId: res.locals.user.userId,
                })
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }

    /**
     * @api {get} /rewardRules 查询积分规则
     * @apiVersion 1.0.0
     * @apiName 查询积分规则
     * @apiGroup reward
     * @apiPermission anyone
     *
     * @apiSuccessExample {json} 查询成功
     *   {
     *     "code": 0,
     *     "data": [
     *       {rewardId: "e246bc58-d6a6-4c44-930b-82a0a781e8d7", operation: "签到", reward_num: 35},
     *       {rewardId: "e246bc58-d6a6-4c44-930b-82a0a781e8d7", operation: "看视频", reward_num: -25}
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
    async getRewardRules(req, res, next) {
        const d = req.body
        try {
            const resu = await rewardService.getRewardRules()
            return this.querySuccess(res, resu)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new RewardController()

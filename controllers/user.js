const Controller = require('../base/Controller')
const userService = require('../business/user')
const request = require('request')
const config = require('../config/basic')

class UserController extends Controller {
    /**
     * @api {post} /login 用户登录
     * @apiVersion 1.0.0
     * @apiName 用户登录
     * @apiGroup user
     * @apiPermission anyone
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "phoneNum": "12345678901",
     *     "password": "******"
     *   }
     *
     * @apiSuccessExample {json} 登录成功
     *   {
     *     "code": 0,
     *     "token": "vio2vevnwovn233ie0dcm",
     *     "signStat": {
     *       "signed": false,
     *       "signDate": "2017-07-01"
     *     },
     *     "userInfo": {
     *     "name": "test",
     *     "phone": "13595315594",
     *     "headImg": "test.png",
     *     "nickName": "test_nick",
     *     "describe": "",
     *     "sex": "F",
     *     "profession": "",
     *     "identity": "",
     *     "stockYear": 0,
     *     "points": 20,
     *     "signCount": 13
     *     }
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "手机号必须为数字"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async login(req, res, next) {
        const d = req.body
        if (!d.username) return this.reqFail(res, '用户名不能为空')
        if (!d.password) return this.reqFail(res, '密码不能为空')
        if (d.username === 'Challen') {
            if (d.password === 'fenxiangkuaile') return this.querySuccess(res, {id: 1, username: 'Challen'})
            return this.reqFail(res, '用户名或密码错误')
        }
        return this.reqFail(res, '该用户名未被注册')
        /*
        try {
            if (!d.phoneNum || !this.isPhone(d.phoneNum)) return this.reqFail(res, '手机号错误')
            if (!d.password) return this.reqFail(res, '密码不能为空')
            const resu = await userService.login({
                phoneNum: d.phoneNum,
                password: d.password,
            })
            return this.loginSuccess(res, resu)
        } catch (err) {
            if (err.message === 'NoPhoneNum') {
                return this.reqFail(res, '该手机号未被注册')
            } else if (err.message === 'FalsePassword') {
                return this.reqFail(res, '密码错误')
            }
            next(err)
        }
        */
    }

    /**
     * @api {post} /register 注册
     * @apiVersion 1.0.0
     * @apiName 注册
     * @apiGroup user
     * @apiPermission anyone
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "phoneNum": "12345678901",
     *     "validCode": "121314",
     *     "password": "******"
     *   }
     *
     * @apiSuccessExample {json} 注册成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 手机号已被占用
     *   {
     *     "code": 400,
     *     "msg": "手机号已被占用"
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "手机号必须为数字/手机号位数过短/..."
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async register(req, res, next) {
        return this.reqFail(res, '注册功能已被管理员禁用')
        /*
        const d = req.body
        try {
            if (!d.phoneNum || !this.isPhone(d.phoneNum)) return this.reqFail(res, '手机号错误')
            if (!d.validCode) return this.reqFail(res, '验证码错误')
            if (d.password.length < 6 || d.password.length > 15) return this.reqFail(res, '密码必须为6-15位')
            await userService
                .verifySmsCode(d.phoneNum, d.validCode)
            await userService
                .register({
                    phoneNum: d.phoneNum,
                    password: d.password,
                })
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadValidCode') {
                return this.reqFail(res, '验证码错误')
            } else if (err.message === 'ValidCodeTimeOut') {
                return this.reqFail(res, '验证码超时')
            } else if (err.constraint) {
                return this.reqFail(res, '手机号重复')
            }
            console.log(err)
            next(err)
        }
        */
    }

    /**
     * @api {put} /user 修改个人资料
     * @apiVersion 1.0.0
     * @apiName 修改个人资料
     * @apiGroup user
     * @apiPermission loggedIn
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "name": "赵日天",
     *     "describe": "啊哈哈哈",
     *     "headImg": "default.png",
     *     "sex": "F/M",
     *     "nickName": "咖啡猫",
     *     "profession": "军人",
     *     "identity": "420321199001013214",
     *     "stockYear": "2"
     *   }
     *
     * @apiSuccessExample {json} 修改成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 无效的userId
     *   {
     *     "code": 400,
     *     "msg": "无效的userId"
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "性别只能是F或M/stockYear为0-99的数字/身份证号错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async updateUserInfo(req, res, next) {
        if (!this.loggedIn(res)) return
        const d = req.body
        try {
            if (d.identity && !this.isIdentity(d.identity)) return this.reqFail(res, '身份证号错误')
            if (d.stockYear || d.stockYear === '0') {
                try {
                    d.stockYear = parseInt(d.stockYear, 10)
                } catch (err) {
                    return this.reqFail(res, '股票年限错误')
                }
            }
            if (d.sex && !this.isSex(d.sex)) return this.reqFail(res, '性别错误，只能是F/M')
            await userService
                .updateUserInfo(res.locals.user.userId, d)
            return this.success(res)
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    /**
     * @api {post} /getValidCode 获取验证码
     * @apiVersion 1.0.0
     * @apiName 获取验证码
     * @apiGroup user
     * @apiPermission anyone
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     "phoneNum": "12345678901"
     *   }
     *
     * @apiSuccessExample {json} 获取成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "手机号必须为数字/手机号位数过短/..."
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误/验证码服务器没有响应"
     *   }
     *
     */
    getValidCode(req, res, next) {
        const d = req.body
        if (!d.phoneNum) return this.reqFail(res, '缺少手机号')
        const code = this.getSmsCode()
        request({
            method: 'POST',
            uri: `http://${config.smsUrl}/message`,
            json: {
                phoneNumber: d.phoneNum,
                code,
            },
        }, (err, resp, body) => {
            let resu
            if (err) {
                if (err.code === 'ECONNREFUSED') {
                    return res.json({
                        code: 500,
                        msg: '验证码服务器没有响应',
                    })
                }
                console.log(err)
                return res.json({
                    code: 500,
                    msg: '服务器错误',
                })
            }
            if (resp.statusCode === 200 && body.code === 0) {
                userService
                    .saveSmsCode(d.phoneNum, code)
                    .then((data) => {
                        return res.json({ code: 0 })
                    })
                    .catch((err) => {
                        next(err)
                    })
            } else {
                return res.json(body)
            }
        })
    }

    /**
     * @api {put} /password 修改密码
     * @apiVersion 1.0.0
     * @apiName 修改密码
     * @apiGroup user
     * @apiPermission anyone
     *
     * @apiParamExample {json} 上传的参数
     *   {
     *     “phoneNum”: "12345678901",
     *     "validCode": "121314",
     *     "password": "12345678901"
     *   }
     *
     * @apiSuccessExample {json} 修改成功
     *   {
     *     "code": 0
     *   }
     *
     * @apiErrorExample {json} 请求格式错误
     *   {
     *     "code": 400,
     *     "msg": "密码错误"
     *   }
     *
     * @apiErrorExample {json} 服务器错误
     *   {
     *     "code": 500,
     *     "msg": "服务器错误"
     *   }
     *
     */
    async changePassword(req, res, next) {
        const d = req.body
        try {
            if (!d.phoneNum || !this.isPhone(d.phoneNum)) return this.reqFail(res, '手机号错误')
            if (!d.validCode) return this.reqFail(res, '验证码错误')
            if (d.password.length < 6 || d.password.length > 15) return this.reqFail(res, '密码必须为6-15位')
            await userService
                .verifySmsCode(d.phoneNum, d.validCode)
            await userService
                .changePassword({
                    phoneNum: d.phoneNum,
                    password: d.password,
                })
            return this.success(res)
        } catch (err) {
            if (err.message === 'BadValidCode') {
                return this.reqFail(res, '验证码错误')
            } else if (err.message === 'ValidCodeTimeOut') {
                return this.reqFail(res, '验证码超时')
            }
            console.log(err)
            next(err)
        }
    }
}

module.exports = new UserController()

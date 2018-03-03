const validator = require('validator')
const NUMBER = '1234567890'

class HttpError extends Error {
    constructor(code, message) {
        super()
        this.code = code
        this.message = message
    }
}

class Controller {
    constructor() {
        this.HttpError = HttpError
    }

    success(res) {
        res.json({ code: 0 })
    }

    serverFail(res, msg) {
        res.json({ code: 500, msg })
    }

    reqFail(res, msg) {
        res.json({ code: 400, msg })
    }

    querySuccess(res, data) {
        res.json({ code: 0, data })
    }

    querySuccessCount(res, data, count) {
        res.json({ code: 0, data, count })
    }

    queryFail(res, err) {
        res.json({ code: 500, err })
    }

    loginSuccess(res, d) {
        res.json({
            code: 0,
            token: d.token,
            signStat: d.signStat,
            userInfo: d.userInfo,
        })
    }

    loggedIn(res) {
        if (res.locals.user.userId) {
            return true
        } else if (res.locals.user.tokenErrorMsg) {
            res.json({ code: 401, msg: res.locals.user.tokenErrorMsg })
        } else {
            res.json({ code: 401, msg: '需要登录' })
        }
        return false
    }

    isPhone(str) {
        return validator.isMobilePhone(str, 'zh-CN')
    }

    isIdentity(str) {
        return true
    }

    getSmsCode() {
        let result = ''
        for (let i = 0; i < 6; i++) {
            result += NUMBER.charAt(Math.floor(Math.random() * NUMBER.length))
        }
        return result
    }

    isSex(str) {
        let resu = false
        const sex = ['F', 'M']
        sex.map(i => {
            if (i === str) resu = true
        })
        return resu
    }

    isId(str) {
        return validator.isUUID(str)
    }

    isIncreamentId(number) {
        return validator.isInt(number)
    }

    isAdmin() {}
}

module.exports = Controller

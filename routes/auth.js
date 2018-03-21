const jwt = require('jsonwebtoken')
const fs = require('fs')

const cert = fs.readFileSync('./config/publicKey.pem')

module.exports = (req, res, next) => {
    res.locals.user = {}
    if (req.headers.authorization) {
        let decoded = {}
        try {
            decoded = jwt.verify(req.headers.authorization, cert)
            res.locals.user = {
                userId: decoded.userId,
                phoneNum: decoded.phoneNum,
                nickName: decoded.nickName,
            }
        } catch (err) {
            res.locals.user.tokenErrorMsg = 'token过期或无效'
        }
    }
    next()
}

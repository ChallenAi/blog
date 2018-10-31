const Business = require('../base/Business')

class UserService extends Business {
    async login({ phoneNum, password }) {
        const resu = await this.db('user').where({
            phone: phoneNum,
        }).select(
            'user_id',
            'name',
            'phone',
            { headImg: 'head_img' },
            { nickName: 'nick_name' },
            'password', 'valid_code',
            'describe',
            'sex',
            'profession',
            'identity',
            { stockYear: 'stock_year' },
            'points'
        ).limit(1)
        if (resu.length) {
            if (this.verifyPassword(password, resu[0].valid_code, resu[0].password)) {
                const token = this.generateToken(resu[0].user_id, resu[0].phone, resu[0].nickName)
                const signStat = {}
                const matchedSign = await this.db('sign').where({
                    user_id: resu[0].user_id,
                    sign_date: this.getDateString(),
                }).select('sign_date').limit(1)
                const signs = await this.db.raw('select count(*) as sign_count from sign where user_id = ?', [resu[0].user_id])
                if (matchedSign.length) {
                    signStat.signed = true
                    signStat.signDate = matchedSign[0].sign_date
                }
                delete resu[0].user_id
                delete resu[0].valid_code
                delete resu[0].password
                return {
                    token,
                    signStat: Object.assign({}, signStat, { signCount: parseInt(signs.rows[0].sign_count || 0) }),
                    userInfo: resu[0],
                }
            }
            throw new Error('FalsePassword')
        } else {
            throw new Error('NoPhoneNum')
        }
    }

    async verifySmsCode(mobile, validCode) {
        const existedCode = await this.db('sms_valid_code')
            .where({
                mobile,
                valid_code: validCode,
            })
            .select({ addTime: 'add_time' })
            .orderBy('add_time', 'desc')
            .limit(1)
        if (existedCode.length === 0) {
            throw new Error('BadValidCode')
        } else {
            const before = new Date(existedCode[0].addTime)
            const distance = new Date() - before
            if (distance > 1000 * 60 * 5) throw new Error("ValidCodeTimeOut")
        }
    }

    async register({ phoneNum, password }) {
        const validCode = this.getValidCode()
        const data = {
            user_id: this.getGuid(),
            phone: phoneNum,
            name: `${phoneNum}`,
            nick_name: `${phoneNum}`,
            head_img: 'default.png',
            valid_code: validCode,
            password: this.generatePassword(password, validCode),
            is_deleted: 0,
            created_at: this.getTimeString(),
            update_at: this.getTimeString(),
        }
        await this.db('user').insert(data)
    }

    async updateUserInfo(userId, d) {
        const user = {}
        if (d.name) user.name = d.name
        if (d.describe) user.describe = d.describe
        if (d.sex) user.sex = d.sex
        if (d.headImg) user.head_img = d.headImg
        if (d.nickName) user.nick_name = d.nickName
        if (d.profession) user.profession = d.profession
        if (d.identity) user.identity = d.identity
        if (d.stockYear) user.stock_year = d.stockYear
        user.update_at = this.getTimeString()
        await this.db('user').where({
            user_id: userId,
        }).update(user)
    }

    saveSmsCode(mobile, validCode) {
        const data = {}
        data.mobile = mobile
        data.valid_code = validCode
        data.add_time = this.getTimeString()
        return this.db('sms_valid_code').insert(data)
    }

    async changePassword({ phoneNum, password }) {
        const data = {}
        data.valid_code = this.getValidCode()
        data.update_at = this.getTimeString()
        data.password = this.generatePassword(password, data.valid_code)
        await this.db('user').where({
            phone: phoneNum,
        }).update(data)
    }
}

module.exports = new UserService()

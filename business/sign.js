const Business = require('../base/Business')
const rewardService = require('./reward')

class SignService extends Business {
    async sign({ userId }) {
        const existedSign = await this.db('sign')
            .where({
                user_id: userId,
                sign_date: this.getDateString(),
            })
            .select('sign_date')
            .limit(1)
        if (existedSign.length === 0) {
            await this.db('sign').insert({
                sign_id: this.getGuid(),
                user_id: userId,
                sign_date: this.getDateString(),
            })
            await rewardService.addReward({
                operation: '签到',
                userId,
            })
        }
    }

    async getSigns({ userId, dateYM }) {
        const resu = await this.db('sign')
            .where({
                user_id: userId,
            })
            .andWhere('sign_date', 'like', `${dateYM}%`)
            .orderBy('sign_date', 'desc')
            .select('sign_date')
            .limit(50)
        const signDates = []
        resu.map(i => {
            const date = i.sign_date.split('-')
            signDates.push(date[date.length - 1])
        })
        return signDates
    }
}

module.exports = new SignService()

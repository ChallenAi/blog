const Business = require('../base/Business')

class RewardService extends Business {
    async addReward({ operation, userId }) {
        const prId = this.getGuid()
        const dateNow = this.getDateString()
        await this.db.raw('select fn_change_reward(?, ?, ?, ?)', [operation, userId, prId, dateNow])
    }

    async getMyRewards({ userId }) {

        const resu = await this.db.raw('select reward.operation, reward.reward_num, reward_record.created_at from reward, reward_record where reward_record.user_id = ? and reward_record.reward_id = reward.reward_id limit 50', [userId])

        return resu.rows
    }

    async getRewardRules() {
        const resu = await this.db('reward').select(
            { rewardId: 'reward_id' },
            'operation',
            { rewardNum: 'reward_num' }
        ).limit(100)
        return resu
    }
}

module.exports = new RewardService()

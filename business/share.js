const Business = require('../base/Business')

class ShareService extends Business {
    async addShare({ title }) {
        const prId = this.getGuid()
        const dateNow = this.getDateString()
        await this.db('xxx')
    }

    async getShares({ condition, limit, offset }) {
        const where = { is_deleted: condition.deleted }
        if (condition.typeId) where.type_id = condition.typeId
        const resu = await this.db({ s: 'share', t: 'tag' })
            .whereRaw('s.type_id = t.tag_id')
            .andWhere(where)
            .limit(limit)
            .offset(offset)
            .select({
                id: 's.share_id',
                title: 's.title',
                content: 's.content',
                type: 't.content',
                createdAt: 's.created_at',
                bgImg: 's.background_img',
            })
        return resu
    }

    async editShare({ articleId }) {}

    async deleteShare({ articleId }) {}
}

module.exports = new ShareService()

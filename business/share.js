const Business = require('../base/Business')

class ShareService extends Business {
    async addShare({ title, content, authorId, typeId }) {
        const data = {
            user_id: authorId,
            title,
            content,
            type_id: typeId,
            is_deleted: false,
            background_img: '',
            created_at: new Date(),
            updated_at: new Date(),
        }
        await this.db('share').insert(data)
    }

    async getShares({ condition, limit, offset }) {
        const where = { is_deleted: condition.deleted }
        if (condition.typeId) where.type_id = condition.typeId
        const resu = await this.db({ s: 'share', t: 'tag' })
            .orderBy('s.share_id')
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

    async editShare({ shareId }) {}

    async deleteShare({ shareId }) {
        const resu = await this.db('share')
            .where({ share_id: shareId })
            .update({ is_deleted: true })
        if (resu === 0) throw new Error('BadShareId')
    }
}

module.exports = new ShareService()

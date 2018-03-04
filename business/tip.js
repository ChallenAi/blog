const Business = require('../base/Business')

class TipService extends Business {
    async addTip({ title, content, authorId, typeId }) {
        const data = {
            user_id: authorId,
            title,
            content,
            tag_id: typeId,
            is_deleted: false,
            gmt_create: new Date(),
            gmt_modified: new Date(),
        }
        await this.db('tip').insert(data)
    }

    async getTips({ condition, limit, offset }) {
        const where = { is_deleted: condition.deleted }
        if (condition.typeId) where.tag_id = condition.typeId
        if (condition.keyword) {
            const resu = await this.db('tip')
                .orderBy('gmt_modified', 'desc')
                .where(where)
                .andWhere('title', 'like', `%${condition.keyword}%`)
                .limit(limit)
                .offset(offset)
                .select({
                    id: 'tip_id',
                    title: 'title',
                    content: 'content',
                    createdAt: 'gmt_create',
                    updatedAt: 'gmt_modified',
                    authorId: 'user_id',
                    typeId: 'tag_id',
                })
            return resu
        }
        const resu = await this.db('tip')
            .orderBy('gmt_modified', 'desc')
            .where(where)
            .limit(limit)
            .offset(offset)
            .select({
                id: 'tip_id',
                title: 'title',
                content: 'content',
                createdAt: 'gmt_create',
                updatedAt: 'gmt_modified',
                authorId: 'user_id',
                typeId: 'tag_id',
            })
        return resu
    }

    async editTip(tipId, updation) {
        updation.gmt_modified = new Date()
        const resu = await this.db('tip')
            .where({ tip_id: tipId })
            .update(updation)
        if (resu === 0) throw new Error('BadTipId')
    }

    async deleteTip({ tipId }) {
        const resu = await this.db('tip')
            .where({ tip_id: tipId })
            .update({ is_deleted: true })
        if (resu === 0) throw new Error('BadTipId')
    }
}

module.exports = new TipService()

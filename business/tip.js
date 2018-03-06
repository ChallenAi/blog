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
        const where = { 't.is_deleted': condition.deleted }
        if (condition.typeId) where['t.tag_id'] = condition.typeId
        if (condition.keyword) {
            const resu = await this.db({ t: 'tip', tg: 'tag' })
                .orderBy('t.gmt_modified', 'desc')
                .whereRaw('t.tag_id = tg.tag_id')
                .andWhere(where)
                .andWhere('t.title', 'like', `%${condition.keyword}%`)
                .limit(limit)
                .offset(offset)
                .select({
                    id: 't.tip_id',
                    title: 't.title',
                    content: 't.content',
                    createdAt: 't.gmt_create',
                    updatedAt: 't.gmt_modified',
                    authorId: 't.user_id',
                    typeId: 't.tag_id',
                    typeName: 'tg.content',
                })
            return resu
        }
        const resu = await this.db({ t: 'tip', tg: 'tag' })
            .orderBy('t.gmt_modified', 'desc')
            .whereRaw('t.tag_id = tg.tag_id')
            .andWhere(where)
            .limit(limit)
            .offset(offset)
            .select({
                id: 't.tip_id',
                title: 't.title',
                content: 't.content',
                createdAt: 't.gmt_create',
                updatedAt: 't.gmt_modified',
                authorId: 't.user_id',
                typeId: 't.tag_id',
                typeName: 'tg.content',
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

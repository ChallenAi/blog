const Business = require('../base/Business')

class ArticleService extends Business {
    async addArticle({ title }) {
        const prId = this.getGuid()
        const dateNow = this.getDateString()
        await this.db('xxx')
    }

    async getArticles({ condition, limit, offset }) {
        const where = {}
        if (condition.userId) where['a.user_id'] = condition.userId
        if (condition.typeId) where['a.type_id'] = condition.typeId
        const resu = await this.db({ a: 'article', u: 'user', t: 'tag' })
            .whereRaw('a.type_id = t.tag_id and u.user_id = a.user_id')
            .andWhere(where)
            .limit(limit)
            .offset(offset)
            .select({
                id: 'a.article_id',
                userId: 'a.user_id',
                typeId: 'a.type_id',
                title: 'a.title',
                content: 'a.content',
                view: 'a.view',
                like: 'a.like',
                collect: 'a.collect',
                rank: 'a.rank',
                createdAt: 'a.created_at',
                updatedAt: 'a.updated_at',
                type: 't.content',
                username: 'u.user_name',
            })
        return resu
    }

    async getTitles({ deleted, typeId }) {
        const resu = await this.db('article')
            .where({ deleted, type_id: typeId })
            .select({
                articleId: 'article_id',
                title: 'title',
            })
        return resu
    }

    async getArticle(articleId) {
        const resu = await this.db({ a: 'article', u: 'user', t: 'tag' })
            .whereRaw('a.type_id = t.tag_id and u.user_id = a.user_id')
            .andWhere({ 'a.article_id': articleId })
            .limit(1)
            .select({
                id: 'a.article_id',
                userId: 'a.user_id',
                typeId: 'a.type_id',
                title: 'a.title',
                content: 'a.content',
                view: 'a.view',
                like: 'a.like',
                collect: 'a.collect',
                rank: 'a.rank',
                createdAt: 'a.created_at',
                updatedAt: 'a.updated_at',
                type: 't.content',
                username: 'u.user_name',
            })

        if (resu.length === 0) {
            throw new Error('BadArticleId')
        }
        return resu[0]
    }
}

module.exports = new ArticleService()

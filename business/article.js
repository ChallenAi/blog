const Business = require('../base/Business')

class ArticleService extends Business {
    async addArticle({ title, content, authorId, typeId }) {
        const data = {
            user_id: authorId,
            title,
            content,
            type_id: typeId,
            view: 0,
            like: 0,
            collect: 0,
            rank: 0,
            deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
        }
        const resu = await this.db('article').insert(data, 'article_id')
        return resu
    }

    async getArticles({ condition, limit, offset }) {
        const where = {}
        if (condition.userId) where['a.user_id'] = condition.userId
        if (condition.typeId) where['a.type_id'] = condition.typeId
        if (condition.keyword) {
            const resu = await this.db({ a: 'article', u: 'user', t: 'tag' })
                .whereRaw('a.type_id = t.tag_id and u.user_id = a.user_id')
                .andWhere('a.title', 'like', `%${condition.keyword}%`)
                .andWhere(where)
                .orderBy('a.updated_at', 'desc')
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
            resu.map(i => i.content = i.content.substring(0, 90))
            return resu
        }
        const resu = await this.db({ a: 'article', u: 'user', t: 'tag' })
            .whereRaw('a.type_id = t.tag_id and u.user_id = a.user_id')
            .andWhere(where)
            .orderBy('a.updated_at', 'desc')
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
        resu.map(i => i.content = i.content.substring(0, 90))
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

    async getAllTags() {
        const resu = await this.db({ a: 'article', t: 'tag' })
            .groupByRaw('a.type_id, t.content')
            .whereRaw('a.type_id = t.tag_id')
            .select(
                { typeId: 'a.type_id' },
                { typeName: 't.content' },
                { articleCount: this.db.raw('COUNT(a.type_id)') })

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

    async articleViewPlusOne(articleId) {
        await this.db('article')
            .where({ article_id: articleId })
            .update({
                view: this.db.raw('?? + 1', ['view'])
            })
        return
    }
}

module.exports = new ArticleService()

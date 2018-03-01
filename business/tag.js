const Business = require('../base/Business')

class TagService extends Business {
    async addTag({ title }) {
        const prId = this.getGuid()
        const dateNow = this.getDateString()
        await this.db('xxx')
    }

    async getTags() {
        const resu = await this.db('tag')
            .select({
                id: 'tag_id',
                parentId: 'parent_id',
                content: 'content',
            })
        return resu
    }

    async getTag({ articleId }) {
        const resu = await this.db('article')
            .where({ article_id: articleId })
            .select(
                { TagContentId: 'article_id' },
                { contentType: 'content_type' },
                'title',
                'author',
                'addTime',
                'published',
                'description',
                'content',
                { thumbnailUrl: 'thumbnail_url' },
                { collectQty: 'collect_qty' },
                { goodQty: 'good_qty' }
            )
            .limit(1)

        if (resu.length === 0) {
            throw new Error('BadArticleId')
        }
        return resu[0]
    }
}

module.exports = new TagService()

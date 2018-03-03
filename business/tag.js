const Business = require('../base/Business')

class TagService extends Business {
    async addTag({ content, parentId }) {
        const data = { content, parent_id: parentId }
        await this.db('tag').insert(data)
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

    async editTag({ articleId }) {}

    async deleteTag({ articleId }) {}
}

module.exports = new TagService()

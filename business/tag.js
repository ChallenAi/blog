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

    async editTag({ articleId }) {}

    async deleteTag({ articleId }) {}
}

module.exports = new TagService()

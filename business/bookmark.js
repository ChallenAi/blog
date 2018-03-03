const Business = require('../base/Business')

class BookmarkService extends Business {
    async deleteBookmark({ title, content, authorId, typeId }) {
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
        const resu = await this.db('Bookmark').insert(data, 'Bookmark_id')
        return resu
    }

    async getBookmarks({ keyword, limit, offset }) {
        const where = { is_deleted: false }
        if (keyword) {
            const resu = await this.db('bookmark')
                .where(where)
                .andWhere('desc', 'like', `%${keyword}%`)
                // .orderBy('updated_at', 'desc')
                .limit(limit)
                .offset(offset)
                .select({
                    id: 'bookmark_id',
                    desc: 'desc',
                    url: 'url',
                    addTime: 'add_time',
                    icon: 'icon',
                })
            return resu
        }

        const resu = await this.db('bookmark')
            .where(where)
            .limit(limit)
            .offset(offset)
            .select({
                id: 'bookmark_id',
                desc: 'desc',
                url: 'url',
                addTime: 'add_time',
                icon: 'icon',
            })
        return resu
    }
}

module.exports = new BookmarkService()

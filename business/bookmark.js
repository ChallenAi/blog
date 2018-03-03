const Business = require('../base/Business')

class BookmarkService extends Business {
    async deleteBookmark({ bookmarkId }) {
        const resu = await this.db('bookmark')
            .where({ bookmark_id: bookmarkId })
            .del()
        if (resu === 0) throw new Error('BadBookmarkId')
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

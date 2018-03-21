const Business = require('../base/Business')

class CmsService extends Business {
    async addArticle({ title }) {
        const prId = this.getGuid()
        const dateNow = this.getDateString()
        await this.db('')
    }

    async getArticles({ categoryId, limit, offset }) {
        const condition = { published: 1 }
        if (categoryId || categoryId === '0') condition.cms_category_id = categoryId
        const resu = await this.db('cms_content')
            .where(condition)
            .limit(limit)
            .offset(offset)
            .select(
                { cmsContentId: 'cms_content_id' },
                { cmsCategoryId: 'cms_category_id' },
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

        return resu
    }

    async getArticle({ articleId }) {
        const resu = await this.db('cms_content')
            .where({ cms_content_id: articleId })
            .select(
                { cmsContentId: 'cms_content_id' },
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

    async getCategorys({ parentId }) {
        const resu = await this.db('cms_category')
            .where({ parent_id: parentId })
            .orderBy('seq', 'asc')
            .select(
                { categoryId: 'cms_category_id' },
                { categoryCode: 'category_code' },
                { categoryName: 'category_name' }
            )
            .limit(30)
        return resu
    }

    async getAdCotegorys({ parentId }) {
        const resu = await this.db('cms_ad_category')
            .where({ parent_id: parentId })
            .orderBy('seq', 'asc')
            .select(
                { categoryId: 'cms_ad_category_id' },
                { categoryCode: 'category_code' },
                { categoryName: 'category_name' }
            )
            .limit(30)
        return resu
    }

    async getAds({ adCategoryId }) {
        const condition = {}
        if (adCategoryId || adCategoryId === '0') condition.cms_ad_category_id = adCategoryId
        const resu = await this.db('cms_ad_content')
            .where(condition)
            .orderBy('seq', 'asc')
            .select(
                { cmsAdContentId: 'cms_ad_content_id' },
                { cmsAdCategoryId: 'cms_ad_category_id' },
                { thumbnailUrl: 'thumbnail_url' },
                { linkUrl: 'link_url' }
            )
            .limit(30)

        return resu
    }
}

module.exports = new CmsService()

const Business = require('../base/Business')

class QsService extends Business {
    async getQuantifications() {
        const resu = await this.db({ s: 'stock', qs: 'quantification_stock' })
            .whereRaw('qs.stock_code = s.stock_code')
            .select({
                stockCode: 's.stock_code',
                name: 's.name',
                price: 's.price',
                upDown: 's.up_down',
                upDownPrice: 's.up_down_price',
                plusMinus: 's.plus_minus',
                qsId: 'qs.qs_id',
                targetPrice: 'qs.target_price',
                stopPrice: 'qs.stop_price',
            })
            .limit(100)
        return resu
    }

    async getFocuses({ focusType }) {
        const resu = await this.db({ s: 'stock', tfc: 'today_focus_content' })
            .whereRaw('tfc.stock_code = s.stock_code and tfc.focus_type = ?', [focusType])
            .select({
                stockCode: 's.stock_code',
                name: 's.name',
            })
            .orderBy('tfc.seq', 'asc')
            .limit(100)

        return resu
    }

    async getCategorys() {
        const resu = await this.db('today_focus_category')
            .select({
                thumbnailUrl: 'thumbnail_url',
                focusType: 'focus_type',
                focusName: 'focus_name',
            })
            .limit(30)
        return resu
    }
}

module.exports = new QsService()

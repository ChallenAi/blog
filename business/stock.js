const Business = require('../base/Business')

class StockService extends Business {
    async getStocks({ keyword }) {
        const resu = await this.db('stock')
            .where({
                stock_code: keyword,
            })
            .orWhere('name', 'like', `%${keyword}%`)
            .orWhere('ping_ying', 'like', `%${keyword}%`)
            .select({
                stockCode: 'stock_code',
                name: 'name',
                price: 'price',
                upDown: 'up_down',
                upDownPrice: 'up_down_price',
                plusMinus: 'plus_minus',
                pingYing: 'ping_ying',
            })
            .limit(20)
        return resu
    }

    async getMyStocks({ userId }) {
        const resu = await this.db({ s: 'stock', us: 'user_stock' })
            .select({
                stockCode: 's.stock_code',
                name: 's.name',
                price: 's.price',
                upDown: 's.up_down',
                upDownPrice: 's.up_down_price',
                plusMinus: 's.plus_minus',
                pingYing: 's.ping_ying',
            })
            .whereRaw('us.stock_code = s.stock_code and us.user_id = ?', [userId])
            .limit(100)
        return resu
    }

    async followStock({ userId, stockCode }) {
        await this.db('user_stock')
            .insert({
                user_id: userId,
                stock_code: stockCode,
            })
    }

    async unfollowStock({ userId, stockCode }) {
        await this.db('user_stock')
            .where({
                user_id: userId,
                stock_code: stockCode,
            })
            .del()
    }
}

module.exports = new StockService()

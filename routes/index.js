const auth = require('./auth')
const user = require('./user')
const sign = require('./sign')
const reward = require('./reward')
const cms = require('./cms')
const stock = require('./stock')
const qs = require('./qs')

module.exports = app => app.use(auth, user, sign, reward, cms, stock, qs)

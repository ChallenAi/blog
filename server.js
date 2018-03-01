const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const configFile = require('./config/basic')

const config = process.env.NODE_ENV === 'prod' ? configFile.prod : configFile.dev
// const verifyAccess = require('./middlewares/verifyAccess')
const router = require('./routes')

const app = express()

app.set('port', process.env.PORT || config.port)
app.disable('x-powered-by')

if (process.env.NODE_ENV === 'prod') {
    const log = fs.createWriteStream(path.join(__dirname, 'xgds.log'), { flags: 'a' })
    app.use(logger('combined', { stream: log }))
} else {
    app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(`${__dirname}/public`))

app.disable('etag')

// app.use()
// app.use(verifyAccess)
router(app)

if (app.get('env') === 'prod') {
    app.use((err, req, res, next) => {
        res.status(500)
        res.json({
            code: 500,
            // no message in prod env
            msg: err.message,
        })
        console.log(err)
    })
}

app.use((err, req, res, next) => {
    res.status(500)
    res.json({
        code: 500,
        msg: err.message,
    })
    console.log(err)
})

app.use((req, res) => {
    res.status(404)
    res.json({
        stat: 404,
        msg: '访问的url不存在',
    })
})

module.exports = app

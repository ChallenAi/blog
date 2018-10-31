const express = require('express')
const compression = require('compression');

const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const configFile = require('./config/basic')

const config = process.env.NODE_ENV === 'prod' ? configFile.prod : configFile.dev
const router = require('./routes')

const app = express()

app.use(compression())

app.set('port', process.env.PORT || config.port)
app.disable('x-powered-by')

if (process.env.NODE_ENV === 'prod') {
    const log = fs.createWriteStream(path.join(__dirname, 'iTools.log'), { flags: 'a' })
    app.use(logger('combined', { stream: log }))
} else {
    app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.disable('etag')

router(app)

if (app.get('env') === 'prod') {
    app.use((err, req, res, next) => {
        res.status(500)
        console.log(err)
        return res.json({
            code: 500,
        })
    })
}

app.use((err, req, res, next) => {
    res.status(500)
    console.log(err)
    return res.json({
        code: 500,
        msg: err.message,
    })
})

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, 'public/index.html')));
});


module.exports = app

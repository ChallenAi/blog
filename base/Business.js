const fs = require('fs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const getTimeNow = require('moment')
const getGuid = require('uuid')
const configFile = require('../config/basic')

const pg = process.env.NODE_ENV === 'prod' ? configFile.prod.pgsql : configFile.dev.pgsql
const CHARS = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const cert = fs.readFileSync('./config/publicKey.pem')

const knex = require('knex')({
    client: 'pg',
    version: '10.0',
    connection: {
        host: pg.host,
        user: pg.username,
        password: pg.passwd,
        database: pg.db,
    },
    pool: { min: 0, max: 10 },
})

class Business {
    constructor() {
        this.db = knex
        this.getGuid = getGuid
    }

    getTimeString() {
        return getTimeNow().format('YYYY-MM-DD HH:mm:ss')
    }

    getDateString() {
        return getTimeNow().format('YYYY-MM-DD')
    }

    getValidCode() {
        let result = ''
        for (let i = 0; i < 6; i++) {
            result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
        }
        return result
    }

    generatePassword(password, secretKey) {
        const cobination = `${password}|${secretKey}`
        const result = crypto.createHash('md5').update(cobination).digest('base64')
        return result
    }

    verifyPassword(password, secretKey, secretedpassword) {
        const cobination = `${password}|${secretKey}`
        const result = crypto.createHash('md5').update(cobination).digest('base64')
        return result === secretedpassword
    }

    generateToken(userId, phoneNum, nickName) {
        const tokenMsg = {
            userId,
            phoneNum,
            nickName,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 31536000, // 一年
        }
        const token = jwt.sign(tokenMsg, cert)
        return token
    }
}

module.exports = Business

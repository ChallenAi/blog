const express = require('express')
const reward = require('../controllers/reward')

const route = express.Router()

// 积分
route.post('/reward', reward.addReward.bind(reward))
route.get('/rewards', reward.getMyRewards.bind(reward))
route.get('/rewardRules', reward.getRewardRules.bind(reward))

module.exports = route

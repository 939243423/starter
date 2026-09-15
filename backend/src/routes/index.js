const express = require('express')
const router = express.Router()
const env = require('../config/env')

const authRoutes = require('./authRoutes')
const demoRoutes = require('./demoRoutes')

router.get('/health', (req, res) => {
  res.json({
    code: 0,
    message: 'ok',
    data: { status: 'ok', env: env.nodeEnv, time: new Date().toISOString() },
  })
})

router.use('/auth', authRoutes)
router.use('/demo', demoRoutes)

// 新增业务模块时：在这里挂载，例如 router.use('/game', gameRoutes)

module.exports = router

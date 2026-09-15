const express = require('express')
const router = express.Router()
const demoController = require('../controllers/demoController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.get('/items', demoController.list)
router.post('/items', verifyToken, demoController.create)
router.delete('/items/:id', verifyToken, demoController.remove)

module.exports = router

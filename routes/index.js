const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth.js')

router.use('/users', require('./modules/user.js'))
router.use('/auth', require('./modules/auths.js'))
router.use('/restaurants', authenticator, require('./modules/restaurant.js'))
router.use('/', authenticator, require('./modules/home.js'))

module.exports = router

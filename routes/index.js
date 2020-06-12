const express = require('express')
const router = express.Router()

router.use('/', require('./modules/home.js'))
router.use('/restaurants', require('./modules/restaurant.js'))
router.use('/users', require('./modules/user.js'))
router.use('/auth', require('./modules/auths.js'))

module.exports = router

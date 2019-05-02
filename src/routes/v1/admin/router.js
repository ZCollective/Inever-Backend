var express = require('express')
var router = express.Router()

router.use('/user', require('./user/router'))
router.use('/content', require('./content/router'))

module.exports = router

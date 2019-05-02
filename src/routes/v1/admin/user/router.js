var express = require('express')
var router = express.Router()

router.use('', require('./auth'))
// router.use('', require('./crud'))

module.exports = router

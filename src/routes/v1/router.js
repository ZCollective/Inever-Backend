var express = require('express')
var router = express.Router()

router.use('/admin', require('./admin/router'))
router.use('/public', require('./public/router'))

module.exports = router

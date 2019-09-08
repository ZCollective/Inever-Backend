const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var mysql = require('mysql2')
var fs = require('fs-extra')
var winston = require('winston')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
var https = require('https')
var http = require('http')

var config = require('../config/conf').get(process.env.NODE_ENV)

var logger = winston.createLogger(config.winston)

var exports = module.exports = {}

exports.startServer = function () {
  try {
    logger.info('Reading SSL Key and Cert...')
    try {
      var cert = fs.readFileSync(config.general.sslCert)
      var key = fs.readFileSync(config.general.sslKey)
    } catch (error) {
      logger.error('Error when Reading Cert or Key File: ' + error)
      process.exit(1)
    }

    /*
    Connecting to Mysql Database
    */
    logger.info('Connecting to Mysql Database...')
    var mysqlPool = mysql.createPool(config.mysql)
    logger.info('Connection to Mysql Database successful.')

    /*
    Configuring Session Storage
    */
    logger.info('Setting up Session Handling...')
    var sessionStorage = new MySQLStore({}, mysqlPool.promise())
    /*
    Configuring Session
    */
    var sessionOptions = config.session
    sessionOptions['store'] = sessionStorage
    var authSession = session(sessionOptions)

    logger.info('Session Store Setup Successful.')

    /*
    Configuring cors
    */
    logger.info('Configuring Cors with whitelist...')
    var whitelist = config.cors.whitelist
    var corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS: ' + origin))
        }
      },
      credentials: true
    }
    logger.info('Cors Configuration Successful.')
    logger.info('Starting Express Framework...')
    const app = express()

    /*
    Declaring middleware functions used by ALL Routes
    */
    logger.info('Adding Middleware Functions...')
    app.use(morgan('combined'))
    app.use(cors(corsOptions))
    app.use(bodyParser.json())

    /*
    Adding resources to Response object
    */
    app.use(function (req, res, next) {
      res.locals.mysql = mysqlPool.promise()
      res.locals.sendError = require('./utils/sendError')
      res.locals.sendSuccess = require('./utils/sendSuccess')
      res.locals.logger = logger
      next()
    })

    app.use('/v1', authSession, require('./routes/v1/router'))

    app.use((req, res) => {
      res.status(404).send(JSON.stringify({ error: true, success: false, msg: 'Could not find the requested resource!' }))
    })

    if (process.env.NODE_ENV === 'production') {
      logger.info('Starting Listener on Port: ' + config.general.port)
      var httpsServer = https.createServer({ key: key, cert: cert }, app)
      httpsServer.listen(config.general.port)  
      logger.info('HTTPS REST Server Startup Complete.')
    } else {
      logger.info('Running Dev mode. Not using TLS...')
      logger.info('Starting Listener on Port: ' + config.general.port)
      var httpServer = http.createServer(app)
      httpServer.listen(config.general.port)  
      logger.info('HTTP REST Server Startup Complete.')
    }

  } catch (error) {
    logger.error('Fatal error has occurred in HTTPS REST Server ' + process.pid + ' : ' + error)
    logger.error('Stacktrace: ' + error.stack)
    process.exit(-1)
  }
}

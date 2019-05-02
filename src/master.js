var winston = require('winston')
var config = require('../config/conf').get(process.env.NODE_ENV)
const cluster = require('cluster')
const numCPUs = process.env.NODE_ENV === 'production' ? require('os').cpus().length : 1
const logger = winston.createLogger(config.winston)

if (cluster.isMaster) {
  logger.info('Master PID is: ' + process.pid)
  logger.info('Starting HTTPS REST Servers...')

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info('Server died: ' + worker.process.pid + ' with}) signal: ' + signal)
    logger.info('Starting new server...')
    cluster.fork()
  })
} else {
  logger.info('HTTPS REST Server ' + process.pid + ' is starting up...')
  require('./server').startServer()
}

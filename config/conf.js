var winston = require('winston')
require('winston-daily-rotate-file')
var path = require('path')

var transport = new (winston.transports.DailyRotateFile)({
  frequency: '24h',
  filename: 'ihnn-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYY-MM-DD-HH'
})

transport.on('rotate', () => {
  console.log('Rotating File!')
})
var config = {
  production: {
    cors: {
      whitelist: ['ihnn-app']
    },
    winston: {
      level: 'info',
      format: winston.format.json(),
      transports: [
        transport
      ]
    },
    mysql: {
      host: 'ihnn.cq1qkg0vhhzt.eu-central-1.rds.amazonaws.com',
      user: 'server',
      password: 'IHNNSERVER',
      database: 'ihnn',
      waitForConnections: true
    },
    session: {
      name: 'auth',
      saveUninitialized: false,
      secret: '0FNQCdhx93eQnxAWOZ32SGZJ84qQOM5xFa5peE95v7jXuHqK2EVWUCgFNJO5vGi',
      unset: 'destroy',
      resave: false,
      cookie: {
        httpOnly: true,
        maxAge: 36000000
      }
    },
    general: {
      port: 11337,
      sslCert: path.join(process.cwd(), 'ssl/dev/server-cert.pem'),
      sslKey: path.join(process.cwd(), 'ssl/dev/server-key.pem')
    }
  },
  default: {
    cors: {
      whitelist: ['ihnn-app']
    },
    winston: {
      level: 'silly',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console()
      ]
    },
    mysql: {
      host: 'ihnn.cq1qkg0vhhzt.eu-central-1.rds.amazonaws.com',
      user: 'server',
      password: 'IHNNSERVER',
      database: 'ihnn',
      waitForConnections: true
    },
    session: {
      name: 'auth',
      saveUninitialized: false,
      secret: '0FNQCdhx93eQnxAWOZ32SGZJ84qQOM5xFa5peE95v7jXuHqK2EVWUCgFNJO5vGi',
      unset: 'destroy',
      resave: false,
      cookie: {
        httpOnly: true,
        maxAge: 36000000
      }
    },
    general: {
      port: 11337,
      sslCert: path.join(process.cwd(), 'ssl/dev/server-cert.pem'),
      sslKey: path.join(process.cwd(), 'ssl/dev/server-key.pem')
    }
  }
}

exports.get = function get (env) {
  return config[env] || config.default
}

var winston = require('winston')
var path = require('path')

var config = {
  production: {
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

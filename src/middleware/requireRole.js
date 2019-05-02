const sendError = require('../utils/sendError')

/*
This module has error prefix: 001
*/

module.exports = function (roleid) {
  return (req, res, next) => {
    var logger = res.locals.logger
    try {
      if (req.session.roleid === roleid) {
        next()
      } else {
        logger.debug('User does not have required role: ' + roleid)
        sendError(res, 'Unauthorized - Insufficient Permissions.', 403)
      }
    } catch (error) {
      logger.error('001-002 Error when checking Cookie! ' + error)
      sendError(res, '500 Server Error. Please inform the Developers! (001-002)')
    }
  }
}

const sendError = require('../utils/sendError')

/*
This module has error prefix: 001
*/

module.exports = function (req, res, next) {
  var logger = res.locals.logger
  try {
    if (req.session.loggedIn) {
      next()
    } else {
      logger.debug('User is not logged in. Unauthorized!')
      sendError(res, 'Unauthorized - Please log in.', 403)
    }
  } catch (error) {
    logger.error('001-001 Error when checking Cookie! ' + error)
    sendError(res, '500 Server Error. Please inform the Developers! (001-001)')
  }
}

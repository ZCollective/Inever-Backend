/*
General Imports
*/
var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
/*
Middleware Imports
*/
const requireLogin = require('../../../../middleware/requireLogin')

/*
Constants
*/

const saltRounds = 10
const tables = require('../../../../utils/db')

/*
Error Code Information -> Prefix: 002
*/

/*
API Endpoints
*/

router.post('/login', async (req, res) => {
  var logger = res.locals.logger
  try {
    var username = req.body.username
    var password = req.body.password

    if (!username || !password) {
      logger.error('Could not get username from request body!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var user = tables.tables.user
      var getPwQuery = `SELECT ${user.columns.password}, ${user.columns.role_id_fk}, ${user.columns.id} FROM ${user.name} WHERE ${user.columns.username}=?`
      let [results] = await res.locals.mysql.query(getPwQuery, [username])
      if (results.length < 1) {
        logger.error('Could not find user ' + username)
        res.locals.sendError(res, 'BAD_REQUEST', 400)
      } else if (results.length > 1) {
        logger.error('002-001 | Found two users with the same username!!! Panic!! ' + username)
        res.locals.sendError(res, 'INTERNAL_ERROR_002-001')
      } else {
        const match = await bcrypt.compare(password, results[0][user.columns.password])
        if (match) {
          req.session.username = username
          req.session.userid = results[0][user.columns.id]
          req.session.roleid = results[0][user.columns.role_id_fk]
          req.session.loggedIn = true
          res.locals.sendSuccess(res, 'LOGGED_IN')
        } else {
          logger.debug('Password did not match!')
          res.locals.sendError(res, 'BAD_REQUEST', 400)
        }
      }
    }
  } catch (error) {
    logger.error('002-002 | Error occurred in login route: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-002')
  }
})

router.get('/logout', requireLogin, async (req, res) => {
  try {
    req.session.loggedIn = false
    req.session.destroy()
    res.locals.sendSuccess(res, 'LOGGED_OUT')
  } catch (error) {
    res.locals.logger.error('002-003 | Fatal Error in Logout route: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-003')
  }
})

router.post('/changePassword', requireLogin, async (req, res) => {
  var logger = res.locals.logger
  try {
    var oldPw = req.body.oldPassword
    var newPw = req.body.newPassword

    if (!oldPw) {
      logger.error('No old password given!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else if (!newPw) {
      logger.error('No new password given!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var user = tables.tables.user
      var getPwQuery = `SELECT ${user.columns.password} FROM ${user.name} WHERE ${user.columns.id}=?`
      let [results] = await res.locals.mysql.query(getPwQuery, [req.session.userid])
      if (results.length < 1) {
        logger.error('Could not find user ' + req.session.username)
        res.locals.sendError(res, 'BAD_REQUEST', 400)
      } else if (results.length > 1) {
        logger.error('002-001 | Found two users with the same username!!! Panic!! ' + req.session.username)
        res.locals.sendError(res, 'INTERNAL_ERROR_002-005')
      } else {
        const match = await bcrypt.compare(oldPw, results[0][user.columns.password])
        if (match) {
          const newHash = await bcrypt.hash(newPw, saltRounds)
          var updatePwQuery = `UPDATE ${user.name} SET ${user.columns.password}=? WHERE ${user.columns.id}=?`
          await res.locals.mysql.query(updatePwQuery, [newHash, req.session.userid])
          logger.debug('Successfully updated Password!')
          res.locals.sendSuccess(res, 'PASSWORD_CHANGED')
        } else {
          logger.debug('Password did not match! Keeping old Password!')
          res.locals.sendError(res, 'BAD_REQUEST', 400)
        }
      }
    }
  } catch (error) {
    logger.error('002-004 | Fatal Error in changePassword route: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-004')
  }
})

module.exports = router

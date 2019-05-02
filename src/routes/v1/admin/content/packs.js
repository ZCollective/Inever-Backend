/*
General Imports
*/
var express = require('express')
var router = express.Router()

/*
Middleware Imports
*/
const requireLogin = require('../../../../middleware/requireLogin')
const requireRole = require('../../../../middleware/requireRole')

/*
Constants
*/

const tables = require('../../../../utils/db')

/*
Error Code Information -> Prefix: 002
*/

/*
API Endpoints
*/

router.post('/createPack', requireLogin, requireRole(1), async (req, res) => {
  var logger = res.locals.logger
  try {
    var packname = req.body.packname
    var description = req.body.description
    var keywords = req.body.keywords
    var minage = req.body.minage

    var questions = req.body.questions

    if (!packname) {
      logger.debug('Could not get Pack Name from Body!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var packTable = tables.tables.content_pack
      var questionTable = tables.tables.question

      var createPackQuery = `INSERT INTO ${packTable.name} 
      (${packTable.columns.name}, ${packTable.columns.description}, ${packTable.columns.keywords}, ${packTable.columns.min_age})
      VALUES
      (?,?,?,?)`
      try {
        var [results] = await res.locals.mysql.query(createPackQuery, [packname, description, keywords, minage])
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          logger.debug('Duplicate Entry Found!')
          res.locals.sendError(res, 'DUPLICATE_CONTENT_PACK', 400)
        } else {
          logger.debug('002-003 | Error when inserting new Pack into Database. Error: ' + error)
          res.locals.sendError(res, 'INTERNAL_ERROR_002-003')
        }
        return
      }
      if (Array.isArray(questions)) {
        var questionValues = [questions.map((question) => { return [question, results.insertId] })]
        var insertQuestionQuery = `INSERT INTO ${questionTable.name} (${questionTable.columns.string}, ${questionTable.columns.content_pack_id_fk}) VALUES ?`
        try {
          await res.locals.mysql.query(insertQuestionQuery, questionValues)
        } catch (error) {
          logger.error('002-002 | Error when inserting Questions for new Content Pack: ' + error)
          res.locals.sendError(res, 'INTERNAL_ERROR_002-002')
          return
        }
      }
      logger.debug('Successfully created new content pack, and added Questions (if they existed)')
      res.locals.sendSuccess(res, 'ALL_FINE')
    }
  } catch (error) {
    logger.error('002-001 | Fatal error in /createPack: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-001')
  }
})

router.post('/updatePack', requireLogin, requireRole(1), async (req, res) => {
  var logger = res.locals.logger
  try {
    var packid = req.body.packid
    var packname = req.body.packname
    var description = req.body.description
    var keywords = req.body.keywords
    var minage = req.body.minage

    var updates = req.body.updates
    var additions = req.body.additions


    if (!packid || !packname || !description || !keywords || !minage) {
      logger.debug('Could not read all required fields from body')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var packTable = tables.tables.content_pack
      var questionTable = tables.tables.question

      var updatePackQuery = `UPDATE ${packTable.name} 
      SET ${packTable.columns.name}=?,
      ${packTable.columns.description}=?,
      ${packTable.columns.keywords}=?,
      ${packTable.columns.min_age}=?,
      ${packTable.columns.version}=${packTable.columns.version}+1
      WHERE ${packTable.columns.id}=?`

      logger.debug('Query is: ' + updatePackQuery)

      await res.locals.mysql.query(updatePackQuery, [ packname, description, keywords, minage, packid ])

      if (Array.isArray(updates) && updates.length > 0) {
        logger.debug('Found Questions to Update!')
        var updateQuestionsQuery = `REPLACE INTO ${questionTable.name}
        (${questionTable.columns.id}, ${questionTable.columns.string}, ${questionTable.columns.content_pack_id_fk})
        VALUES ?`
        var valueArray = [updates
          .filter((update) => { return (update.questionid && update.string) })
          .map((update) => { return [update.questionid, update.string, packid] })]

        try {
          await res.locals.mysql.query(updateQuestionsQuery, valueArray)
        } catch (error) {
          logger.error('002-005 | Error when replacing Questions in Database: ' + error)
          res.locals.sendError(res, 'INTERNAL_ERROR_002-005')
        }
      }

      if (Array.isArray(additions) && additions.length > 0) {
        logger.debug('Found Questions to Add!')
        var additionArray = [additions
          .filter((addition) => { return (addition.string) })
          .map((addition) => { return [addition.string, packid] })]

        var insertQuestionQuery = `INSERT INTO ${questionTable.name} (${questionTable.columns.string}, ${questionTable.columns.content_pack_id_fk}) VALUES ?`
        try {
          await res.locals.mysql.query(insertQuestionQuery, additionArray)
        } catch (error) {
          logger.error('002-006 | Error when inserting new Questions into Database: ' + error)
          res.locals.sendError(res, 'INTERNAL_ERROR_002-006')
        }
      }

      logger.debug('Updated Content Pack, and updated/inserted Questions (if there were any)')
      res.locals.sendSuccess(res, 'ALL_FINE')
    }
  } catch (error) {
    logger.error('002-004 | Fatal error occurred during /updatePack: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-004')
  }
})

router.post('/deletePack', requireLogin, requireRole(1), async (req, res) => {
  var logger = res.locals.logger
  try {
    var packid = req.body.packid
    if (!packid) {
      logger.debug('Could not get packid from request body!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var packTable = tables.tables.content_pack
      var deleteQuery = `DELETE FROM ${packTable.name} WHERE ${packTable.columns.id}=?`
      await res.locals.mysql.query(deleteQuery, [packid])
      logger.debug('Deleted Content Pack (' + packid + ') From Database')
      res.locals.sendSuccess(res, 'PACK_DELETED')
    }
  } catch (error) {
    logger.error('002-005 | Fatal error occurred during /deletePack: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_002-005')
  }
})

module.exports = router

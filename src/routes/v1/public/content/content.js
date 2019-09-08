/*
General Imports
*/
var express = require('express')
var router = express.Router()
/*
Middleware Imports
*/

/*
Constants
*/

const db = require('../../../../utils/db')

/*
Error Code Information -> Prefix: 100
*/

/*
API Endpoints
*/

// Error codes 001
router.get('/packs', async (req, res) => {
  var logger = res.locals.logger
  try {
    var packTable = db.tables.content_pack
    var getAllQuery = `SELECT ${packTable.columns.id} AS id,
    ${packTable.columns.name} AS name,
    ${packTable.columns.description} AS description,
    ${packTable.columns.keywords} AS keywords,
    ${packTable.columns.min_age} AS min_age,
    ${packTable.columns.version} AS version FROM ${packTable.name}`
    var [results] = await res.locals.mysql.query(getAllQuery)
    logger.debug('Got ' + results.length + ' Results from Database')
    res.locals.sendSuccess(res, results)
  } catch (error) {
    logger.error('100-001 | Error occurred in /packs: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_100-001')
  }
})

// Error codes 002
router.get('/packs/:packid/questions', async (req, res) => {
  var logger = res.locals.logger
  try {
    var packid = req.params.packid
    if (!packid) {
      logger.debug('Could not get packid from Route!')
      res.locals.sendError(res, 'BAD_REQUEST', 400)
    } else {
      var questionTable = db.tables.question
      var getQuestionQuery = `SELECT ${questionTable.columns.id} AS id,
      ${questionTable.columns.string} AS string,
      ${questionTable.columns.content_pack_id_fk} AS packid FROM ${questionTable.name} WHERE ${questionTable.columns.content_pack_id_fk}=?`
      var [results] = await res.locals.mysql.query(getQuestionQuery, [packid])
      logger.debug('Got ' + results.length + ' Results from Database')
      res.locals.sendSuccess(res, results)
    }
  } catch (error) {
    logger.error('100-002 | Error occurred in /:packid/questions: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_100-002')
  }
})

// Error codes 003-
router.post('/questionProposal', async (req, res) => {
  var logger = res.locals.logger
  try {
    var string = req.body.string
    var senderName = req.body.sender

    if (!string) {
      logger.error('100-004 | Did not receive any String from Question!')
      res.locals.sendError(res, 'INTERNAL_ERROR_100-004')
    } else {
      senderName = senderName || null

      var proposalTable = db.tables.proposals
      var insertProposalQuery = `INSERT INTO ${proposalTable.name} (${proposalTable.columns.string}, ${proposalTable.columns.sender}) VALUES (?,?)`
      await res.locals.mysql.query(insertProposalQuery, [string, senderName])
      res.locals.sendSuccess(res, 'SUCCESS')
    }

  } catch (error) {
    logger.error('100-003 | Error occurred in /questionProposal: ' + error)
    res.locals.sendError(res, 'INTERNAL_ERROR_100-003')
  }
})

module.exports = router

const R = require('ramda')

const {sendErr} = require('../serverUtils/response')
const Request = require('../serverUtils/request')

//const {requireSurveyEditPermission} = require('../authGroup/authMiddleware')
const SurveyRdbManager = require('./surveyRdbManager')

module.exports.init = app => {

  app.get('/surveyRdb/:surveyId/query', async (req, res) => {
    try {
      const surveyId = Request.getRequiredParam(req, 'surveyId')
      const offset = Request.getRestParam(req, 'offset')
      const limit = Request.getRestParam(req, 'limit')
      const tableName = Request.getRequiredParam(req, 'tableName')
      const cols = Request.getJsonParam(req, 'cols', [])

      const rows = await SurveyRdbManager.queryTable(surveyId, tableName, cols, offset, limit)

      res.json(rows)
    } catch (err) {
      sendErr(res, err)
    }
  })
}
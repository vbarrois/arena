const Request = require('../serverUtils/request')
const Response = require('../serverUtils/response')

const SurveyRdbManager = require('./surveyRdbManager')

const {
  requireRecordListViewPermission,
} = require('../authGroup/authMiddleware')

module.exports.init = app => {

  app.get('/surveyRdb/:surveyId/:tableName/query', requireRecordListViewPermission, async (req, res) => {
    try {
      const surveyId = Request.getRequiredParam(req, 'surveyId')
      const tableName = Request.getRequiredParam(req, 'tableName')

      const cols = Request.getJsonParam(req, 'cols', [])
      const offset = Request.getRestParam(req, 'offset')
      const limit = Request.getRestParam(req, 'limit')
      const filter = Request.getRestParam(req, 'filter', '')
      const sort = Request.getRestParam(req, 'sort', '')

      const rows = await SurveyRdbManager.queryTable(surveyId, tableName, cols, offset, limit, filter, sort)

      res.json(rows)
    } catch (err) {
      Response.sendErr(res, err)
    }
  })

  app.get('/surveyRdb/:surveyId/:tableName/query/count', requireRecordListViewPermission, async (req, res) => {
    try {
      const surveyId = Request.getRequiredParam(req, 'surveyId')
      const tableName = Request.getRequiredParam(req, 'tableName')
      const filter = Request.getRestParam(req, 'filter', '')

      const count = await SurveyRdbManager.countTable(surveyId, tableName, filter)

      res.json(count)
    } catch (err) {
      Response.sendErr(res, err)
    }
  })

  app.get('/surveyRdb/:surveyId/:tableName/export', requireRecordListViewPermission, async (req, res) => {
    try {
      const surveyId = Request.getRequiredParam(req, 'surveyId')
      const tableName = Request.getRequiredParam(req, 'tableName')
      const cols = Request.getJsonParam(req, 'cols', [])
      const filter = Request.getRestParam(req, 'filter', '')
      const sort = Request.getRestParam(req, 'sort', '')

      Response.setContentTypeFile(res, 'data.csv', null, Response.contentTypes.csv)

      await SurveyRdbManager.exportTableToCSV(surveyId, tableName, cols, filter, sort, res)

      res.end()
    } catch (err) {
      Response.sendErr(res, err)
    }
  })

}
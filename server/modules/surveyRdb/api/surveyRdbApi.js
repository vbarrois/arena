const Request = require('../../../utils/request')
const Response = require('../../../utils/response')

const SurveyRdbService = require('../service/surveyRdbService')

const { requireRecordListViewPermission } = require('../../auth/authApiMiddleware')

module.exports.init = app => {

  app.get('/surveyRdb/:surveyId/:tableName/query', requireRecordListViewPermission, async (req, res) => {
    try {
      const user = Request.getSessionUser(req)
      const { surveyId, nodeDefUuidTable, tableName, offset, limit, filter = '', sort = '', editMode = false } = Request.getParams(req)

      const cols = Request.getJsonParam(req, 'cols', [])
      const nodeDefUuidCols = Request.getJsonParam(req, 'nodeDefUuidCols', [])

      const rows = await SurveyRdbService.queryTable(user, surveyId, nodeDefUuidTable, tableName, nodeDefUuidCols, cols, offset, limit, filter, sort, editMode)

      res.json(rows)
    } catch (err) {
      Response.sendErr(res, err)
    }
  })

  app.get('/surveyRdb/:surveyId/:tableName/query/count', requireRecordListViewPermission, async (req, res) => {
    try {
      const { surveyId, tableName, filter = '' } = Request.getParams(req)

      const count = await SurveyRdbService.countTable(surveyId, tableName, filter)

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

      await SurveyRdbService.exportTableToCSV(surveyId, tableName, cols, filter, sort, res)

      res.end()
    } catch (err) {
      Response.sendErr(res, err)
    }
  })

}
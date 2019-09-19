const Response = require('../../../utils/response')
const Request = require('../../../utils/request')

const Validator = require('../../../../common/validation/validator')

const SurveyService = require('../service/surveyService')

const AuthMiddleware = require('../../auth/authApiMiddleware')

const JobUtils = require('../../../job/jobUtils')

module.exports.init = app => {

  // ==== CREATE
  app.post('/survey', async (req, res, next) => {
    try {
      const user = Request.getUser(req)
      const body = Request.getBody(req)
      const validation = await SurveyService.validateNewSurvey(body)

      if (Validator.isValidationValid(validation)) {
        const survey = await SurveyService.createSurvey(user, body)

        res.json({ survey })
      } else {
        res.json({ validation })
      }
    } catch (err) {
      next(err)
    }

  })

  // ==== READ
  app.get('/surveys', async (req, res, next) => {
    try {
      const user = Request.getUser(req)

      const surveys = await SurveyService.fetchUserSurveysInfo(user)

      res.json({ surveys })
    } catch (err) {
      next(err)
    }
  })

  app.get('/survey/:surveyId', AuthMiddleware.requireSurveyViewPermission, async (req, res, next) => {
    try {
      const { surveyId, draft, validate } = Request.getParams(req)

      const survey = await SurveyService.fetchSurveyById(surveyId, draft, validate)

      res.json({ survey })
    } catch (err) {
      next(err)
    }
  })

  // ==== UPDATE

  app.put('/survey/:surveyId/info', AuthMiddleware.requireSurveyEditPermission, async (req, res, next) => {
    try {
      const user = Request.getUser(req)
      const body = Request.getBody(req)

      const { surveyId } = Request.getParams(req)

      const survey = await SurveyService.updateSurveyProps(user, surveyId, body)

      res.json(survey)
    } catch (err) {
      next(err)
    }
  })

  app.put('/survey/:surveyId/publish', AuthMiddleware.requireSurveyEditPermission, (req, res) => {
    const { surveyId } = Request.getParams(req)
    const user = Request.getUser(req)

    const job = SurveyService.startPublishJob(user, surveyId)

    res.json({ job: JobUtils.jobToJSON(job) })
  })

  // ==== DELETE

  app.delete('/survey/:surveyId', AuthMiddleware.requireSurveyEditPermission, async (req, res, next) => {
    try {
      const { surveyId } = Request.getParams(req)
      const user = Request.getUser(req)

      await SurveyService.deleteSurvey(surveyId, user)

      Response.sendOk(res)
    } catch (err) {
      next(err)
    }
  })

}

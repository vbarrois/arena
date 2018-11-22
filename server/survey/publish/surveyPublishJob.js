const Job = require('../../job/job')

const NodeDefsValidationJob = require('./nodeDefsValidationJob')
const CodeListsValidationJob = require('./codeListsValidationJob')
const TaxonomiesValidationJob = require('./taxonomiesValidationJob')
const SurveyInfoValidationJob = require('./surveyInfoValidationJob')
const SurveyPropsPublishJob = require('./surveyPropsPublishJob')

const getDefaultInnerJobs = (params) => [
  new NodeDefsValidationJob(params),
  new CodeListsValidationJob(params),
  new TaxonomiesValidationJob(params),
  new SurveyInfoValidationJob(params),
  new SurveyPropsPublishJob(params),
]

class SurveyPublishJob extends Job {

  constructor (params, innerJobs = getDefaultInnerJobs(params)) {

    super(SurveyPublishJob.type, params, innerJobs)

  }

}

SurveyPublishJob.type = 'SurveyPublishJob'

module.exports = SurveyPublishJob
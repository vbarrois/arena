const Job = require('../../../../job/job')

const NodeDefsValidationJob = require('./jobs/nodeDefsValidationJob')
const CategoriesValidationJob = require('./jobs/categoriesValidationJob')
const TaxonomiesValidationJob = require('./jobs/taxonomiesValidationJob')
const SurveyInfoValidationJob = require('./jobs/surveyInfoValidationJob')
const RecordCheckJob = require('../recordCheckJob')
const SurveyPublishPerformJob = require('./surveyPublishPerformJob')
const SurveyRdbGeneratorJob = require('../surveyRdbGeneratorJob')

class SurveyPublishJob extends Job {

  constructor (params) {
    super(SurveyPublishJob.type, params, [
      new NodeDefsValidationJob(),
      new CategoriesValidationJob(),
      new TaxonomiesValidationJob(),
      new SurveyInfoValidationJob(),
      // record check must be executed before publishing survey props
      new RecordCheckJob(),
      new SurveyPublishPerformJob(),
      new SurveyRdbGeneratorJob()
    ])
  }
}

SurveyPublishJob.type = 'SurveyPublishJob'

module.exports = SurveyPublishJob
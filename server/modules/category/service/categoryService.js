const CategoryManager = require('../manager/categoryManager')
const JobManager = require('../../../job/jobManager')
const CategoryImportJob = require('./categoryImportJob')
const CategoryImportCSVParser = require('./categoryImportCSVParser')

const createImportSummary = async (surveyId, categoryUuid, filePath) => {
  return await CategoryImportCSVParser.createImportSummary(filePath)
}

const importCategory = (user, surveyId, categoryUuid, summary) => {
  const job = new CategoryImportJob({
    user,
    surveyId,
    categoryUuid,
    summary
  })

  JobManager.executeJobThread(job)

  return job
}

module.exports = {
  insertCategory: CategoryManager.insertCategory,
  createImportSummary,
  importCategory,
  insertLevel: CategoryManager.insertLevel,
  insertItem: CategoryManager.insertItem,

  fetchCategoryByUuid: CategoryManager.fetchCategoryByUuid,
  fetchCategoriesBySurveyId: CategoryManager.fetchCategoriesBySurveyId,
  fetchItemsByParentUuid: CategoryManager.fetchItemsByParentUuid,
  fetchItemByUuid: CategoryManager.fetchItemByUuid,

  updateCategoryProp: CategoryManager.updateCategoryProp,
  updateLevelProp: CategoryManager.updateLevelProp,
  updateItemProp: CategoryManager.updateItemProp,

  deleteCategory: CategoryManager.deleteCategory,
  deleteLevel: CategoryManager.deleteLevel,
  deleteItem: CategoryManager.deleteItem,
}
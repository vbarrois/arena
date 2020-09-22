export { clickHeaderBtnMySurveys, clickHeaderBtnCreateSurvey } from './header'
export { clickHomeBtnEditSurveyInfo, expectHomeDashboard } from './home'
export { waitForLoader } from './loader'
export {
  addItemToPage,
  clickNodeDefCategoryAdd,
  clickNodeDefSaveAndClose,
  expectNodeDefCategoryIs,
} from './nodeDefDetail'
export { clickSidebarBtnHome, clickSidebarBtnSurveyForm } from './sidebar'
export {
  expectItemIsTheLastNodeDef,
  expectSurveyFormItemsAreInOrder,
  expectSurveyFormEntityItemsAreInOrder,
  expectSurveyFormLoaded,
} from './surveyForm'
export {
  editSurveyFormPage,
  addSurveyFormSubPage,
  expectEmptyPageHasError,
  expectCurrentPageIs,
  expectSurveyFormHasOnlyAndInOrderThesePages,
} from './surveyFormPage'
export {
  writeCategoryName,
  updateCategoryLevelName,
  addCategoryLevel,
  addCategoryItem,
  clickCategoryButtonClose,
} from './categoryDetails'

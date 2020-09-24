export { clickHeaderBtnMySurveys, clickHeaderBtnCreateSurvey } from './header'
export { clickHomeBtnEditSurveyInfo, expectHomeDashboard } from './home'
export { waitForLoader } from './loader'
export {
  addItemToPage,
  clickNodeDefCategoryAdd,
  clickNodeDefSaveAndBack,
  expectNodeDefCategoryIs,
  expectNodeDefCodeParentIsDisabled,
} from './nodeDefDetail'
export { clickSidebarBtnHome, clickSidebarBtnSurveyForm, clickSidebarBtnDesignerCategories } from './sidebar'
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
  clickCategoryItem,
  clickCategoryItemBtnClose,
  clickCategoryButtonClose,
  clickCategoryButtonDone,
  expectCategoryItemsInLevel,
  expectCategoryItemsInLevelEmpty,
} from './categoryDetails'

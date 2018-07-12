import {
  exportReducer,
  assocActionProps,
} from '../app-utils/reduxUtils'

import {
  actionTypes
} from './surveyDashboard'

const actionHandlers = {

  [actionTypes.surveyLoaded]: assocActionProps,

  [actionTypes.surveyDesignerLoaded]: assocActionProps,

}

export default exportReducer(actionHandlers)
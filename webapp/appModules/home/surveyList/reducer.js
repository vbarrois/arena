import { exportReducer } from '../../../appUtils/reduxUtils'

import { appUserLogout } from '../../../app/actions'

import { homeSurveyListUpdate } from './actions'

const actionHandlers = {
  [appUserLogout]: () => ({}),

  [homeSurveyListUpdate]: (state, {surveys}) => surveys,
}

export default exportReducer(actionHandlers)
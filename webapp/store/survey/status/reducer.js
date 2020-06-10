import { exportReducer } from '@webapp/utils/reduxUtils'

import { SystemActions } from '@webapp/store/system'
import * as SurveyActions from '../actions'

import * as SurveyStatusState from './state'

const actionHandlers = {
  // Reset state
  [SystemActions.SYSTEM_RESET]: () => ({}),

  [SurveyActions.surveyCreate]: () => ({}),
  [SurveyActions.surveyUpdate]: () => ({}),
  [SurveyActions.surveyDelete]: () => ({}),

  [SurveyActions.surveyDefsReset]: SurveyStatusState.resetDefsFetched,

  [SurveyActions.surveyDefsLoad]: (state, { draft }) => SurveyStatusState.assocDefsFetched(draft)(state),
}

export default exportReducer(actionHandlers)

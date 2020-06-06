import axios from 'axios'

import * as Survey from '@core/survey/survey'

import * as LoaderActions from '@webapp/app/actions'
import * as NotificationActions from '@webapp/app/appNotification/actions'
import { appModuleUri, homeModules } from '@webapp/app/appModules'

import * as SurveyState from '../surveyState'
import { surveyDelete } from './actionTypes'

export const deleteSurvey = (history) => async (dispatch, getState) => {
  dispatch(LoaderActions.showAppLoader())

  const state = getState()
  const surveyId = SurveyState.getSurveyId(state)
  const surveyInfo = SurveyState.getSurveyInfo(state)

  await axios.delete(`/api/survey/${surveyId}`)

  await dispatch({ type: surveyDelete, surveyInfo })

  // Navigate to survey list
  history.push(appModuleUri(homeModules.surveyList))

  await dispatch(LoaderActions.hideAppLoader())

  await dispatch(
    NotificationActions.showNotification('homeView.surveyDeleted', {
      surveyName: Survey.getName(surveyInfo),
    })
  )
}

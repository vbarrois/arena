import axios from 'axios'

import * as Chain from '@common/analysis/processingChain'

import { analysisModules, appModuleUri } from '@webapp/app/appModules'

import * as SurveyState from '@webapp/survey/surveyState'

import { hideAppSaving, showAppSaving } from '@webapp/app/actions'

export const chainUpdate = 'analysis/chain/update'
export const chainReset = 'analysis/chain/reset'

export const initChain = (chain) => async (dispatch, getState) => {
  dispatch(showAppSaving())
  const surveyId = SurveyState.getSurveyId(getState())

  if (chain) {
    // Fetch other chains attribute uuids
    const { data: attributeUuidsOtherChains } = await axios.get(
      `/api/survey/${surveyId}/processing-chain/${Chain.getUuid(chain)}/attribute-uuids-other-chains`
    )
    dispatch({ type: chainUpdate, chain, attributeUuidsOtherChains })
  }

  dispatch(hideAppSaving())
}

export const resetChain = () => (dispatch) => dispatch({ type: chainReset })

export const navigateToChainsView = (history) => (dispatch) => {
  dispatch(resetChain())
  // Navigate to processing chains view
  history.push(appModuleUri(analysisModules.processingChains))
}

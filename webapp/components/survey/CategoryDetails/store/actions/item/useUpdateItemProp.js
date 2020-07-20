import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { AppSavingActions } from '@webapp/store/app'
import { SurveyActions, useSurveyId } from '@webapp/store/survey'

import { debounceAction } from '@webapp/utils/reduxUtils'
import { State } from '../../state'

const _putPropAction = ({ surveyId, categoryUuid, itemUuid, key, value, setState }) => async (dispatch) => {
  dispatch(AppSavingActions.showAppSaving())
  const {
    data: { category },
  } = await axios.put(`/api/survey/${surveyId}/categories/${categoryUuid}/items/${itemUuid}`, {
    key,
    value,
  })

  dispatch(SurveyActions.metaUpdated())

  // Update category with validation in state
  setState(State.assocCategory({ category }))

  dispatch(AppSavingActions.hideAppSaving())
}

export const useUpdateItemProp = ({ setState }) => {
  const dispatch = useDispatch()
  const surveyId = useSurveyId()

  return useCallback(async ({ categoryUuid, levelIndex, itemUuid, key, value }) => {
    setState(State.assocItemProp({ levelIndex, itemUuid, key, value }))

    dispatch(
      debounceAction(
        _putPropAction({ surveyId, categoryUuid, itemUuid, key, value, setState }),
        `category_item_update_${itemUuid}`
      )
    )
  }, [])
}

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import * as A from '@core/arena'
import * as Category from '@core/survey/category'

import { SurveyActions, useSurveyId } from '@webapp/store/survey'

import { State } from '../state'

const _createCategory = async ({ surveyId, onCategoryCreated, dispatch }) => {
  const {
    data: { category },
  } = await axios.post(`/api/survey/${surveyId}/categories`, Category.newCategory())

  if (onCategoryCreated) {
    onCategoryCreated(category)
  }
  dispatch(SurveyActions.metaUpdated())

  return category
}

const _fetchCategory = async ({ surveyId, categoryUuid }) => {
  const {
    data: { category },
  } = await axios.get(`/api/survey/${surveyId}/categories/${categoryUuid}?draft=true&validate=true`)

  return category
}

export const useInit = ({ setState }) => {
  const dispatch = useDispatch()
  const surveyId = useSurveyId()

  return useCallback(async ({ categoryUuid, onCategoryCreated }) => {
    let category = null

    if (A.isEmpty(categoryUuid)) {
      category = await _createCategory({ surveyId, onCategoryCreated, dispatch })
    } else {
      category = await _fetchCategory({ surveyId, categoryUuid })
    }

    setState((statePrev) => State.assocCategory(category)(statePrev))
  }, [])
}

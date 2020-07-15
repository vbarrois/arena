import axios from 'axios'

import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'

import * as Survey from '@core/survey/survey'
import * as ObjectUtils from '@core/objectUtils'

import { useLang } from '@webapp/store/system'
import { useOnUpdate } from '@webapp/components/hooks'

import * as SurveyState from '../state'
import { SurveyStatusState } from '../status'

// ==== Survey
export const useSurveyDefsFetched = (draft) => useSelector(SurveyStatusState.areDefsFetched(draft))
export const useSurvey = () => useSelector(SurveyState.getSurvey)
export const useSurveyId = () => useSelector(SurveyState.getSurveyId)
export const useSurveyInfo = () => useSelector(SurveyState.getSurveyInfo)
export const useSurveyCycleKey = () => useSelector(SurveyState.getSurveyCycleKey)
export const useSurveyCycleKeys = () => useSelector(SurveyState.getSurveyCyclesKeys)

export const useSurveyLang = () => Survey.getLanguage(useLang())(useSurveyInfo())
export const useSurveyLangs = () => Survey.getLanguages(useSurveyInfo())

export const useOnSurveyCycleUpdate = (effect) => {
  const surveyCycleKey = useSurveyCycleKey()
  useOnUpdate(effect, [surveyCycleKey])
}

export const useNodeDefRootKeys = () => Survey.getNodeDefRootKeys(useSurvey())

// ==== Node defs
export const useNodeDefByUuid = (uuid) => Survey.getNodeDefByUuid(uuid)(useSurvey())
export const useNodeDefsByUuids = (uuids) => Survey.getNodeDefsByUuids(uuids)(useSurvey())

// ==== Categories
export const useCategoryByUuid = (uuid) => Survey.getCategoryByUuid(uuid)(useSurvey())

const useSurveyItem = ({ type }) => {
  const surveyId = useSurveyId()
  const [state, setState] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/survey/${surveyId}/${type}`, {
        params: { draft: true, validate: false },
      })
      setState(data.list)
    }
    fetchData()
  }, [surveyId])

  const getItemsById = useCallback(
    () => (state || []).reduce((byId, item) => ({ ...byId, [ObjectUtils.getUuid(item)]: { ...item } }), {}),
    [state]
  )

  const getItemsByUuid = useCallback(
    (uuid) => {
      const itemsById = getItemsById()
      return itemsById[uuid]
    },
    [state]
  )

  return {
    items: state,
    getItemsByUuid,
  }
}

export const useSurveyCategories = () => {
  const { items: categories, getItemsByUuid } = useSurveyItem({ type: 'categories' })
  return {
    categories,
    Actions: {
      getCategoryByUuid: getItemsByUuid,
    },
  }
}

// ==== Taxonomies

export const useSurveyTaxonomies = () => {
  const { items: taxonomies, getItemsByUuid } = useSurveyItem({ type: 'taxonomies' })
  return {
    taxonomies,
    Actions: {
      getTaxonomyByUuid: getItemsByUuid,
    },
  }
}

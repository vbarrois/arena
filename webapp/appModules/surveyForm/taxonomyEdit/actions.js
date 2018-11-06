import axios from 'axios'

import { debounceAction } from '../../../appUtils/reduxUtils'
import Taxonomy from '../../../../common/survey/taxonomy'

import { getStateSurveyId, getSurvey } from '../../../survey/surveyState'
import { showAppJobMonitor } from '../../../app/components/job/actions'
import { getTaxonomyEditTaxaPerPage } from './taxonomyEditState'
import { taxonomyCreate, taxonomyDelete, taxonomyPropUpdate, taxonomyUpdate } from '../../../survey/taxonomies/actions'
import { getSurveyForm } from '../surveyFormState'

// taxonomy editor actions
export const taxonomyEditUpdate = 'survey/taxonomyEdit/update'
export const taxonomyEditPropsUpdate = 'survey/taxonomyEdit/props/update'

const dispatchTaxonomyUpdate = (dispatch, taxonomy) => dispatch({type: taxonomyUpdate, taxonomy})

const dispatchTaxonomyEditPropsUpdate = (dispatch, props) => dispatch({type: taxonomyEditPropsUpdate, ...props})

// ====== SET TAXONOMY FOR EDIT

export const setTaxonomyForEdit = taxonomy => dispatch =>
  dispatch({type: taxonomyEditUpdate, taxonomyUUID: taxonomy ? taxonomy.uuid : null})

// ====== CREATE

export const createTaxonomy = () => async (dispatch, getState) => {
  const taxonomy = Taxonomy.newTaxonomy()
  dispatch({type: taxonomyCreate, taxonomy})

  const surveyId = getStateSurveyId(getState())
  const {data} = await axios.post(`/api/survey/${surveyId}/taxonomies`, taxonomy)

  dispatchTaxonomyUpdate(dispatch, data.taxonomy)
}

// ====== READ

const ROWS_PER_PAGE = 15

export const reloadTaxa = (taxonomy) => async (dispatch, getState) => {
  const surveyId = getStateSurveyId(getState())
  const {data} = await axios.get(`/api/survey/${surveyId}/taxonomies/${taxonomy.id}/taxa/count?draft=true`)

  dispatchTaxonomyEditPropsUpdate(dispatch, {taxaTotalPages: Math.ceil(data.count / ROWS_PER_PAGE)})
  dispatch(loadTaxa(taxonomy))
}

export const loadTaxa = (taxonomy, page = 1) => async (dispatch, getState) => {
  dispatchTaxonomyEditPropsUpdate(dispatch, {taxaCurrentPage: page, taxa: []})

  const state = getState()
  const surveyForm = getSurveyForm(state)
  const surveyId = getStateSurveyId(state)
  const rowsPerPage = getTaxonomyEditTaxaPerPage(surveyForm)
  const {data} = await axios.get(`/api/survey/${surveyId}/taxonomies/${taxonomy.id}/taxa`, {
    params: {
      draft: true,
      limit: rowsPerPage,
      offset: (page - 1) * rowsPerPage
    }
  })

  dispatchTaxonomyEditPropsUpdate(dispatch, {taxa: data.taxa})
}

// ====== UPDATE
export const putTaxonomyProp = (taxonomy, key, value) => async (dispatch, getState) => {
  dispatch({type: taxonomyPropUpdate, taxonomy, key, value})

  const action = async () => {
    const surveyId = getStateSurveyId(getState())
    const {data} = await axios.put(`/api/survey/${surveyId}/taxonomies/${taxonomy.id}`, {key, value})
    dispatchTaxonomyUpdate(dispatch, data.taxonomy)
  }
  dispatch(debounceAction(action, `${taxonomyPropUpdate}_${taxonomy.uuid}`))
}

export const uploadTaxonomyFile = (taxonomy, file) => async (dispatch, getState) => {
  const formData = new FormData()
  formData.append('file', file)

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  const surveyId = getStateSurveyId(getState())
  const {data} = await axios.post(`/api/survey/${surveyId}/taxonomies/${taxonomy.id}/upload`, formData, config)

  dispatch(showAppJobMonitor(data.job, () => {
    //import complete
    dispatch(reloadTaxa(taxonomy))
    //mark survey draft
    dispatchTaxonomyUpdate(dispatch, taxonomy)
  }))
}

// ====== DELETE
export const deleteTaxonomy = taxonomy => async (dispatch, getState) => {
  dispatch({type: taxonomyDelete, taxonomy})

  const surveyId = getStateSurveyId(getState())
  await axios.delete(`/api/survey/${surveyId}/taxonomies/${taxonomy.id}`)
}

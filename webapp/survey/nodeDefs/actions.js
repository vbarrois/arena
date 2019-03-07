import axios from 'axios'

import { debounceAction } from '../../appUtils/reduxUtils'

import Survey from '../../../common/survey/survey'
import NodeDef from '../../../common/survey/nodeDef'
import NodeDefValidations from '../../../common/survey/nodeDefValidations'

import * as SurveyState from '../surveyState'

export const nodeDefsLoad = 'nodeDefs/load'
export const nodeDefCreate = 'nodeDef/create'
export const nodeDefUpdate = 'nodeDef/update'
export const nodeDefPropUpdate = 'nodeDef/prop/update'
export const nodeDefDelete = 'nodeDef/delete'

// ==== CREATE

export const createNodeDef = (parentUuid, type, props) => async (dispatch, getState) => {
  const surveyId = SurveyState.getStateSurveyId(getState())
  const nodeDef = NodeDef.newNodeDef(surveyId, parentUuid, type, props)

  dispatch({ type: nodeDefCreate, nodeDef })

  const { data } = await axios.post(`/api/survey/${surveyId}/nodeDef`, nodeDef)
  dispatch({ type: nodeDefUpdate, ...data })
}

// ==== UPDATE
export const putNodeDefProp = (nodeDef, key, value = null, advanced = false) => async (dispatch, getState) => {
  const survey = SurveyState.getSurvey(getState())
  const parentNodeDef = Survey.getNodeDefParent(nodeDef)(survey)

  dispatch({ type: nodeDefPropUpdate, nodeDef, parentNodeDef, nodeDefUuid: nodeDef.uuid, key, value, advanced })

  dispatch(_putNodeDefProp(nodeDef, key, value, advanced))
}

// ==== DELETE
export const removeNodeDef = (nodeDef) => async (dispatch, getState) => {
  dispatch({ type: nodeDefDelete, nodeDef })

  const surveyId = SurveyState.getStateSurveyId(getState())

  const { data } = await axios.delete(`/api/survey/${surveyId}/nodeDef/${nodeDef.uuid}`)

  dispatch({ type: nodeDefsLoad, nodeDefs: data.nodeDefs })
}

const _putNodeDefProp = (nodeDef, key, value, advanced) => {
  const action = async (dispatch, getState) => {
    const surveyId = SurveyState.getStateSurveyId(getState())

    const putProps = async (nodeDef, props) => {
      const { data } = await axios.put(
        `/api/survey/${surveyId}/nodeDef/${nodeDef.uuid}/props`,
        props
      )
      return data.nodeDefs
    }

    const propsToUpdate = [{ key, value, advanced }]

    if (key === 'multiple') {
      const validations = value
        ? NodeDefValidations.dissocRequired(NodeDef.getValidations(nodeDef))
        : NodeDefValidations.dissocCount(NodeDef.getValidations(nodeDef))

      propsToUpdate.push({ key: 'validations', value: validations, advanced: true })
    }

    const nodeDefs = await putProps(nodeDef, propsToUpdate)

    dispatch({ type: nodeDefsLoad, nodeDefs })
  }

  return debounceAction(action, `${nodeDefPropUpdate}_${key}`)
}


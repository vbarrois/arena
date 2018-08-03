import axios from 'axios'

import { newNodeDef } from '../../common/survey/nodeDef'
import { getCurrentSurveyId } from './surveyState'

/**
 * ==== NODE DEFS
 */
export const nodeDefUpdate = 'nodeDef/update'
export const nodeDefsUpdate = 'nodeDefs/update'
export const nodeDefPropUpdate = 'nodeDef/prop/update'

// ==== CREATE

export const createNodeDef = (parentId, type, props) => async (dispatch, getState) => {
  try {
    const surveyId = getCurrentSurveyId(getState())
    const nodeDef = newNodeDef(surveyId, parentId, type, props)
    dispatch({type: nodeDefUpdate, nodeDef})
    //setting current editing nodeDef
    dispatch(setFormNodDefEdit(nodeDef))

    const {data} = await axios.post(`/api/nodeDef`, nodeDef)
    dispatch({type: nodeDefUpdate, ...data})
  } catch (e) { }
}

// export const createAttributeDef = (parentId, props) => async dispatch =>
//   dispatch(createNodeDef(parentId, nodeDefType.attribute, props))
//
// export const createEntityDef = (parentId, props) => async dispatch =>
//   dispatch(createNodeDef(parentId, nodeDefType.entity, props))

// ==== READ

export const fetchNodeDefChildren = (id, draft = false) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/nodeDef/${id}/children?draft=${draft}`)
    dispatch({type: nodeDefsUpdate, ...data})
  } catch (e) { }
}

// ==== UPDATE
export const putNodeDefProp = (nodeDef, key, value) => async dispatch => {
  dispatch({type: nodeDefPropUpdate, nodeDefUUID: nodeDef.uuid, key, value})
  try {
    await axios.put(`/api/nodeDef/${nodeDef.id}/prop`, {key, value})
  } catch (e) { }
}

/**
 * ==== SURVEY-FORM EDIT MODE - NODE DEFS
 */
export const formNodeDefEditUpdate = 'survey/form/nodeDefEdit/update'

export const setFormNodDefEdit = nodeDef => dispatch => dispatch({type: formNodeDefEditUpdate, nodeDef})

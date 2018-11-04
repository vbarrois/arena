import axios from 'axios'

import { getStateSurveyId } from '../surveyState'

export const codeListsUpdate = 'survey/codeLists/update'

// code list
export const codeListCreate = 'survey/codeList/create'
export const codeListUpdate = 'survey/codeList/update'
export const codeListPropUpdate = 'survey/codeList/prop/update'
export const codeListDelete = 'survey/codeList/delete'

// code list level
export const codeListLevelPropUpdate = 'survey/codeList/level/prop/update'
export const codeListLevelDelete = 'survey/codeList/level/delete'

// code list items
export const codeListItemsUpdate = 'survey/codeList/level/items/update'
export const codeListItemCreate = 'survey/codeList/level/item/create'
export const codeListItemUpdate = 'survey/codeList/level/item/update'
export const codeListItemPropUpdate = 'survey/codeList/level/item/prop/update'
export const codeListItemDelete = 'survey/codeList/level/item/delete'

// ==== READ

export const fetchCodeLists = (draft = false, validate = false) => async (dispatch, getState) => {
  const surveyId = getStateSurveyId(getState())
  const {data} = await axios.get(`/api/survey/${surveyId}/codeLists?draft=${draft}&validate=${validate}`)

  dispatch({type: codeListsUpdate, codeLists: data.codeLists})
}

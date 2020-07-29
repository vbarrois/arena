import { exportReducer } from '@webapp/utils/reduxUtils'

import { SystemActions } from '@webapp/store/system'

import { SurveyActions } from '@webapp/store/survey'
import { formReset } from '../../../loggedin/surveyViews/surveyForm/actions'

import * as RecordActions from './actions'
import * as RecordState from '../../../loggedin/surveyViews/record/recordState'

const actionHandlers = {
  // Reset form
  [SystemActions.SYSTEM_RESET]: () => ({}),

  [SurveyActions.surveyCreate]: () => ({}),
  [SurveyActions.surveyUpdate]: () => ({}),
  [SurveyActions.surveyDelete]: () => ({}),
  [formReset]: () => ({}),

  // Record updates
  [RecordActions.recordCreate]: (state, { record }) => RecordState.assocRecord(record)(state),
  [RecordActions.recordLoad]: (state, { record }) => RecordState.assocRecord(record)(state),
  [RecordActions.recordDelete]: (state) => RecordState.assocRecord(null)(state),

  // Node updates
  [RecordActions.nodesUpdate]: (state, { nodes }) => RecordState.mergeRecordNodes(nodes)(state),
  [RecordActions.nodeDelete]: (state, { node }) => RecordState.deleteRecordNode(node)(state),

  // Validation updates
  [RecordActions.validationsUpdate]: (state, { validations }) =>
    RecordState.mergeRecordNodeValidations(validations)(state),

  // Record preview
  [RecordActions.recordUuidPreviewUpdate]: (state, { recordUuid }) =>
    RecordState.assocRecordUuidPreview(recordUuid)(state),
}

export default exportReducer(actionHandlers)

import './processingChainView.scss'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import * as R from 'ramda'

import * as Survey from '@core/survey/survey'
import * as Validation from '@core/validation/validation'
import * as ProcessingChain from '@common/analysis/processingChain'

import { analysisModules, appModuleUri } from '@webapp/app/appModules'

import { useOnUpdate, useAsyncGetRequest, useI18n } from '@webapp/commonComponents/hooks'
import LabelsEditor from '@webapp/loggedin/surveyViews/labelsEditor/labelsEditor'
import CyclesSelect from '@webapp/loggedin/surveyViews/cyclesSelect/cyclesSelect'
import ProcessingChainSteps from '@webapp/loggedin/modules/analysis/processingChain/components/processingChainSteps'
import ProcessingChainButtonBar from '@webapp/loggedin/modules/analysis/processingChain/components/processingChainButtonBar'

import * as SurveyState from '@webapp/survey/surveyState'
import * as ProcessingChainState from '@webapp/loggedin/modules/analysis/processingChain/processingChainState'
import * as ProcessingStepState from '@webapp/loggedin/modules/analysis/processingStep/processingStepState'

import {
  navigateToProcessingChainsView,
  updateProcessingChainProp,
  updateProcessingChainCycles,
  validateProcessingChain,
  resetProcessingChainState,
} from './actions'
import { fetchProcessingChain } from '@webapp/loggedin/modules/analysis/processingChain/actions'

const ProcessingChainView = props => {
  const {
    surveyInfo,
    surveyCycleKey,
    processingChain,
    editingStep,
    history,
    fetchProcessingChain,
    navigateToProcessingChainsView,
    updateProcessingChainProp,
    updateProcessingChainCycles,
    validateProcessingChain,
    resetProcessingChainState,
  } = props

  const { processingChainUuid } = useParams()

  const i18n = useI18n()

  const { dispatch: generateScript } = useAsyncGetRequest(
    `/api/survey/${Survey.getIdSurveyInfo(surveyInfo)}/processing-chain/${processingChainUuid}/script`,
    { params: { surveyCycleKey } },
  )

  useEffect(() => {
    if (R.isEmpty(processingChain)) {
      fetchProcessingChain(processingChainUuid)
    }

    return () => {
      // Reset state on unmount (Only if not navigating to node def edit from calculation editor)
      if (
        R.pipe(R.path(['location', 'pathname']), R.startsWith(appModuleUri(analysisModules.nodeDef)), R.not)(history)
      ) {
        resetProcessingChainState()
      }
    }
  }, [])

  useOnUpdate(() => {
    navigateToProcessingChainsView(history)
  }, [surveyCycleKey])

  useOnUpdate(() => {
    if (!editingStep) {
      // Validate chain on step editor close
      validateProcessingChain()
    }
  }, [editingStep])

  const validation = ProcessingChain.getItemValidationByUuid(ProcessingChain.getUuid(processingChain))(processingChain)

  return R.isEmpty(processingChain) ? null : (
    <div className={`processing-chain${editingStep ? ' step-editor-open' : ''}`}>
      <button
        className="btn btn-s"
        style={{ position: 'absolute', right: '0' }}
        onClick={() => {
          ;(async () => {
            await generateScript()
            history.push(appModuleUri(analysisModules.rStudio))
          })()
        }}
      >
        {i18n.t('analysisView.processingChainView.openChain')}
      </button>
      <div className="form">
        <LabelsEditor
          languages={Survey.getLanguages(surveyInfo)}
          labels={ProcessingChain.getLabels(processingChain)}
          formLabelKey="processingChainView.formLabel"
          readOnly={editingStep}
          validation={Validation.getFieldValidation(ProcessingChain.keysProps.labels)(validation)}
          onChange={labels => updateProcessingChainProp(ProcessingChain.keysProps.labels, labels)}
        />

        {!editingStep && (
          <>
            <LabelsEditor
              formLabelKey="common.description"
              languages={Survey.getLanguages(surveyInfo)}
              labels={ProcessingChain.getDescriptions(processingChain)}
              onChange={descriptions => updateProcessingChainProp(ProcessingChain.keysProps.descriptions, descriptions)}
            />
            <CyclesSelect
              cyclesKeysSelected={ProcessingChain.getCycles(processingChain)}
              onChange={cycles => updateProcessingChainCycles(cycles)}
            />
          </>
        )}

        <ProcessingChainSteps
          processingChain={processingChain}
          validation={Validation.getFieldValidation(ProcessingChain.keys.processingSteps)(validation)}
        />
      </div>

      <ProcessingChainButtonBar />
    </div>
  )
}

const mapStateToProps = state => ({
  surveyInfo: SurveyState.getSurveyInfo(state),
  surveyCycleKey: SurveyState.getSurveyCycleKey(state),
  processingChain: ProcessingChainState.getProcessingChain(state),
  editingStep: ProcessingStepState.isEditingStep(state),
})

export default connect(mapStateToProps, {
  fetchProcessingChain,
  navigateToProcessingChainsView,
  updateProcessingChainProp,
  updateProcessingChainCycles,
  validateProcessingChain,
  resetProcessingChainState,
})(ProcessingChainView)

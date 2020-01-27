import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'

import * as ProcessingStep from '@common/analysis/processingStep'
import * as ProcessingStepCalculation from '@common/analysis/processingStepCalculation'

import { useI18n } from '@webapp/commonComponents/hooks'
import ValidationTooltip from '@webapp/commonComponents/validationTooltip'
import { createProcessingStepCalculation } from '../actions'
import ProcessingStepCalculationsListItem from './processingStepCalculationsListItem'

import useProcessingStepCalculationsListState from './useProcessingStepCalculationsListState'

const ProcessingStepCalculationsList = props => {
  const { processingStep, calculationEditorOpened, validation } = props

  const dispatch = useDispatch()

  const placeholderRef = useRef(null)
  const { dragging, onDragStart, onDragEnd, onDragOver } = useProcessingStepCalculationsListState(placeholderRef)

  const calculationSteps = ProcessingStep.getCalculations(processingStep)
  const i18n = useI18n()

  return (
    <div className="form-item">
      {!calculationEditorOpened && (
        <ValidationTooltip validation={validation}>
          <div className="form-label processing-step__calculations-label">
            {i18n.t('processingStepView.calculationSteps')}
            <button className="btn-s btn-transparent" onClick={() => dispatch(createProcessingStepCalculation())}>
              <span className="icon icon-plus icon-14px" />
            </button>
          </div>
        </ValidationTooltip>
      )}

      <div className="processing-step__calculations">
        {calculationSteps.map(calculation => (
          <ProcessingStepCalculationsListItem
            key={ProcessingStepCalculation.getUuid(calculation)}
            calculation={calculation}
            dragging={dragging}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          />
        ))}

        <div className="processing-step__calculation placeholder" ref={placeholderRef}>
          <div className="processing-step__calculation-index" />
          <div className="processing-step__calculation-content" />
        </div>
      </div>
    </div>
  )
}

ProcessingStepCalculationsList.defaultProps = {
  processingStep: null,
  calculationEditorOpened: false,
  validation: null,
}

export default ProcessingStepCalculationsList

import * as R from 'ramda'

import * as StepVariable from '@common/analysis/processingStepVariable'
import * as Calculation from '@common/analysis/processingStepCalculation'

import * as A from '@core/arena'
import * as ObjectUtils from '@core/objectUtils'

export const keys = {
  calculations: 'calculations',
  calculationUuids: 'calculationUuids', // Associated only when processing step is saved
  index: ObjectUtils.keys.index,
  processingChainUuid: 'processingChainUuid',
  props: ObjectUtils.keys.props,
  temporary: ObjectUtils.keys.temporary,
  uuid: ObjectUtils.keys.uuid,
}

export const keysProps = {
  entityUuid: 'entityUuid', // OR
  categoryUuid: 'categoryUuid', // OR
  virtual: 'virtual', // True|false
  variablesPreviousStep: 'variablesPreviousStep', // Array of calculation variables of previous step (sorted by calculations)
}

// ====== READ

export const getProcessingChainUuid = R.prop(keys.processingChainUuid)
export const getCalculations = R.propOr([], keys.calculations)
export const getEntityUuid = ObjectUtils.getProp(keysProps.entityUuid)
export const getCategoryUuid = ObjectUtils.getProp(keysProps.categoryUuid)
export const isVirtual = ObjectUtils.getProp(keysProps.virtual, false)
export const getVariablesPreviousStep = ObjectUtils.getProp(keysProps.variablesPreviousStep, [])
export const hasVariablePreviousStep = (variableUuid) =>
  R.pipe(
    getVariablesPreviousStep,
    R.find((variable) => StepVariable.getUuid(variable) === variableUuid),
    Boolean
  )
export const { getIndex, getUuid, getProps, getPropsDiff } = ObjectUtils
/**
 * Returns the uuids of all associated calculations.
 * Note: calculationUuids has a value only when calculation step is passed as parameter to the API.
 */
export const getCalculationUuids = R.propOr([], keys.calculationUuids)

export const { isEqual, isTemporary } = ObjectUtils

// ====== UPDATE

export const { dissocTemporary, mergeProps } = ObjectUtils

export const assocCalculationUuids = R.assoc(keys.calculationUuids)
export const assocCalculations = R.assoc(keys.calculations)

export const assocCalculation = (calculation) =>
  R.assocPath([keys.calculations, Calculation.getIndex(calculation)], calculation)

const _updateCalculations = (fn) => (processingStep) =>
  R.pipe(getCalculations, fn, (calculations) => assocCalculations(calculations)(processingStep))(processingStep)

export const dissocCalculations = R.dissoc(keys.calculations)

export const dissocCalculation = (calculation) =>
  _updateCalculations(
    R.pipe(
      // Remove calculation
      R.reject(Calculation.isEqual(calculation)),
      // Update indexes of next calculations
      R.map(
        R.when(
          (calc) => Calculation.getIndex(calc) > Calculation.getIndex(calculation),
          (calc) => Calculation.assocIndex(Calculation.getIndex(calc) - 1)(calc)
        )
      )
    )
  )

export const assocVariablesPreviousStep = (variablesPreviousStep) =>
  ObjectUtils.setProp(keysProps.variablesPreviousStep, variablesPreviousStep)

export const initializeVariablesPreviousStep = ({ previousStep }) => (step) => {
  if (previousStep && A.isEmpty(getVariablesPreviousStep(step))) {
    const variablesPreviousStep = getCalculations(previousStep).map((calculation) =>
      StepVariable.newProcessingStepVariable({ uuid: Calculation.getNodeDefUuid(calculation) })
    )
    return assocVariablesPreviousStep(variablesPreviousStep)(step)
  }
  return step
}

export const assocVariablePreviousStep = (variable) => (step) => {
  const variablesPrevStep = getVariablesPreviousStep(step)
  let index = variablesPrevStep.findIndex(StepVariable.isEqual(variable))
  if (index < 0) {
    // new variable
    index = variablesPrevStep.length
  }
  return R.assocPath([keys.props, keysProps.variablesPreviousStep, index], variable)(step)
}

export const dissocVariablePreviousStepByUuid = (variableUuid) => (step) => {
  const variables = getVariablesPreviousStep(step)
  const variableIndex = variables.findIndex((variable) => StepVariable.getUuid(variable) === variableUuid)
  const variablesUpdated = [...variables]
  variablesUpdated.splice(variableIndex, 1)
  return variableIndex >= 0 ? assocVariablesPreviousStep(variablesUpdated)(step) : step
}

// ===== UTILS

export const hasEntity = R.pipe(getEntityUuid, R.isNil, R.not)
export const hasCategory = R.pipe(getCategoryUuid, R.isNil, R.not)

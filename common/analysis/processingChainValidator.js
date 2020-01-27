import * as StringUtils from '@core/stringUtils'
import * as ObjectUtils from '@core/objectUtils'
import * as Validator from '@core/validation/validator'
import * as Validation from '@core/validation/validation'
import * as ValidationResult from '@core/validation/validationResult'

import * as ProcessingChain from '@common/analysis/processingChain'
import * as ProcessingStep from '@common/analysis/processingStep'
import * as ProcessingStepCalculation from '@common/analysis/processingStepCalculation'

const _validateLabelDefaultLanguageRequire = (defaultLang, errorMessageKey) => async (_, item) =>
  StringUtils.isBlank(ObjectUtils.getLabel(defaultLang)(item)) ? ValidationResult.newInstance(errorMessageKey) : null

const _validationsCommonProps = defaultLang => ({
  [`${ObjectUtils.keys.props}.${ObjectUtils.keysProps.labels}`]: [
    _validateLabelDefaultLanguageRequire(defaultLang, Validation.messageKeys.analysis.labelDefaultLangRequired),
  ],
})

/**
 * Validates a processing chain.
 * The processing chain must have processing steps pre-loaded.
 */
export const validateChain = async (chain, defaultLang) =>
  await Validator.validate(chain, {
    ..._validationsCommonProps(defaultLang),
    [ProcessingChain.keys.processingSteps]: [
      Validator.validateRequired(Validation.messageKeys.analysis.processingChain.stepsRequired),
    ],
  })

export const validateStep = async step =>
  await Validator.validate(step, {
    [`${ProcessingStep.keys.props}.${ProcessingStep.keysProps.entityUuid}`]: [
      Validator.validateRequired(Validation.messageKeys.analysis.processingStep.entityRequired),
    ],
    [ProcessingStep.keys.calculations]: [
      Validator.validateRequired(Validation.messageKeys.analysis.processingStep.calculationsRequired),
    ],
  })

export const validateCalculation = async (calculation, defaultLang) =>
  await Validator.validate(calculation, {
    ..._validationsCommonProps(defaultLang),
    [ProcessingStepCalculation.keys.nodeDefUuid]: [
      Validator.validateRequired(Validation.messageKeys.analysis.processingStepCalculation.attributeRequired),
    ],
    [`${ProcessingStepCalculation.keys.props}.${ProcessingStepCalculation.keysProps.type}`]: [
      Validator.validateRequired(Validation.messageKeys.analysis.processingStepCalculation.typeRequired),
    ],
  })

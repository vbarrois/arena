const R = require('ramda')

const Validator = require('../../validation/validator')

const Survey = require('../survey')
const NodeDef = require('../nodeDef')
const NodeDefLayout = require('../nodeDefLayout')

const NodeDefExpressionsValidator = require('./nodeDefExpressionsValidator')
const NodeDefValidationsValidator = require('./nodeDefValidationsValidator')

const { keys, propKeys } = NodeDef

const keysValidationFields = {
  children: 'children',
  keyAttributes: 'keyAttributes',
}

const validateCategory = async (propName, nodeDef) =>
  NodeDef.getType(nodeDef) === NodeDef.nodeDefType.code
    ? Validator.validateRequired(Validator.messageKeys.nodeDefEdit.categoryRequired)(propName, nodeDef)
    : null

const validateTaxonomy = async (propName, nodeDef) =>
  NodeDef.getType(nodeDef) === NodeDef.nodeDefType.taxon
    ? Validator.validateRequired(Validator.messageKeys.nodeDefEdit.taxonomyRequired)(propName, nodeDef)
    : null

const validateChildren = survey =>
  (propName, nodeDef) => {
    if (NodeDef.isEntity(nodeDef)) {
      const children = Survey.getNodeDefChildren(nodeDef)(survey)
      if (R.isEmpty(children)) {
        return { key: Validator.messageKeys.nodeDefEdit.childrenEmpty }
      }
    }
    return null
  }

const countKeyAttributes = (survey, nodeDefEntity) => R.pipe(
  Survey.getNodeDefChildren(nodeDefEntity),
  R.filter(NodeDef.isKey),
  R.length
)(survey)

const validateKeyAttributes = survey =>
  (propName, nodeDef) => {
    if (NodeDef.isEntity(nodeDef)) {
      const keyAttributesCount = countKeyAttributes(survey, nodeDef)

      if (keyAttributesCount === 0 &&
        (
          NodeDef.isRoot(nodeDef) ||
          (NodeDefLayout.isRenderForm(nodeDef) && NodeDef.isMultiple(nodeDef))
        )
      ) {
        return { key: Validator.messageKeys.nodeDefEdit.keysEmpty }
      } else if (keyAttributesCount > NodeDef.maxKeyAttributes) {
        return { key: Validator.messageKeys.nodeDefEdit.keysExceedingMax }
      }
    }
    return null
  }

const validateKey = survey =>
  (propName, nodeDef) => {
    if (!NodeDef.isEntity(nodeDef) && NodeDef.isKey(nodeDef)) {
      const keyAttributesCount = countKeyAttributes(survey, nodeDef)

      if (keyAttributesCount > NodeDef.maxKeyAttributes) {
        return { key: Validator.messageKeys.nodeDefEdit.keysExceedingMax }
      }
    }
    return null
  }

const validateReadOnly = (propName, nodeDef) =>
  NodeDef.isReadOnly(nodeDef) && R.isEmpty(NodeDef.getDefaultValues(nodeDef))
    ? { key: Validator.messageKeys.nodeDefEdit.defaultValuesNotSpecified }
    : null

const propsValidations = survey => ({
  [`${keys.props}.${propKeys.name}`]: [
    Validator.validateRequired(Validator.messageKeys.nameRequired),
    Validator.validateNotKeyword(Validator.messageKeys.nameCannotBeKeyword),
    Validator.validateName(Validator.messageKeys.nodeDefEdit.nameInvalid),
    Validator.validateItemPropUniqueness(Validator.messageKeys.nameDuplicate)(Survey.getNodeDefsArray(survey))
  ],
  [`${keys.props}.${propKeys.categoryUuid}`]: [validateCategory],
  [`${keys.props}.${propKeys.taxonomyUuid}`]: [validateTaxonomy],
  [`${keys.props}.${propKeys.key}`]: [validateKey(survey)],
  [`${keys.props}.${propKeys.readOnly}`]: [validateReadOnly],
  [keysValidationFields.keyAttributes]: [validateKeyAttributes(survey)],
  [keysValidationFields.children]: [validateChildren(survey)],
})

const validateAdvancedProps = async (survey, nodeDef) => {
  const validations = await Promise.all([
    NodeDefExpressionsValidator.validate(survey, nodeDef, NodeDef.getDefaultValues(nodeDef), false, Validator.messageKeys.nodeDefEdit.defaultValuesInvalid),
    NodeDefExpressionsValidator.validate(survey, Survey.getNodeDefParent(nodeDef)(survey), NodeDef.getApplicable(nodeDef), false, Validator.messageKeys.nodeDefEdit.applyIfInvalid),
    NodeDefValidationsValidator.validate(survey, nodeDef, NodeDef.getValidations(nodeDef), Validator.messageKeys.nodeDefEdit.validationsInvalid)
  ])

  return {
    [Validator.keys.valid]: R.all(Validator.isValidationValid, validations),
    [Validator.keys.fields]: {
      [NodeDef.propKeys.defaultValues]: validations[0],
      [NodeDef.propKeys.applicable]: validations[1],
      [NodeDef.propKeys.validations]: validations[2]
    }
  }
}

const validateNodeDef = async (survey, nodeDef) => {
  const nodeDefValidation = await Validator.validate(nodeDef, propsValidations(survey))

  const advancedPropsValidation = await validateAdvancedProps(survey, nodeDef)

  const validation = R.pipe(
    R.mergeDeepLeft(advancedPropsValidation),
    R.assoc(Validator.keys.valid, Validator.isValidationValid(nodeDefValidation) && Validator.isValidationValid(advancedPropsValidation))
  )(nodeDefValidation)

  return Validator.isValidationValid(validation) ? null : validation
}

const validateNodeDefs = async survey => {
  const nodeDefs = Survey.getNodeDefs(survey)
  const validation = Validator.newValidationValid()

  for (const nodeDefUuid of Object.keys(nodeDefs)) {
    const nodeDef = Survey.getNodeDefByUuid(nodeDefUuid)(survey)
    const nodeDefValidation = await validateNodeDef(survey, nodeDef)

    if (!Validator.isValidationValid(nodeDefValidation)) {
      validation[Validator.keys.fields][nodeDefUuid] = nodeDefValidation
      validation[Validator.keys.valid] = false
    }
  }

  return validation
}

module.exports = {
  validateNodeDefs,
}


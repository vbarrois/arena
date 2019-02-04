const R = require('ramda')

const Survey = require('../../../../common/survey/survey')
const NodeDef = require('../../../../common/survey/nodeDef')
const Record = require('../../../../common/record/record')
const RecordValidation = require('../../../../common/record/recordValidation')
const Node = require('../../../../common/record/node')
const Validator = require('../../../../common/validation/validator')

const NodeRepository = require('../../nodeRepository')

const SurveyRdbManager = require('../../../surveyRdb/surveyRdbManager')

const errorKeys = {
  duplicateRecordKey: 'duplicateRecordKey',
  duplicateEntity: 'duplicateEntity'
}

const validateEntityKeysUniqueness = async (survey, recordUuid, nodeEntity, tx) => {

  // 1. find all sibling entities

  const siblingEntities = await NodeRepository.fetchChildNodesByNodeDefUuid(Survey.getId(survey), recordUuid,
    Node.getParentUuid(nodeEntity), Node.getNodeDefUuid(nodeEntity), tx)

  // 2. validate all sibling entities uniqueness

  const entityValidations = await Promise.all(
    siblingEntities.map(
      async siblingEntity => {
        const isDuplicate = await isDuplicateEntity(survey, recordUuid, siblingEntities, siblingEntity, tx)

        // 3. return entityKeys validation for each sibling entity key attribute
        const keyNodes = await fetchEntityKeyNodes(survey, recordUuid, siblingEntity, tx)
        return keyNodes.map(
          keyNode => ({
            [Node.getUuid(keyNode)]: {
              [Validator.keys.fields]: {
                [RecordValidation.keys.entityKeys]: {
                  [Validator.keys.errors]: isDuplicate ? [errorKeys.duplicateEntity] : [],
                  [Validator.keys.valid]: !isDuplicate
                }
              }
            }
          })
        )
      }
    )
  )
  return R.pipe(
    R.flatten,
    R.mergeAll
  )(entityValidations)
}

const isDuplicateEntity = async (survey, recordUuid, siblingEntitiesAndSelf, entity, tx) => {
  const entityUuid = Node.getUuid(entity)

  // 1. skip current entity among all entities

  const siblingEntities = R.reject(R.propEq(Node.keys.uuid, entityUuid), siblingEntitiesAndSelf)

  // 2. fetch key values

  const keyValues = await fetchKeyValues(survey, recordUuid, entity, tx)

  // 3. find duplicate sibling entity with same key values

  for (const siblingEntity of siblingEntities) {
    const siblingKeyValues = await fetchKeyValues(survey, recordUuid, siblingEntity, tx)
    if (R.equals(keyValues, siblingKeyValues)) {
      return true
    }
  }
  return false
}

const validateRecordKeysUniqueness = async (survey, recordUuid, tx) => {

  // 1. fetch records with same keys
  const records = await SurveyRdbManager.queryRootTableByRecordKeys(survey, recordUuid, tx)

  // 2. check if record is unique
  const isUnique = R.pipe(
    // exclude current record
    R.reject(R.propEq(Record.keys.uuid, recordUuid)),
    R.isEmpty
  )(records)

  // 3. fetch key nodes
  const surveyId = Survey.getId(survey)

  const rootDef = Survey.getRootNodeDef(survey)
  const rootNode = await NodeRepository.fetchChildNodeByNodeDefUuid(surveyId, recordUuid, null, NodeDef.getUuid(rootDef), tx)

  const keyNodes = await fetchEntityKeyNodes(survey, recordUuid, rootNode, tx)

  // 4. associate validation error to each key node
  return R.pipe(
    R.map(keyNode => ({
        [Node.getUuid(keyNode)]: {
          [Validator.keys.fields]: {
            [RecordValidation.keys.recordKeys]: {
              [Validator.keys.errors]: isUnique ? [] : [errorKeys.duplicateRecordKey],
              [Validator.keys.valid]: isUnique
            }
          }
        }
      })
    ),
    R.flatten,
    R.mergeAll
  )(keyNodes)
}

// ==== UTILS

const fetchKeyValues = async (survey, recordUuid, entity, tx) => {
  const keyNodes = await fetchEntityKeyNodes(survey, recordUuid, entity, tx)
  return R.map(Node.getNodeValue)(keyNodes)
}

const fetchEntityKeyNodes = async (survey, recordUuid, entity, tx) => {
  const entityDef = Survey.getNodeDefByUuid(Node.getNodeDefUuid(entity))(survey)
  const keyDefs = Survey.getNodeDefKeys(entityDef)(survey)
  const keyDefUuids = R.map(NodeDef.getUuid, keyDefs)
  return await NodeRepository.fetchChildNodesByNodeDefUuids(Survey.getId(survey), recordUuid, Node.getUuid(entity), keyDefUuids, tx)
}

module.exports = {
  validateRecordKeysUniqueness,
  validateEntityKeysUniqueness
}
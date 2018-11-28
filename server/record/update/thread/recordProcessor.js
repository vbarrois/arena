const R = require('ramda')
const Promise = require('bluebird')

const db = require('../../../db/db')

const Survey = require('../../../../common/survey/survey')
const NodeDef = require('../../../../common/survey/nodeDef')
const Record = require('../../../../common/record/record')
const Node = require('../../../../common/record/node')

const SurveyRepository = require('../../../survey/surveyRepository')
const NodeDefRepository = require('../../../nodeDef/nodeDefRepository')

const RecordRepository = require('../../../record/recordRepository')
const NodeRepository = require('../../../record/nodeRepository')

const persistNode = async (surveyId, nodeReq, file, client = db) => {
  const {nodeDefId, value, uuid} = nodeReq

  const node = await NodeRepository.fetchNodeByUUID(surveyId, uuid, client)

  return node
    ? await updateNodeValue(surveyId, uuid, value, file, client)
    : await createNode(await NodeDefRepository.fetchNodeDef(nodeDefId), nodeReq, file, client)
}

/**
 * Create a new node, and recursively creates inner nodes
 *
 * @param nodeDef
 * @param nodeToInsert
 * @param file
 * @param client
 * @returns {Promise<void>}
 */
const createNode = async (nodeDef, nodeToInsert, file, client = db) => {

  // insert node
  const node = await NodeRepository.insertNode(nodeDef.surveyId, nodeToInsert, file ? file.data : null, client)

  // add children if entity
  const childDefs = NodeDef.isNodeDefEntity(nodeDef)
    ? await NodeDefRepository.fetchNodeDefsByParentId(nodeDef.id)
    : []

  // insert only child single entities
  const childNodes = R.mergeAll(
    await Promise.all(
      childDefs
        .filter(NodeDef.isNodeDefSingleEntity)
        .map(
          async childDef => await createNode(childDef, Node.newNode(childDef.id, node.recordId, node.uuid), null, client)
        )
    )
  )

  return R.merge({[node.uuid]: node}, childNodes)
}

/**
 * Update a node value
 *
 * @param surveyId
 * @param nodeUUID
 * @param value
 * @param file
 * @param client
 * @returns {Promise<*|Promise<*>>}
 */
const updateNodeValue = async (surveyId, nodeUUID, value, file, client = db) =>
  await client.tx(async t => {
    const node = await NodeRepository.updateNode(surveyId, nodeUUID, value, file ? file.data : null, client)

    return await processNodeUpdate(surveyId, node, t)
  })

/**
 * Delete a node
 *
 * @param surveyId
 * @param nodeUUID
 * @param client
 * @returns {Promise<*|Promise<*>>}
 */
const deleteNode = async (surveyId, nodeUUID, client = db) =>
  await client.tx(async t => {
    const node = await NodeRepository.deleteNode(surveyId, nodeUUID, t)
    node.deleted = true

    return await processNodeUpdate(surveyId, node, t)
  })

const processNodeUpdate = async (surveyId, node, tx) => {
  const survey = Survey.assocNodeDefs(
    await NodeDefRepository.fetchNodeDefsBySurveyId(surveyId, false, true, tx)
  )(await SurveyRepository.getSurveyById(surveyId, false, tx))

  const recordId = Node.getNodeRecordId(node)

  const record = Record.assocNodes(
    await NodeRepository.fetchNodesByRecordId(surveyId, recordId, tx)
  )(await RecordRepository.fetchRecordById(surveyId, recordId, tx))

  return onNodeUpdate(survey, record, node, tx)
}

/**
 * Delete node internal:
 * @param survey
 * @param record
 * @param nodeUUID
 * @param client
 * @returns {Promise<*>}
 */
const deleteNodeInternal = async (survey, record, nodeUUID, client = db) => {
  const node = await NodeRepository.deleteNode(survey.id, nodeUUID, client)
  node.deleted = true
  return onNodeUpdate(survey, record, node, client)
}

const onNodeUpdate = async (survey, record, node, client = db) => {
  //delete dependent code nodes
  const dependentCodeAttributes = Record.getNodeCodeDependentAttributes(survey, node)(record)

  const clearedDependentCodeAttributes = await Promise.all(
    dependentCodeAttributes.map(async n => {
      const nDef = Survey.getNodeDefById(Node.getNodeDefId(n))(survey)
      if (NodeDef.isNodeDefMultiple(nDef)) {
        //delete node
        return await deleteNodeInternal(survey, record, n.uuid, client)
      } else {
        //reset value
        return await resetNodeValue(survey, record, n.uuid, client)
      }
    })
  )

  return R.merge({[node.uuid]: node}, R.mergeAll(clearedDependentCodeAttributes))
}

const resetNodeValue = async (survey, record, nodeUUID, client = db) => {
  const node = await NodeRepository.updateNode(survey.id, nodeUUID, null, null, client)
  return onNodeUpdate(survey, record, node, client)
}

module.exports = {
  persistNode,
  deleteNode,
}
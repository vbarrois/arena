const camelize = require('camelize')
const db = require('../db/db')

const {surveyDataSchema} = require('../../common/survey/survey')

const dbTransformCallback = r =>
  r ? camelize(r)
    : null

// ============== CREATE

const insertNode = async (surveyId, node, client = db) => {
  const {id: nodeId} = await client.one(`
    INSERT INTO ${surveyDataSchema(surveyId)}.node (record_id, parent_id, node_def_id, value)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `, [node.recordId, node.parentId, node.nodeDefId, node.value])

  return fetchNodeById(surveyId, nodeId, client)
}

// ============== READ

const fetchNodes = async (surveyId, recordId, client = db) =>
  await client.map(
    `SELECT * FROM ${surveyDataSchema(surveyId)}.node WHERE record_id = $1 
     ORDER BY parent_id, id`,
    [recordId],
    r => dbTransformCallback(r)
  )

const fetchNodeById = async (surveyId, nodeId, client = db) =>
  await client.one(
    `SELECT * FROM ${surveyDataSchema(surveyId)}.node WHERE id = $1`,
    [nodeId],
    r => dbTransformCallback(r)
  )

// ============== UPDATE
const updateNode = async (surveyId, nodeId, value, client = db) =>
  await client.one(`
      UPDATE ${surveyDataSchema(surveyId)}.node 
      SET value = $1 
      WHERE id = $2
      RETURNING *
    `, [value, nodeId],
    r => dbTransformCallback(r)
  )

module.exports = {
  insertNode,
  fetchNodeById,
  fetchNodes,
  updateNode,
}
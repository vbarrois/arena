const db = require('../db/db')
const Survey = require('../../common/survey/survey')
const Node = require('../../common/record/node')

const SurveyManager = require('../survey/surveyManager')
const NodeDefManager = require('../nodeDef/nodeDefManager')

const DataSchema = require('./schemaRdb/dataSchema')
const NodesInsert = require('./nodesInsert')
const NodesUpdate = require('./nodesUpdate')
const TableViewCreate = require('./tableViewCreate')

// ==== DDL

const dropSchema = async surveyId =>
  await db.query(`DROP SCHEMA IF EXISTS ${DataSchema.getName(surveyId)} CASCADE`)

const createSchema = async surveyId =>
  await db.query(`CREATE SCHEMA ${DataSchema.getName(surveyId)}`)

const createTable = async (survey, nodeDef) =>
  await TableViewCreate.run(survey, nodeDef, db)

// ==== DML

const insertIntoTable = async (survey, nodeDef, record, client = db) =>
  await NodesInsert.run(survey, nodeDef, record, client)

const updateTableNodes = async (surveyId, nodes, client = db) => {
  const survey = await SurveyManager.fetchSurveyById(surveyId)
  const nodeDefs = await NodeDefManager.fetchNodeDefsByUuid(surveyId, Node.getNodeDefUuids(nodes))
  await NodesUpdate.run(Survey.getSurveyInfo(survey), nodes, nodeDefs, client)
}

module.exports = {
  dropSchema,
  createSchema,

  createTable,
  insertIntoTable,

  updateTableNodes,
}
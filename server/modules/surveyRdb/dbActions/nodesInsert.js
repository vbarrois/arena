const Promise = require('bluebird')

const { insertAllQuery } = require('../../../db/dbUtils')

const Survey = require('../../../../common/survey/survey')
const NodeDef = require('../../../../common/survey/nodeDef')
const Record = require('../../../../common/record/record')
const SchemaRdb = require('../../../../common/surveyRdb/schemaRdb')

const DataTable = require('../schemaRdb/dataTable')

const getNodesRowValues = async (survey, nodeDef, record, client) => {
  const nodes = Record.getNodesByDefUuid(NodeDef.getUuid(nodeDef))(record)

  return await Promise.all(
    nodes.map(
      node => DataTable.getRowValues(survey, nodeDef, record, node, client)
    )
  )
}

const run = async (survey, nodeDef, record, client) => {
  const insertValues = await getNodesRowValues(survey, nodeDef, record, client)

  if (insertValues.length > 0) {
    const nodeDefParent = Survey.getNodeDefParent(nodeDef)(survey)

    const schema = SchemaRdb.getName(Survey.getId(survey))
    const table = DataTable.getName(nodeDef, nodeDefParent)

    await client.none(insertAllQuery(
      schema,
      table,
      DataTable.getColumnNames(survey, nodeDef),
      insertValues
    ))
  }
}

module.exports = {
  run
}
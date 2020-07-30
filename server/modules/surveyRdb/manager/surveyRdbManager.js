import { ColumnNodeDef, ViewDataNodeDef } from '../../../../common/model/db'

import * as NodeDefTable from '../../../../common/surveyRdb/nodeDefTable'

import * as Survey from '../../../../core/survey/survey'
import * as NodeDef from '../../../../core/survey/nodeDef'

import { db } from '../../../db/db'
import * as CSVWriter from '../../../utils/file/csvWriter'

import * as DataTableInsertRepository from '../repository/dataTableInsertRepository'
import * as DataTableReadRepository from '../repository/dataTableReadRepository'
import * as DataTableRepository from '../repository/dataTable'
import * as DataViewRepository from '../repository/dataView'

// ==== DDL

// schema
export { createSchema, dropSchema } from '../repository/schemaRdbRepository'

// Data tables and views
export const { createDataTable } = DataTableRepository
export const { createDataView, countViewDataAgg, fetchViewDataAgg } = DataViewRepository

// Node key views
export { createNodeKeysView } from '../repository/nodeKeysViewRepository'
export { createNodeHierarchyDisaggregatedView } from '../repository/nodeHierarchyDisaggregatedViewRepository'
export { createNodeKeysHierarchyView } from '../repository/nodeKeysHierarchyViewRepository'

// Result tables and views
export { createResultNodeTable, deleteNodeResultsByChainUuid, MassiveInsertResultNodes } from '../repository/resultNode'
export { createResultStepView, refreshResultStepView } from '../repository/resultStep'

// ==== DML

const _getQueryData = async (survey, nodeDefUuidTable, nodeDefUuidCols = []) => {
  const nodeDefTable = Survey.getNodeDefByUuid(nodeDefUuidTable)(survey)
  return {
    nodeDefTable,
    tableName: NodeDefTable.getViewName(nodeDefTable, Survey.getNodeDefParent(nodeDefTable)(survey)),
    colNames: NodeDefTable.getColNamesByUuids(nodeDefUuidCols)(survey),
  }
}

/**
 * Executes a select query on an entity definition data view.
 *
 * @param {!object} params - The query parameters.
 * @param {!Survey} [params.survey] - The survey.
 * @param {!string} [params.cycle] - The survey cycle.
 * @param {!NodeDef} [params.nodeDef] - The node def associated to the view to select.
 * @param {Array.<NodeDef>} [params.nodeDefCols=[]] - The node defs associated to the selected columns.
 * @param {boolean} [params.columnNodeDefs=false] - Whether to select only columnNodes.
 * @param {number} [params.offset=null] - The query offset.
 * @param {number} [params.limit=null] - The query limit.
 * @param {object} [params.filter=null] - The filter expression object.
 * @param {SortCriteria[]} [params.sort=[]] - The sort conditions.
 * @param {boolean} [params.editMode=false] - Whether to fetch row ready to be edited (fetches nodes and records).
 * @param {boolean} [params.streamOutput=null] - The output to be used to stream the data (if specified).
 *
 * @returns {Promise<any[]>} - An object with fetched rows and selected fields.
 */
export const fetchViewData = async (params) => {
  const {
    survey,
    cycle,
    nodeDef,
    nodeDefCols = [],
    columnNodeDefs = false,
    offset = 0,
    limit = null,
    filter = null,
    sort = [],
    editMode = false,
    streamOutput = null,
  } = params

  // Fetch data
  const result = await DataViewRepository.fetchViewData({
    survey,
    cycle,
    nodeDef,
    nodeDefCols,
    columnNodeDefs,
    offset,
    limit,
    filter,
    sort,
    editMode,
    stream: Boolean(streamOutput),
  })

  if (streamOutput) {
    // Consider only user selected fields (from column node defs)
    const viewDataNodeDef = new ViewDataNodeDef(survey, nodeDef)
    const fields = nodeDefCols.map((nodeDefCol) => new ColumnNodeDef(viewDataNodeDef, nodeDefCol).names).flat()
    await db.stream(result, (stream) => {
      stream.pipe(CSVWriter.transformToStream(streamOutput, fields))
    })
  }
  return result
}

export const countTable = async (survey, cycle, nodeDefUuidTable, filter) => {
  const surveyId = Survey.getId(survey)
  const { tableName } = await _getQueryData(survey, nodeDefUuidTable)
  return DataViewRepository.runCount(surveyId, cycle, tableName, filter)
}

export const { populateTable } = DataTableInsertRepository

export const { fetchRecordsWithDuplicateEntities } = DataTableReadRepository

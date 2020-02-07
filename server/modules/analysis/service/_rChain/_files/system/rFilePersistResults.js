import * as R from 'ramda'

import * as ResultNodeTable from '@common/surveyRdb/resultNodeTable'

import * as Survey from '@core/survey/survey'
import * as NodeDef from '@core/survey/nodeDef'
import * as ProcessingChain from '@common/analysis/processingChain'
import * as ProcessingStep from '@common/analysis/processingStep'
import * as ProcessingStepCalculation from '@common/analysis/processingStepCalculation'

import * as RDBDataTable from '@server/modules/surveyRdb/schemaRdb/dataTable'
import * as RDBDataView from '@server/modules/surveyRdb/schemaRdb/dataView'
import { RFileSystem } from '@server/modules/analysis/service/_rChain/rFile'
import { dbWriteTable, dfVar, setVar } from '@server/modules/analysis/service/_rChain/rFunctions'

const _resultTableColNamesVector = `c(${R.pipe(
  R.values,
  R.map(colName => `'${colName}'`),
)(ResultNodeTable.colNames)})`

export default class RFilePersistResults extends RFileSystem {
  constructor(rChain) {
    super(rChain, 'persist-results')
  }

  async init() {
    await super.init()

    const chain = this.rChain.chain
    const survey = this.rChain.survey
    const chainUuid = ProcessingChain.getUuid(chain)
    const steps = ProcessingChain.getProcessingSteps(chain)

    for (const step of steps) {
      if (ProcessingStep.hasEntity(step)) {
        const dfRes = 'res'
        const entityDef = R.pipe(ProcessingStep.getEntityUuid, entityUuid =>
          Survey.getNodeDefByUuid(entityUuid)(survey),
        )(step)
        const dfSource = NodeDef.getName(entityDef)

        // Build result dataframe
        // Add common part
        await this.appendContent(
          setVar(dfRes, dfSource),
          setVar(dfVar(dfRes, ResultNodeTable.colNames.processingChainUuid), `'${chainUuid}'`),
          setVar(dfVar(dfRes, ResultNodeTable.colNames.processingStepUuid), `'${ProcessingStep.getUuid(step)}'`),
          setVar(dfVar(dfRes, ResultNodeTable.colNames.recordUuid), dfVar(dfSource, RDBDataTable.colNameRecordUuuid)),
          setVar(dfVar(dfRes, ResultNodeTable.colNames.parentUuid), dfVar(dfSource, RDBDataView.getColUuid(entityDef))),
        )

        for (const calculation of ProcessingStep.getCalculations(step)) {
          const calculationNodeDefUuid = ProcessingStepCalculation.getNodeDefUuid(calculation)
          const nodeDefCalculationName = R.pipe(
            nodeDefUuid => Survey.getNodeDefByUuid(nodeDefUuid)(survey),
            NodeDef.getName,
          )(calculationNodeDefUuid)

          await this.appendContent(
            setVar(dfVar(dfRes, ResultNodeTable.colNames.uuid), dfVar(dfSource, `${nodeDefCalculationName}_uuid`)),
            setVar(dfVar(dfRes, ResultNodeTable.colNames.nodeDefUuid), `'${calculationNodeDefUuid}'`),
            setVar(dfVar(dfRes, ResultNodeTable.colNames.value), dfVar(dfSource, nodeDefCalculationName)),
            // Reorder result columns before writing into table
            setVar(dfRes, `${dfRes}[${_resultTableColNamesVector}]`),

            dbWriteTable(ResultNodeTable.tableName, dfRes, true),
          )
        }
      }
    }

    return this
  }
}

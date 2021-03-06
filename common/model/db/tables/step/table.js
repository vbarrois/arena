import Table from '../table'
import TableSurvey from '../tableSurvey'
import { getSelect } from './select'

const columnSet = {
  uuid: Table.columnSetCommon.uuid,
  chainUuid: 'processing_chain_uuid',
  index: 'index',
  props: Table.columnSetCommon.props,
}
/**
 * @typedef {module:arena.TableSurvey} module:arena.TableStep
 */
export default class TableStep extends TableSurvey {
  constructor(surveyId) {
    super(surveyId, 'processing_step', columnSet)
    this.getSelect = getSelect.bind(this)
  }

  get columnChainUuid() {
    return this.getColumn(columnSet.chainUuid)
  }

  get columnIndex() {
    return this.getColumn(columnSet.index)
  }
}

TableStep.columnSet = columnSet

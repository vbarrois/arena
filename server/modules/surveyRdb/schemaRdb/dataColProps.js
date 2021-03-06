import * as R from 'ramda'
import * as camelize from 'camelize'

import * as NumberUtils from '@core/numberUtils'
import * as ObjectUtils from '@core/objectUtils'
import * as Survey from '@core/survey/survey'
import * as NodeDef from '@core/survey/nodeDef'
import * as Taxon from '@core/survey/taxon'
import * as Node from '@core/record/node'

import * as NodeDefTable from '@common/surveyRdb/nodeDefTable'

import * as Point from '@core/geo/point'
import * as GeoUtils from '@core/geo/geoUtils'
import * as DateTimeUtils from '@core/dateUtils'

const { nodeDefType } = NodeDef

const colValueProcessor = 'colValueProcessor'

const getValueFromItem = (nodeDefCol, colName, item = {}, isInProps = false) => {
  // Remove nodeDefName from col name
  const prop = camelize(NodeDefTable.extractColName(nodeDefCol, colName))

  return isInProps ? NodeDef.getProp(prop)(item) : R.propOr(null, prop, item)
}

const nodeValuePropProcessor = (_survey, nodeDefCol) => (node, colName) => {
  const nodeValue = Node.getValue(node)
  return getValueFromItem(nodeDefCol, colName, nodeValue)
}

/**
 * Convert an input value to RDB compatible output value.
 * The contract is such that the value output value must always be compatible with RDB.
 * In case of any errors, return NULL.
 */
const props = {
  [nodeDefType.entity]: {
    [colValueProcessor]: () => () => Node.getUuid,
  },

  [nodeDefType.integer]: {
    [colValueProcessor]: (_survey, _nodeDefCol, nodeCol) => {
      const value = Node.getValue(nodeCol)
      const num = NumberUtils.toNumber(value)
      return () => (Number.isInteger(num) ? num : null)
    },
  },

  [nodeDefType.decimal]: {
    [colValueProcessor]: (_survey, _nodeDefCol, nodeCol) => {
      const value = Node.getValue(nodeCol)
      const num = NumberUtils.toNumber(value)
      return () => (!Number.isNaN(num) && Number.isFinite(num) ? num : null)
    },
  },

  [nodeDefType.date]: {
    [colValueProcessor]: (_survey, _nodeDefCol, nodeCol) => {
      const [year, month, day] = [Node.getDateYear(nodeCol), Node.getDateMonth(nodeCol), Node.getDateDay(nodeCol)]
      return () => (DateTimeUtils.isValidDate(year, month, day) ? `${year}-${month}-${day}` : null)
    },
  },

  [nodeDefType.time]: {
    [colValueProcessor]: (_survey, _nodeDefCol, nodeCol) => {
      const [hour, minute] = [Node.getTimeHour(nodeCol), Node.getTimeMinute(nodeCol)]
      return () => (DateTimeUtils.isValidTime(hour, minute) ? `${hour}:${minute}:00` : null)
    },
  },

  [nodeDefType.code]: {
    [colValueProcessor]: (survey, nodeDefCol, nodeCol) => {
      const surveyInfo = Survey.getSurveyInfo(survey)
      const itemUuid = Node.getCategoryItemUuid(nodeCol)
      const item = itemUuid ? Survey.getCategoryItemByUuid(itemUuid)(survey) : {}

      return (_node, colName) =>
        R.endsWith('code', colName)
          ? getValueFromItem(nodeDefCol, colName, item, true)
          : ObjectUtils.getLabel(Survey.getDefaultLanguage(surveyInfo))(item) // 'label'
    },
  },

  [nodeDefType.taxon]: {
    [colValueProcessor]: (survey, _nodeDefCol, nodeCol) => {
      // Return (node, colName) => null
      const taxonUuid = Node.getTaxonUuid(nodeCol)
      const taxon = taxonUuid ? Survey.getTaxonByUuid(taxonUuid)(survey) : {}

      return (node, colName) =>
        // eslint-disable-next-line no-nested-ternary
        R.endsWith('code', colName)
          ? Taxon.getCode(taxon)
          : Taxon.isUnlistedTaxon(taxon) // Scientific_name
          ? Node.getScientificName(node) // From node value
          : Taxon.getScientificName(taxon) // From taxon item
    },
  },

  [nodeDefType.coordinate]: {
    [colValueProcessor]: (_survey, _nodeDefCol, nodeCol) => {
      const [x, y, srsId] = [Node.getCoordinateX(nodeCol), Node.getCoordinateY(nodeCol), Node.getCoordinateSrs(nodeCol)]

      return () => (GeoUtils.isCoordinateValid(srsId, x, y) ? Point.toString(Point.newPoint({ srsId, x, y })) : null)
    },
  },

  [nodeDefType.file]: {
    [colValueProcessor]: nodeValuePropProcessor,
  },
}

export const getColValueProcessor = (nodeDef) =>
  R.propOr(
    () => (node) => {
      return Node.isValueBlank(node) ? null : Node.getValue(node)
    },
    colValueProcessor,
    props[NodeDef.getType(nodeDef)]
  )

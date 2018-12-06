const R = require('ramda')
const camelize = require('camelize')
const toSnakeCase = require('to-snake-case')

const Survey = require('../../common/survey/survey')
const SurveyUtils = require('../../common/survey/surveyUtils')
const NodeDef = require('../../common/survey/nodeDef')
const Node = require('../../common/record/node')
const CategoryManager = require('../category/categoryManager')
const TaxonomyManager = require('../taxonomy/taxonomyManager')

const {nodeDefType} = NodeDef

const cols = 'cols'
const colValueProcessor = 'colValueProcessor'

const nodeValuePropProcessor = (survey, nodeDefCol, nodeCol) =>
  (node, colName) => {
    const nodeValue = Node.getNodeValue(node)
    //remove nodeDefName from col name
    const colProp = R.pipe(
      R.replace(toSnakeCase(NodeDef.getNodeDefName(nodeDefCol)) + '_', ''),
      camelize,
    )(colName)

    return R.propOr(null, colProp, nodeValue)
  }

const props = {
  [nodeDefType.code]: {
    [cols]: ['code', 'label'],

    [colValueProcessor]: async (survey, nodeDefCol, nodeCol) => {
      const surveyInfo = Survey.getSurveyInfo(survey)
      const nodeDefName = NodeDef.getNodeDefName(nodeDefCol)
      const item = await CategoryManager.fetchItemByUuid(surveyInfo.id, Node.getNodeValue(nodeCol).itemUuid)

      return (node, colName) => colName === nodeDefName + '_' + 'code'
        ? SurveyUtils.getProp('code')(item)
        //'label'
        : SurveyUtils.getLabel(Survey.getDefaultLanguage(surveyInfo))(item)
    }
  },

  [nodeDefType.taxon]: {
    [cols]: ['code', 'scientific_name'],
    //?, 'vernacular_names?'],

    [colValueProcessor]: async (survey, nodeDefCol, nodeCol) => {
      const surveyInfo = Survey.getSurveyInfo(survey)
      const nodeDefName = NodeDef.getNodeDefName(nodeDefCol)
      const items = await TaxonomyManager.fetchTaxaByPropLike(surveyInfo.id, null, {filter: {uuid: Node.getNodeValue(nodeCol).taxonUuid}})
      const item = R.pipe(R.head, R.defaultTo({}))(items)

      return (node, colName) => colName === nodeDefName + '_' + 'code'
        ? SurveyUtils.getProp('code')(item)
        //scientific_name
        : SurveyUtils.getProp('scientificName')(item)
    }

  },

  [nodeDefType.coordinate]: {
    [cols]: ['x', 'y', 'srs'],
    [colValueProcessor]: nodeValuePropProcessor
  },

  [nodeDefType.file]: {
    [cols]: ['file_uuid', 'file_name'],
    [colValueProcessor]: nodeValuePropProcessor
  },

}

const getCols = nodeDef => R.propOr(
  [],
  cols,
  props[NodeDef.getNodeDefType(nodeDef)]
)

const getColValueProcessor = nodeDef => R.propOr(
  () => (node) => Node.getNodeValue(node, null),
  colValueProcessor,
  props[NodeDef.getNodeDefType(nodeDef)]
)

module.exports = {
  getCols,
  getColValueProcessor,
}
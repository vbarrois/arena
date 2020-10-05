import { toLeftOf, into } from 'taiko'
import { dragAndDrop, expectExists, getElement, getElements } from '../api'

const dataAttributes = {
  nodeDefName: 'data-node-def-name',
  childNames: 'data-child-names',
}

const selectors = {
  surveyForm: '.survey-form',
  nodeDefPageItem: '.survey-form__node-def-page-item',
  entityWrapper: ({ entityName }) =>
    `.survey-form__node-def-entity-wrapper${entityName ? `[${dataAttributes.nodeDefName}='${entityName}']` : ''}`,
  resizeHandle: ({ nodeDefName }) =>
    `.survey-form__node-def-entity-form-grid-item[data-node-def-name='${nodeDefName}'] .react-resizable-handle`,
  tableItem: ({ nodeDefName }) => `.survey-form__node-def-table-cell-header[data-node-def-name='${nodeDefName}']`,
}

export const expectSurveyFormLoaded = async () => expectExists({ selector: selectors.surveyForm })

const getNodeDefElementText = async ({ item }) => {
  const itemText = await item.text()
  const text = await itemText.split('\n')[0]
  return text
}

export const expectItemIsTheLastNodeDef = async ({ item }) => {
  const items = await getElements({ selector: selectors.nodeDefPageItem })

  const last = items[items.length - 1]

  const itemText = await getNodeDefElementText({ item: last })
  await expect(itemText).toBe(item.label.toUpperCase())
}

const getSurveyFormEntityWrapper = async ({ entityName = null }) =>
  getElement({ selector: selectors.entityWrapper({ entityName }) })

export const expectSurveyFormItemNames = async ({ entityName = null, itemNames: itemNamesExpected }) => {
  const wrapper = await getSurveyFormEntityWrapper({ entityName })
  const nodeDefNamesOrderedAttribute = await wrapper.attribute(dataAttributes.childNames)
  const nodeDefNamesOrdered = nodeDefNamesOrderedAttribute.split(',')
  await expect(nodeDefNamesOrdered).toStrictEqual(itemNamesExpected)
}

export const expectSurveyFormItems = async ({ entityName = null, items }) =>
  expectSurveyFormItemNames({ entityName, itemNames: items.map((item) => item.name) })

const _checkExists = async ({ element }) => {
  const exists = await element.exists()
  expect(exists).toBeTruthy()
  return exists
}

/**
 * Resizes a survey form item by dragging its resize handle (element with class .react-resizable-handle)
 * The increase in width or height can be zero or negative too.
 *
 * @param {!string} nodeDefName - The name of the node definition of the survey form item.
 * @param {Number} [increaseWidth=0] - Width increase of the item (in pixel).
 * @param {Number} [increaseHeight=0] - Height increase of the item (in pixel).
 * @returns {Promise<null>} - The result promise.
 */
export const resizeSurveyFormItem = async ({ nodeDefName, increaseWidth = 0, increaseHeight = 0 }) => {
  const resizeHandle = await getElement({ selector: selectors.resizeHandle({ nodeDefName }) })
  const exists = await resizeHandle.exists()
  expect(exists).toBeTruthy()
  if (!exists) {
    return
  }
  const distance = {}
  if (increaseHeight > 0) {
    distance.down = increaseHeight
  } else if (increaseHeight < 0) {
    distance.up = Math.abs(increaseHeight)
  }
  if (increaseWidth > 0) {
    distance.right = increaseWidth
  } else if (increaseWidth < 0) {
    distance.left = Math.abs(increaseWidth)
  }
  await dragAndDrop(resizeHandle, distance)
}

export const dragSurveyFormTableItem = async ({ nodeDefName, up = 0, down = 0, left = 0, right = 0 }) => {
  const item = await getElement({ selector: selectors.tableItem({ nodeDefName }) })
  const exists = await item.exists()
  expect(exists).toBeTruthy()
  if (!exists) {
    return
  }
  await dragAndDrop(item, { up, down, left, right })
  //const item2 = await getElement({ selector: selectors.tableItem({ nodeDefName: 'tree_id' }) })
  //await dragAndDrop(item, { left, y: 450 })
}

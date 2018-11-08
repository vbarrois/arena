const {getContextSurvey} = require('./../../testContext')
const {assert, expect} = require('chai')
const R = require('ramda')

const NodeDefRepository = require('../../../server/nodeDef/nodeDefRepository')
const NodeDefTest = require('../../../common/survey/nodeDef')
const Survey = require('../../../common/survey/survey')

const fetchRootNodeDef = async () => {
  const survey = getContextSurvey()
  return await NodeDefRepository.fetchRootNodeDef(Survey.getSurveyInfo(survey).id, true)
}

const createNodeDef = async (parentNodeId, type, name) => {
  const survey = getContextSurvey()
  const surveyInfo = Survey.getSurveyInfo(survey)

  const nodeDefReq = NodeDefTest.newNodeDef(surveyInfo.id, parentNodeId, type, {name})
  return await NodeDefRepository.createNodeDef(surveyInfo.id, parentNodeId, nodeDefReq.uuid, type, nodeDefReq.props)
}

const createNodeDefsTest = async () => {
  const survey = getContextSurvey()
  const surveyInfo = Survey.getSurveyInfo(survey)

  const rootDef = await fetchRootNodeDef()

  const type = NodeDefTest.nodeDefType.text
  const nodeDefReq = NodeDefTest.newNodeDef(surveyInfo.id, rootDef.id, type, {name: 'node_def_' + type})
  const nodeDefDb = await NodeDefRepository.createNodeDef(surveyInfo.id, rootDef.id, nodeDefReq.uuid, type, nodeDefReq.props)

  expect(nodeDefDb.id).to.not.be.undefined
  expect(nodeDefDb.type).to.equal(type)
  expect(nodeDefDb.surveyId).to.equal(surveyInfo.id)
  expect(nodeDefDb.parentId).to.equal(nodeDefReq.parentId)
  expect(nodeDefDb.uuid).to.equal(nodeDefReq.uuid)
  expect(nodeDefDb.props).to.eql(nodeDefReq.props)
}

const updateNodeDefTest = async () => {
  const survey = getContextSurvey()
  const surveyInfo = Survey.getSurveyInfo(survey)

  const rootDef = await fetchRootNodeDef()

  const nodeDef1 = await createNodeDef(rootDef.id, NodeDefTest.nodeDefType.text, 'node_def_1')
  const nodeDef2 = await createNodeDef(rootDef.id, NodeDefTest.nodeDefType.boolean, 'node_def_2')

  const newName = 'node_def_1_new'
  const updatedNodeDef = await NodeDefRepository.updateNodeDefProp(nodeDef1.id, 'name', newName)

  expect(NodeDefTest.getNodeDefName(updatedNodeDef)).to.equal(newName)

  const nodeDefs = await NodeDefRepository.fetchNodeDefsBySurveyId(surveyInfo.id, true)

  //only one node def with that name
  expect(R.filter(n => NodeDefTest.getNodeDefName(n) === newName, nodeDefs).length).to.equal(1)

  //do not modify existing nodes
  const reloadedNodeDef2 = R.find(n => n.id === nodeDef2.id)(nodeDefs)
  expect(NodeDefTest.getNodeDefType(reloadedNodeDef2)).to.equal(NodeDefTest.getNodeDefType(nodeDef2))
  expect(NodeDefTest.getNodeDefName(reloadedNodeDef2)).to.equal(NodeDefTest.getNodeDefName(nodeDef2))
}

module.exports = {
  createNodeDefsTest,
  updateNodeDefTest,
}
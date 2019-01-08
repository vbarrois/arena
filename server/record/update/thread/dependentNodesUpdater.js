const R = require('ramda')

const {dependencyTypes} = require('../../../survey/surveyDependenchyGraph')

const RecordDependencyManager = require('../../recordDependencyManager')

const DefaultValuesUpdater = require('./defaultValuesUpdater')
const ApplicableIfUpdater = require('./applicableIfIUpdater')

class DependentNodesUpdater {

  constructor (survey, nodeRepository, nodeBindFunction) {
    this.survey = survey
    this.nodeBindFunction = nodeBindFunction

    this.recordDependencyManager = new RecordDependencyManager(nodeRepository, nodeBindFunction)
    this.defaultValuesUpdater = new DefaultValuesUpdater(nodeRepository)
    this.applicableIfUpdater = new ApplicableIfUpdater(nodeRepository)
  }

  async updateDependentNodes (user, nodes, t) {
    let nodesToVisit = R.clone(nodes)
    let allUpdatedNodes = {}
    let lastUpdatedNodes = {}

    while (!R.isEmpty(nodesToVisit)) {
      lastUpdatedNodes = await this._updateDependentNodesInternal(user, nodesToVisit, t)

      nodesToVisit = R.reject(node => R.includes(node.uuid, R.keys(allUpdatedNodes)))(lastUpdatedNodes)

      allUpdatedNodes = R.mergeRight(allUpdatedNodes, lastUpdatedNodes)
    }

    return allUpdatedNodes
  }

  async _updateDependentNodesInternal (user, nodes, t) {
    let updatedNodes = {}

    const bindedNodes = R.pipe(
      R.values,
      R.map(node => this.nodeBindFunction(this.survey, node, t))
    )(nodes)

    for (const fn of [
      this.updateApplicability.bind(this),
      this.applyDefaultValues.bind(this)
    ]) {
      const partialUpdatedNodes = await fn(user, bindedNodes, t)

      updatedNodes = R.mergeRight(updatedNodes, partialUpdatedNodes)
    }
    return updatedNodes
  }

  async updateApplicability (user, nodesArray, t) {
    const dependents = await this.recordDependencyManager.fetchDependentNodes(this.survey, nodesArray, dependencyTypes.applicable, t)

    return await this.applicableIfUpdater.updateNodesApplicability(user, this.survey, R.concat(dependents, nodesArray), t)
  }

  async applyDefaultValues (user, nodesArray, t) {
    const defaultValuesDependentNodes = await this.recordDependencyManager.fetchDependentNodes(this.survey, nodesArray, dependencyTypes.defaultValues, t)

    const defaultValueToRecalculatedNodes = R.concat(defaultValuesDependentNodes, nodesArray)

    return await this.defaultValuesUpdater.applyDefaultValues(user, this.survey, defaultValueToRecalculatedNodes, t)
  }
}

module.exports = DependentNodesUpdater
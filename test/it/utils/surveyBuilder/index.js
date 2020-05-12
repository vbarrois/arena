import pgPromise from 'pg-promise'
import * as R from 'ramda'

import { db } from '../../../../server/db/db'

import * as Survey from '../../../../core/survey/survey'
import * as NodeDef from '../../../../core/survey/nodeDef'
import * as User from '../../../../core/user/user'

import * as SurveyManager from '../../../../server/modules/survey/manager/surveyManager'
import * as NodeDefRepository from '../../../../server/modules/nodeDef/repository/nodeDefRepository'

import * as SurveyUtils from '../surveyUtils'

import NodeDefEntityBuilder from './nodeDefEntityBuilder'
import NodeDefAttributeBuilder from './nodeDefAttributeBuilder'
import { TaxonomyBuilder, TaxonBuilder } from './surveyBuilderTaxonomy'

class SurveyBuilder {
  constructor(user, rootDefBuilder) {
    this.user = user
    this.name = `do_not_use__test_${new Date().getTime()}`
    this.label = 'DO NOT USE! Test'
    this.lang = 'en'
    this.rootDefBuilder = rootDefBuilder

    this.taxonomyBuilders = []
  }

  build() {
    const survey = Survey.newSurvey({
      ownerUuid: User.getUuid(this.user),
      name: this.name,
      label: this.label,
      languages: [this.lang],
    })
    const nodeDefs = this.rootDefBuilder.build(survey)

    return R.pipe(Survey.assocNodeDefs(nodeDefs), (s) =>
      Survey.assocDependencyGraph(Survey.buildDependencyGraph(s))(s)
    )(survey)
  }

  taxonomy(name, ...taxonBuilders) {
    const taxonomyBuilder = new TaxonomyBuilder(name, ...taxonBuilders)
    this.taxonomyBuilders.push(taxonomyBuilder)
    return this
  }

  /**
   * Builds the survey and saves it as draft or publish it.
   *
   * @param {boolean} [publish=true] - Whether to publish the survey.
   * @param {pgPromise.IDatabase} [client=db] - The database client.
   * @returns {Promise<Survey>} - The newly created survey object.
   */
  async buildAndStore(publish = true, client = db) {
    const surveyParam = this.build()

    return client.tx(async (t) => {
      const surveyCreationParams = {
        user: this.user,
        surveyInfo: surveyParam,
        createRootEntityDef: false,
        system: true,
      }
      const survey = await SurveyManager.insertSurvey(surveyCreationParams, t)

      const surveyId = Survey.getId(survey)

      // Node defs
      const { root } = Survey.getHierarchy(R.always, true)(surveyParam)
      await Survey.traverseHierarchyItem(root, async (nodeDef) => NodeDefRepository.insertNodeDef(surveyId, nodeDef, t))

      // Taxonomies
      await Promise.all(
        this.taxonomyBuilders.map((taxonomyBuilder) => taxonomyBuilder.buildAndStore(this.user, surveyId, t))
      )

      if (publish) {
        await SurveyUtils.publishSurvey(this.user, surveyId, t)
      }

      const surveyDb = await SurveyManager.fetchSurveyAndNodeDefsBySurveyId(
        surveyId,
        Survey.cycleOneKey,
        !publish,
        true,
        false,
        false,
        t
      )
      return Survey.buildAndAssocDependencyGraph(surveyDb)
    })
  }
}

// ==== survey
export const survey = (user, rootDefBuilder) => new SurveyBuilder(user, rootDefBuilder)
export const entity = (name, ...childBuilders) => new NodeDefEntityBuilder(name, ...childBuilders)
export const attribute = (name, type = NodeDef.nodeDefType.text) => new NodeDefAttributeBuilder(name, type)
// ==== taxonomy
export const taxon = (code, family, genus, scientificName, ...vernacularNames) =>
  new TaxonBuilder(code, family, genus, scientificName, ...vernacularNames)

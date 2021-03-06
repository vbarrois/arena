import * as R from 'ramda'

import * as Survey from '@core/survey/survey'
import * as NodeDef from '@core/survey/nodeDef'
import * as PromiseUtils from '@core/promiseUtils'

import * as SurveyManager from '@server/modules/survey/manager/surveyManager'

import { getContextUser } from '../../config/context'
import * as SB from '../../../utils/surveyBuilder'
import * as RB from '../../../utils/recordBuilder'
import * as ChainBuilder from '../../../utils/chainBuilder'

const getContext = () => {
  const survey = global.applicableSurvey
  const record = global.applicableRecord
  const processingChain = global.applicableProcessingChain
  const records = global.applicableRecords
  return { survey, record, processingChain, records }
}

beforeAll(async () => {
  const user = getContextUser()

  global.applicableSurvey = await SB.survey(
    user,
    // Cluster
    SB.entity(
      'cluster',
      SB.attribute('cluster_no', NodeDef.nodeDefType.integer).key(),

      // --> plot
      SB.entity(
        'plot',
        SB.attribute('plot_no', NodeDef.nodeDefType.integer).key(),

        // --> tree
        SB.entity(
          'tree',
          SB.attribute('tree_no', NodeDef.nodeDefType.integer).key(),
          SB.attribute('tree_dbh', NodeDef.nodeDefType.decimal),
          SB.attribute('tree_height', NodeDef.nodeDefType.decimal),
          SB.attribute('tree_volume', NodeDef.nodeDefType.decimal).analysis()
        ).multiple()
      ).multiple()
    )
  ).buildAndStore()

  const newTree = (treeNo) =>
    RB.entity(
      'tree',
      RB.attribute('tree_no', treeNo),
      RB.attribute('tree_dbh', Math.random() * 100),
      RB.attribute('tree_height', Math.random() * 40)
    )

  const newPlot = (plotNo, noTrees) =>
    RB.entity('plot', RB.attribute('plot_no', plotNo), ...R.range(1, noTrees + 1).map(newTree))

  // Add 5 records
  await PromiseUtils.each([1, 2, 3, 4, 5], async (clusterNum) => {
    const record = await RB.record(
      user,
      global.applicableSurvey,
      RB.entity(
        'cluster',
        RB.attribute('cluster_no', clusterNum),
        newPlot(1, 4),
        newPlot(2, 2),
        newPlot(3, 6),
        newPlot(4, 5)
      )
    ).buildAndStore()

    global.applicableRecords = [...(global.applicableRecords || []), record]
  })

  global.applicableProcessingChain = ChainBuilder.chain(
    user,
    global.applicableSurvey,
    'Simple chain',
    ChainBuilder.step(
      'tree',
      ChainBuilder.calculation('tree_volume', 'Tree volume calculation').formula('tree_dbh * tree_height')
    )
  ).build()
})

afterAll(async () => {
  const { survey } = getContext()
  if (survey) {
    await SurveyManager.deleteSurvey(Survey.getId(survey))
  }
})

export const simpleTest = async () => {
  const { processingChain } = getContext()
  // Console.log(JSON.stringify(survey))
  // console.log(JSON.stringify(records))
  // await ProcessingChainService.generateScriptDeprecated(Survey.getId(survey), Survey.cycleOneKey, processingChain)
  // console.log('Processing chain', JSON.stringify(processingChain))
  // console.log('empty test')

  /* eslint-disable no-unused-expressions */
  expect(processingChain).toBeDefined()
}

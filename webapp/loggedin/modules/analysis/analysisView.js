import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import { appModules, appModuleUri, analysisModules } from '@webapp/app/appModules'

import ModuleSwitch from '@webapp/commonComponents/moduleSwitch'
import CategoriesView from '@webapp/loggedin/surveyViews/categories/categoriesView'
import CategoryView from '@webapp/loggedin/surveyViews/category/categoryView'
import NodeDefView from '@webapp/loggedin/surveyViews/nodeDef/nodeDefView'
import SurveyDefsLoader from '@webapp/loggedin/surveyViews/surveyDefsLoader/surveyDefsLoader'
import ChainsView from './chains/view'
import ChainView from './chain/view'

import { navigateToChainsView } from './chain/actions'

const AnalysisView = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  return (
    <SurveyDefsLoader
      draft
      validate={false}
      requirePublish
      onSurveyCycleUpdate={() => dispatch(navigateToChainsView(history))}
    >
      <ModuleSwitch
        moduleRoot={appModules.analysis}
        moduleDefault={analysisModules.processingChains}
        modules={[
          {
            component: ChainsView,
            path: appModuleUri(analysisModules.processingChains),
          },
          {
            component: ChainView,
            path: `${appModuleUri(analysisModules.processingChain)}:chainUuid/`,
          },
          {
            component: NodeDefView,
            path: `${appModuleUri(analysisModules.nodeDef)}:nodeDefUuid/`,
          },
          {
            component: CategoriesView,
            path: appModuleUri(analysisModules.categories),
            props: { analysis: true },
          },
          {
            component: CategoryView,
            path: `${appModuleUri(analysisModules.category)}:categoryUuid`,
            props: { analysis: true },
          },
        ]}
      />
    </SurveyDefsLoader>
  )
}

export default AnalysisView

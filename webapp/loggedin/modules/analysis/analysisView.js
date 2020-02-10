import React from 'react'

import { appModules, appModuleUri, analysisModules } from '@webapp/app/appModules'

import ModuleSwitch from '@webapp/commonComponents/moduleSwitch'
import CategoriesView from '@webapp/loggedin/surveyViews/categories/categoriesView'
import CategoryView from '@webapp/loggedin/surveyViews/category/categoryView'
import NodeDefView from '@webapp/loggedin/surveyViews/nodeDef/nodeDefView'
import SurveyDefsLoader from '@webapp/loggedin/surveyViews/surveyDefsLoader/surveyDefsLoader'
import ProcessingChainsView from './processingChains/processingChainsView'
import ProcessingChainView from './processingChain/processingChainView'

const AnalysisView = () => (
  <SurveyDefsLoader draft={false} validate={false} requirePublish={true}>
    <ModuleSwitch
      moduleRoot={appModules.analysis}
      moduleDefault={analysisModules.processingChains}
      modules={[
        {
          component: ProcessingChainsView,
          path: appModuleUri(analysisModules.processingChains),
        },
        {
          component: ProcessingChainView,
          path: `${appModuleUri(analysisModules.processingChain)}:processingChainUuid/`,
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

export default AnalysisView

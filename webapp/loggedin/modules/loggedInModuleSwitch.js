import React from 'react'
import { Route, Switch } from 'react-router'

import { appModules, appModuleUri } from '@webapp/app/appModules'

import DesignerView from './designer/designerView'
import HomeView from './home/homeView'
import DataViewComponent from './data/dataView'
import UsersView from './users/usersView'
import AnalysisView from './analysis/analysisView'

const LoggedInModuleSwitch = props => (
  <div className="app-module">
    <Switch location={props.location}>
      <Route path={appModuleUri(appModules.home)} component={HomeView} />
      <Route path={appModuleUri(appModules.designer)} component={DesignerView} />
      <Route path={appModuleUri(appModules.data)} component={DataViewComponent} />
      <Route path={appModuleUri(appModules.users)} component={UsersView} />
      <Route path={appModuleUri(appModules.analysis)} component={AnalysisView} />
    </Switch>
  </div>
)

export default LoggedInModuleSwitch
import './homeView.scss'

import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'

import TabBar from '../../commonComponents/tabBar'
import DashboardView from './dashboard/dashboardView'
import SurveyListView from './surveyList/surveyListView'
import SurveyCreateView from './surveyCreate/surveyCreateView'
import SurveyInfoView from './surveyInfo/surveyInfoView'

import Survey from '../../../common/survey/survey'
import AuthManager from '../../../common/auth/authManager'

import { appModules, appModuleUri } from '../appModules'
import { homeModules } from './homeModules'

import * as SurveyState from '../../survey/surveyState'
import * as AppState from '../../app/appState'

class HomeView extends React.Component {

  componentDidUpdate (prevProps) {
    const { surveyInfo, history } = this.props
    const { surveyInfo: prevSurveyInfo } = prevProps

    // active survey change
    if (
      surveyInfo && (
        // new survey created
        !prevSurveyInfo
        // changed from survey list
        || surveyInfo.id !== prevSurveyInfo.id
      )
    ) {
      history.push(appModuleUri(homeModules.dashboard))
    }

    // survey deleted
    if (Survey.isValid(prevSurveyInfo) && !Survey.isValid(surveyInfo)) {
      history.push(appModuleUri(homeModules.surveyList))
    }
  }

  render () {
    const { location, history, canEditDef } = this.props

    const isHomeUri = location.pathname === appModuleUri(appModules.home)

    return isHomeUri
      ? (
        <Redirect to={appModuleUri(homeModules.dashboard)}/>
      ) : (

        <TabBar
          className="data app-module__tab-navigation"
          location={location}
          history={history}
          tabs={[
            {
              label: 'Dashboard',
              component: DashboardView,
              path: appModuleUri(homeModules.dashboard),
              icon: 'icon-office',
            },
            {
              label: 'My Surveys',
              component: SurveyListView,
              path: appModuleUri(homeModules.surveyList),
              icon: 'icon-paragraph-justify',
            },
            {
              label: 'Add new survey',
              component: SurveyCreateView,
              path: appModuleUri(homeModules.surveyNew),
              icon: 'icon-plus',
            },
            {
              label: 'Survey Info',
              component: SurveyInfoView,
              path: appModuleUri(homeModules.surveyInfo),
              icon: canEditDef ? 'icon-pencil2' : 'icon-eye',
            },
          ]}
        />
      )
  }
}

const mapStateToProps = state => {
  const user = AppState.getUser(state)
  const surveyInfo = SurveyState.getStateSurveyInfo(state)

  return {
    surveyInfo,
    canEditDef: AuthManager.canEditSurvey(user, surveyInfo),
  }
}

const enhance = compose(
  withRouter,
  connect(mapStateToProps)
)

export default enhance(HomeView)
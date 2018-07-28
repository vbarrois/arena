import React from 'react'
import { connect } from 'react-redux'

import { appState } from '../app'
import { surveyState } from '../../survey/surveyState'
import { logout } from '../actions'

import { AppSideBarFooter, AppSideBarModules } from './appSideBar'

class AppSideBarComponent extends React.Component {

  constructor () {
    super()
    this.state = {opened: false}
  }

  toggleOpen () {
    const {opened} = this.state

    const width = opened ? 60 : 200
    document.getElementsByClassName('app__container')[0].style.gridTemplateColumns = `${width}px 1fr`

    this.setState({opened: !opened})
  }

  render () {
    const {opened} = this.state

    return (
      <div className="app-sidebar">

        {/*toggle sidebar */}
        <div style={{
          display: 'grid',
          width: '100%',
          justifyItems: 'end',
          opacity: '.5',
        }}>
          <a className="btn btn-s btn-of-light-xs"
             onClick={() => this.toggleOpen()}>
            <span className={`icon icon-${opened ? 'shrink2' : 'enlarge2'} icon-16px`}/>
          </a>
        </div>

        <AppSideBarModules {...this.props} opened={opened}/>

        <AppSideBarFooter {...this.props} opened={opened}/>

      </div>
    )
  }

}

const mapStateToProps = state => ({
  user: appState.getUser(state),
  survey: surveyState.getCurrentSurvey(state)
})

export default connect(mapStateToProps, {logout})(AppSideBarComponent)
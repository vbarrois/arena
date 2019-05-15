import React from 'react'
import { connect } from 'react-redux'

import { initSurveyDefs } from '../../../survey/actions'

import * as SurveyState from '../../../survey/surveyState'

class SurveyDefsLoader extends React.Component {

  componentDidMount () {
    const { draft, validate, initSurveyDefs } = this.props

    initSurveyDefs(draft, validate)
  }

  render () {
    const { ready, children } = this.props

    return ready
      ? children
      : null
  }

}

const mapStateToProps = state => ({
  ready: SurveyState.areDefsFetched(state)
})

export default connect(
  mapStateToProps,
  { initSurveyDefs }
)(SurveyDefsLoader)
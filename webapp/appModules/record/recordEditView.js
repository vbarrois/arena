import React from 'react'
import connect from 'react-redux/es/connect/connect'

import { getCurrentRecord } from '../../record/recordState'
import SurveyFormView from '../../survey/components/surveyFormView'

class RecordEditView extends React.Component {

  render() {
    const {record} = this.props

    console.log(record)

    return (
      <SurveyFormView draft={false} edit={false} entry={true} />
    )
  }
}


const mapStateToProps = state => ({
  record: getCurrentRecord(state)
})

export default connect(mapStateToProps)(RecordEditView)
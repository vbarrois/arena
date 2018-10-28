import React from 'react'

import SurveyFormView from '../../survey/form/components/surveyFormView'

class DataRecordView extends React.Component {

  render() {
    return (
      <SurveyFormView draft={false} edit={false} entry={true} />
    )
  }
}


export default DataRecordView
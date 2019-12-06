import './taxonomyEditView.scss'

import React, { useEffect } from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router'

import * as Authorizer from '@core/auth/authorizer'

import { useI18n } from '@webapp/commonComponents/hooks'
import * as Taxonomy from '@core/survey/taxonomy'
import * as AppState from '@webapp/app/appState'
import * as SurveyState from '@webapp/survey/surveyState'
import TableView from '../../tableViews/tableView'
import TaxonomyEditHeader from './components/taxonomyEditHeader'
import TaxaTableRowHeader from './components/taxaTableRowHeader'
import TaxaTableRow from './components/taxaTableRow'

import * as TaxonomyEditState from './taxonomyEditState'

import { putTaxonomyProp, setTaxonomyForEdit, uploadTaxonomyFile } from './actions'

const TaxonomyEditView = props => {
  const { surveyId, taxonomy, canEdit, setTaxonomyForEdit, putTaxonomyProp, uploadTaxonomyFile } = props

  const history = useHistory()
  const { taxonomyUuid } = useParams()
  const i18n = useI18n()

  const vernacularLanguageCodes = Taxonomy.getVernacularLanguageCodes(taxonomy)

  const gridTemplateColumns = `.1fr .1fr .2fr .2fr .4fr ${
    R.isEmpty(vernacularLanguageCodes) ? '' : `repeat(${vernacularLanguageCodes.length}, 60px)`
  }`

  useEffect(() => {
    setTaxonomyForEdit(taxonomyUuid)
  }, [])

  return taxonomy ? (
    <div className="taxonomy-edit">
      <TaxonomyEditHeader {...props} />

      <TableView
        module={TaxonomyEditState.keys.taxa}
        moduleApiUri={`/api/survey/${surveyId}/taxonomies/${taxonomyUuid}/taxa`}
        restParams={{ draft: canEdit }}
        gridTemplateColumns={gridTemplateColumns}
        rowHeaderComponent={TaxaTableRowHeader}
        rowComponent={TaxaTableRow}
        noItemsLabelKey={'taxonomy.edit.taxaNotImported'}
        surveyId={surveyId}
        putTaxonomyProp={putTaxonomyProp}
        uploadTaxonomyFile={uploadTaxonomyFile}
        vernacularLanguageCodes={vernacularLanguageCodes}
        taxonomy={taxonomy}
        readOnly={!canEdit}
      />

      <div style={{ justifySelf: 'center' }}>
        <button
          className="btn"
          onClick={() => {
            history.goBack()
            setTaxonomyForEdit(null)
          }}
        >
          {i18n.t('common.done')}
        </button>
      </div>
    </div>
  ) : null
}

const mapStateToProps = state => {
  const surveyInfo = SurveyState.getSurveyInfo(state)
  const user = AppState.getUser(state)

  return {
    surveyId: SurveyState.getSurveyId(state),
    taxonomy: TaxonomyEditState.getTaxonomy(state),
    canEdit: Authorizer.canEditSurvey(user, surveyInfo),
  }
}

export default connect(mapStateToProps, {
  setTaxonomyForEdit,
  putTaxonomyProp,
  uploadTaxonomyFile,
})(TaxonomyEditView)

import './validationReportView.scss'

import React from 'react'
import { connect } from 'react-redux'

import * as R from 'ramda'

import TableView from '@webapp/loggedin/tableViews/tableView'
import { useI18n, useOnUpdate } from '@webapp/commonComponents/hooks'

import * as Survey from '@core/survey/survey'
import * as Record from '@core/record/record'
import * as NodeDef from '@core/survey/nodeDef'
import * as Node from '@core/record/node'
import * as Authorizer from '@core/auth/authorizer'

import { appModuleUri, dataModules } from '@webapp/loggedin/appModules'

import * as AppState from '@webapp/app/appState'
import * as SurveyState from '@webapp/survey/surveyState'
import * as RecordsState from '@webapp/loggedin/modules/data/records/recordsState'

import { reloadListItems } from '@webapp/loggedin/tableViews/actions'

import ValidationFieldMessages from '@webapp/commonComponents/validationFieldMessages'

const validationReportModule = 'validationReport'

const ValidationReportRowHeader = ({ nodeDefKeys }) => {
  const i18n = useI18n()

  return (
    <>
      <div>#</div>
      { nodeDefKeys.map((k, i) => <div key={i}>{NodeDef.getLabel(k, i18n.lang)}</div>) }
      <div>{i18n.t('common.path')}</div>
      <div>{i18n.t('common.messages')}</div>
      <div />
    </>
  )
}

const ValidationReportRow = ({ user, survey, row, nodeDefKeys, idx, offset }) => {
  const i18n = useI18n()

  const path = row.keysHierarchy.slice(1).reduce((path, h) => {
    const parentNodeDef = Survey.getNodeDefByUuid(h.nodeDefUuid)(survey)
    const parentNodeDefName = NodeDef.getLabel(parentNodeDef, i18n.lang)
    const keyValues = Object.values(h.keys).reduce((values, value) => values.concat(value === null ? 'null' : value), [])

    return path.concat(`${parentNodeDefName} (${keyValues.join(', ')})`)
  }, [])

  const lastNodeDef = Survey.getNodeDefByUuid(NodeDef.getUuid(row))(survey)
  path.push(NodeDef.getLabel(lastNodeDef, i18n.lang))

  const hierarchyKeys = row.keysHierarchy[0].keys

  const surveyInfo = Survey.getSurveyInfo(survey)
  const canEdit = Survey.isPublished(surveyInfo) &&
    Authorizer.canEditRecord(user, {
      [Record.keys.step]: Record.getStep(row),
      [Record.keys.surveyUuid]: Survey.getUuid(surveyInfo),
      [Record.keys.ownerUuid]: Record.getOwnerUuid(row)
    })

  return (
    <>
      <div>
        {idx + offset + 1}
      </div>
      {
        nodeDefKeys.map((k, i) =>
          <div key={i}>{hierarchyKeys ? hierarchyKeys[Node.getUuid(k)] : row.keysSelf[Node.getUuid(k)]}</div>
        )
      }
      <div>
        {path.join(' / ')}
      </div>
      <div className='validation_report_view__message'>
        <ValidationFieldMessages validation={row.validation} showKeys={false} />
      </div>
      <div>
        <span className={`icon icon-12px icon-action ${canEdit ? 'icon-pencil2' : 'icon-eye'}`} />
      </div>
    </>
  )
}

const ValidationReportView = ({ canInvite, user, survey, surveyCycleKey, reloadListItems, history }) => {
  useOnUpdate(() => {
    reloadListItems(validationReportModule, { cycle: surveyCycleKey })
  }, [surveyCycleKey])

  const onRowClick = record => {
    const parentEntityUuid = R.prop('nodeUuid', R.last(record.keysHierarchy))
    const recordUuid = Record.getUuid(record)
    const recordEditUrl = `${appModuleUri(dataModules.record)}${recordUuid}?parentNodeUuid=${parentEntityUuid}`

    history.push(recordEditUrl)
  }

  const nodeDefRoot = Survey.getNodeDefRoot(survey)
  const nodeDefKeys = Survey.getNodeDefKeys(nodeDefRoot)(survey)

  const noCols = nodeDefKeys.length
  const gridTemplateColumns = `70px repeat(${noCols}, 200px) 1fr 2fr 50px`

  const restParams = { cycle: surveyCycleKey }

  return <TableView
    className='validation_report_view__table'
    module={validationReportModule}
    restParams={restParams}

    gridTemplateColumns={gridTemplateColumns}
    rowHeaderComponent={ValidationReportRowHeader}
    rowComponent={ValidationReportRow}

    nodeDefKeys={nodeDefKeys}

    canInvite={canInvite}
    user={user}
    survey={survey}

    onRowClick={onRowClick}
  />
}

const mapStateToProps = state => {
  return {
    user: AppState.getUser(state),
    survey: SurveyState.getSurvey(state),
    nodeDefKeys: RecordsState.getNodeDefKeys(state),
    surveyCycleKey: SurveyState.getSurveyCycleKey(state),
  }
}

export default connect(mapStateToProps, { reloadListItems })(ValidationReportView)

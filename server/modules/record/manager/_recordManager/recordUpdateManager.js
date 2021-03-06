import * as R from 'ramda'

import * as ActivityLog from '@common/activityLog/activityLog'

import * as ObjectUtils from '@core/objectUtils'
import * as Survey from '@core/survey/survey'
import * as NodeDef from '@core/survey/nodeDef'
import * as Record from '@core/record/record'
import * as RecordStep from '@core/record/recordStep'
import * as Node from '@core/record/node'

import SystemError from '@core/systemError'

import { db } from '@server/db/db'
import * as ActivityLogRepository from '@server/modules/activityLog/repository/activityLogRepository'
import * as RecordRepository from '@server/modules/record/repository/recordRepository'
import * as FileRepository from '@server/modules/record/repository/fileRepository'
import * as DataTableUpdateRepository from '@server/modules/surveyRdb/repository/dataTableUpdateRepository'
import * as DataTableReadRepository from '@server/modules/surveyRdb/repository/dataTableReadRepository'

import * as RecordValidationManager from './recordValidationManager'
import * as NodeUpdateManager from './nodeUpdateManager'

/**
 * =======
 * RECORD
 * =======
 */

// ==== CREATE

export const initNewRecord = async (
  user,
  survey,
  record,
  nodesUpdateListener = null,
  nodesValidationListener = null,
  client = db,
) =>
  await client.tx(async t => {
    const rootNodeDef = Survey.getNodeDefRoot(survey)

    const rootNode = Node.newNode(NodeDef.getUuid(rootNodeDef), Record.getUuid(record))

    return await persistNode(user, survey, record, rootNode, nodesUpdateListener, nodesValidationListener, true, t)
  })

// ==== UPDATE

export const updateRecordStep = async (user, survey, record, stepId, system = false, client = db) => {
  await client.tx(async t => {
    // Check if the step exists and that is't adjacent to the current one
    const currentStepId = Record.getStep(record)
    const stepCurrent = RecordStep.getStep(currentStepId)
    const stepUpdate = RecordStep.getStep(stepId)

    if (RecordStep.areAdjacent(stepCurrent, stepUpdate)) {
      const recordUuid = Record.getUuid(record)
      const surveyId = Survey.getId(survey)

      await Promise.all([
        RecordRepository.updateRecordStep(surveyId, recordUuid, stepId, t),
        ActivityLogRepository.insert(
          user,
          surveyId,
          ActivityLog.type.recordStepUpdate,
          {
            [ActivityLog.keysContent.uuid]: recordUuid,
            [ActivityLog.keysContent.stepFrom]: currentStepId,
            [ActivityLog.keysContent.stepTo]: stepId,
          },
          system,
          t,
        ),
      ])
    } else {
      throw new SystemError('cantUpdateStep')
    }
  })
}

// ==== DELETE
export const deleteRecord = async (user, survey, uuid) =>
  await db.tx(async t => {
    const rootDef = Survey.getNodeDefRoot(survey)
    const keys = await DataTableReadRepository.fetchEntityKeysByRecordAndNodeDefUuid(
      survey,
      NodeDef.getUuid(rootDef),
      uuid,
      null,
      t,
    )
    const logContent = {
      [ActivityLog.keysContent.uuid]: uuid,
      [ActivityLog.keysContent.keys]: keys,
    }
    const surveyId = Survey.getId(survey)
    await Promise.all([
      RecordRepository.deleteRecord(surveyId, uuid, t),
      ActivityLogRepository.insert(user, surveyId, ActivityLog.type.recordDelete, logContent, false, t),
    ])
  })

export const deleteRecordPreview = async (surveyId, recordUuid) =>
  await db.tx(async t => {
    await RecordRepository.deleteRecord(surveyId, recordUuid, t)
    await FileRepository.deleteFilesByRecordUuids(surveyId, [recordUuid], t)
  })

export const deleteRecordsPreview = async (surveyId, olderThan24Hours) =>
  await db.tx(async t => {
    const recordUuids = await RecordRepository.deleteRecordsPreview(surveyId, olderThan24Hours, t)
    if (!R.isEmpty(recordUuids)) {
      await FileRepository.deleteFilesByRecordUuids(surveyId, recordUuids, t)
    }

    return recordUuids.length
  })

export const deleteRecordsByCycles = RecordRepository.deleteRecordsByCycles

/**
 * ======
 * NODE
 * ======
 */

export const insertNode = NodeUpdateManager.insertNode

export const persistNode = async (
  user,
  survey,
  record,
  node,
  nodesUpdateListener = null,
  nodesValidationListener = null,
  system = false,
  t = db,
) =>
  await _updateNodeAndValidateRecordUniqueness(
    user,
    survey,
    record,
    node,
    (user, survey, record, node, t) => NodeUpdateManager.persistNode(user, survey, record, node, system, t),
    nodesUpdateListener,
    nodesValidationListener,
    t,
  )

export const updateNodesDependents = NodeUpdateManager.updateNodesDependents

export const deleteNode = async (
  user,
  survey,
  record,
  nodeUuid,
  nodesUpdateListener = null,
  nodesValidationListener = null,
  t = db,
) =>
  await _updateNodeAndValidateRecordUniqueness(
    user,
    survey,
    record,
    Record.getNodeByUuid(nodeUuid)(record),
    (user, survey, record, node, t) => NodeUpdateManager.deleteNode(user, survey, record, Node.getUuid(node), t),
    nodesUpdateListener,
    nodesValidationListener,
    t,
  )

export const deleteNodesByNodeDefUuids = NodeUpdateManager.deleteNodesByNodeDefUuids

const _updateNodeAndValidateRecordUniqueness = async (
  user,
  survey,
  record,
  node,
  nodesUpdateFn,
  nodesUpdateListener = null,
  nodesValidationListener = null,
  t = db,
) =>
  await t.tx(async t => {
    await _beforeNodeUpdate(user, survey, record, node, t)

    const nodesUpdated = await nodesUpdateFn(user, survey, record, node, t)

    const { record: updatedRecord, updatedNodesAndDependents } = await _onNodesUpdate(
      survey,
      nodesUpdated,
      nodesUpdateListener,
      nodesValidationListener,
      t,
    )
    await _afterNodesUpdate(user, survey, updatedRecord, updatedNodesAndDependents, t)

    return updatedRecord
  })

const _beforeNodeUpdate = async (user, survey, record, node, t) => {
  if (!Record.isPreview(record)) {
    // Check if record key will be modified
    const nodeDef = Survey.getNodeDefByUuid(Node.getNodeDefUuid(node))(survey)

    if (Survey.isNodeDefRootKey(nodeDef)(survey)) {
      // Validate record uniqueness of records with same record keys
      await RecordValidationManager.validateRecordsUniquenessAndPersistValidation(survey, record, true, t)
    }
  }
}

const _onNodesUpdate = async (
  survey,
  { record, nodes: updatedNodes },
  nodesUpdateListener,
  nodesValidationListener,
  t,
) => {
  // 1. update record and notify
  if (nodesUpdateListener) {
    nodesUpdateListener(updatedNodes)
  }

  // 2. update dependent nodes
  const {
    record: recordUpdatedDependentNodes,
    nodes: updatedDependentNodes,
  } = await NodeUpdateManager.updateNodesDependents(survey, record, updatedNodes, t)
  if (nodesUpdateListener) {
    nodesUpdateListener(updatedDependentNodes)
  }

  record = recordUpdatedDependentNodes

  const updatedNodesAndDependents = {
    ...updatedNodes,
    ...updatedDependentNodes,
  }

  // 3. update node validations
  const validations = await RecordValidationManager.validateNodesAndPersistValidation(
    survey,
    record,
    updatedNodesAndDependents,
    true,
    t,
  )
  if (nodesValidationListener) {
    nodesValidationListener(validations)
  }

  record = Record.mergeNodeValidations(validations)(record)

  // 4. update survey rdb
  if (!Record.isPreview(record)) {
    const nodeDefs = ObjectUtils.toUuidIndexedObj(
      Survey.getNodeDefsByUuids(Node.getNodeDefUuids(updatedNodesAndDependents))(survey),
    )
    await DataTableUpdateRepository.updateTable(survey, Record.getCycle(record), nodeDefs, updatedNodesAndDependents, t)

    // Merge updated nodes with existing ones (remove created/updated flags nodes)
    record = Record.mergeNodes(updatedNodesAndDependents)(record)
  }

  return {
    record,
    updatedNodesAndDependents,
  }
}

const _afterNodesUpdate = async (user, survey, record, nodes, t) => {
  if (!Record.isPreview(record)) {
    // Check if root key has been modified
    const rootKeyModified = R.any(node => {
      const nodeDef = Survey.getNodeDefByUuid(Node.getNodeDefUuid(node))(survey)
      return Survey.isNodeDefRootKey(nodeDef)(survey)
    })(Object.values(nodes))

    if (rootKeyModified) {
      // Validate record uniqueness of records with same record keys
      await RecordValidationManager.validateRecordsUniquenessAndPersistValidation(survey, record, false, t)
    }
  }
}

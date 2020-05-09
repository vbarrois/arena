import * as DB from '../../../../db'

import * as ProcessingChain from '../../../../../common/analysis/processingChain'
import * as ActivityLog from '../../../../../common/activityLog/activityLog'
import { TableChain } from '../../../../../common/model/db'

import * as ChainRepository from '../../repository/chain'
import * as ActivityLogRepository from '../../../activityLog/repository/activityLogRepository'

export { countChains, fetchChains, fetchChain, updateChain, removeChainCycles } from '../../repository/chain'

export const updateChainStatusExec = async ({ user, surveyId, chainUuid, statusExec }) =>
  DB.client.tx(async (tx) => {
    const promises = [
      ChainRepository.updateChain(
        { surveyId, chainUuid, fields: { [TableChain.columnSet.statusExec]: statusExec }, dateExecuted: true },
        tx
      ),
    ]
    if (statusExec === ProcessingChain.statusExec.success) {
      const type = ActivityLog.type.processingChainStatusExecSuccess
      const content = { [ActivityLog.keysContent.uuid]: chainUuid }
      promises.push(ActivityLogRepository.insert(user, surveyId, type, content, false, tx))
    }

    return Promise.all(promises)
  })

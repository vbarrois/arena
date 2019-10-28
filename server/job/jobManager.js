const { jobThreadMessageTypes } = require('./jobUtils')
const ThreadsCache = require('@server/threads/threadsCache')
const ThreadManager = require('@server/threads/threadManager')

const WebSocket = require('@server/utils/webSocket')
const WebSocketEvents = require('@common/webSocket/webSocketEvents')

// USER JOB WORKERS

const userJobThreads = new ThreadsCache()

const _notifyJobUpdate = jobSerialized => {
  const userUuid = jobSerialized.userUuid

  WebSocket.notifyUser(userUuid, WebSocketEvents.jobUpdate, jobSerialized)

  if (jobSerialized.ended) {
    const thread = userJobThreads.getThread(userUuid)
    //delay thread termination by 1 second (give time to print debug info to the console)
    setTimeout(() => {
        thread.terminate()
        userJobThreads.removeThread(userUuid)
      },
      1000
    )
  }
}

// ====== UPDATE

const cancelActiveJobByUserUuid = async userUuid => {
  const jobThread = userJobThreads.getThread(userUuid)
  if (jobThread) {
    jobThread.postMessage({ type: jobThreadMessageTypes.cancelJob })
  }
}

// ====== EXECUTE

const executeJobThread = job => {

  const thread = new ThreadManager(
    'jobThread.js',
    { jobType: job.type, jobParams: job.params },
    job => _notifyJobUpdate(job)
  )

  userJobThreads.putThread(job.userUuid, thread)
}

module.exports = {
  executeJobThread,

  cancelActiveJobByUserUuid,
}
const { Worker } = require('worker_threads')

const WebSocket = require('../utils/webSocket')
const WebSocketEvents = require('../../common/webSocket/webSocketEvents')

const threadMessageTypes = require('./threadMessageTypes')

/**
 * Base class for managing communication between EventLoop and Thread in worker pool
 */
class ThreadManager {

  constructor (filePath, data, messageHandler, exitHandler = null, singleMessageHandling = false) {
    this.worker = new Worker(filePath, { workerData: data })
    this.threadId = this.worker.threadId
    this.singleMessageHandling = singleMessageHandling

    this.worker.on('message', this.messageHandlerWrapper.bind(this)(messageHandler))

    this.worker.on('exit', () => {
      console.log(`thread ${this.threadId} ended`)
      if (exitHandler)
        exitHandler()
    })

    console.log(`thread ${this.threadId} created`)
  }

  messageHandlerWrapper (messageHandler) {
    return ({ user, msg }) => {
      switch (msg.type) {
        case threadMessageTypes.error:
          WebSocket.notifyUser(user.id, WebSocketEvents.error, msg.error)
          break
        case threadMessageTypes.messageProcessComplete:
          if (this.singleMessageHandling)
            this.worker.terminate()
          break
        default:
          messageHandler(msg)
      }
    }
  }

  /**
   * Post a message to thread in worker pool
   * @param message
   */
  postMessage (message) {
    this.worker.postMessage(message)
  }

  terminate () {
    this.worker.terminate()
  }

}

module.exports = ThreadManager
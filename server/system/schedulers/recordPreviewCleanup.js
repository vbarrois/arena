const schedule = require('node-schedule')

const logger = require('../../log/log').getLogger('RecordPreviewCleanup')

const RecordService = require('../../modules/record/service/recordService')

const initSchedule = () =>
  schedule.scheduleJob('0 0 * * *', () => {
    try {
      logger.debug('Deleting stale preview records')

      const date = new Date()
      date.setHours(date.getHours() - 24)

      const stalePreviewRecords = RecordService.getStalePreviewRecordUuids(date)

      Promise.all(stalePreviewRecords.map(({ user, surveyId, recordUuid }) =>
        RecordService.checkOut(user, surveyId, recordUuid)
      ))

      logger.debug(`${stalePreviewRecords.length} stale preview records deleted`)
    } catch (err) {
      logger.error(`Error deleting stale preview records: ${err.toString()}`)
    }
  })

const init = async () => {
  try {
    logger.debug('Deleting stale preview records')
    const count = await RecordService.deleteRecordsPreview()
    logger.debug(`${count} stale preview records deleted`)
  } catch (err) {
    logger.error(`Error deleting stale preview records: ${err.toString()}`)
  }

  initSchedule()
}

module.exports = {
  init
}
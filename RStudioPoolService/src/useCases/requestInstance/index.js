const { Instance } = require('../../domain')

const { Model: InstanceModel, Manager: InstanceManager } = Instance

const MIN_FREE_INSTANCES = 1

/*
PUT/POST
body { data: userId }
*/
const requestInstance = async ({ userId = false } = {}) => {
  console.log("requestInstance")
  if (!userId) {
    const response = {
      statusCode: 403,
      body: JSON.stringify({}),
    }
    return response
  }
  console.log("AAAAA")
  let assignedInstance = false

  const freeInstances = await InstanceManager.getFreeInstances()
  console.log("BBBB", freeInstances)
  if (freeInstances.length > 0) {
    const [freeInstance, ...remainFreeInstances] = freeInstances
    assignedInstance = freeInstance

    if (remainFreeInstances.length < MIN_FREE_INSTANCES) {
      await InstanceManager.createNewInstance()
    }
  } else {
    assignedInstance = await InstanceManager.createNewInstance()
  }
  console.log("assignedInstance", assignedInstance)

  assignedInstance = InstanceModel.setUserId({ userId })(assignedInstance)
  const instanceId = InstanceModel.getId(assignedInstance)
  await InstanceManager.saveInstance(assignedInstance)

  console.log("instanceId", instanceId)

  const response = {
    statusCode: 200,
    body: JSON.stringify({ instanceId }),
  }
  return response
}

module.exports = requestInstance

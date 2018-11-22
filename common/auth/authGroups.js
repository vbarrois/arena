const permissions = {
  // surveys
  surveyCreate: 'surveyCreate',

  // only owner and administrator can delete survey
  // edit survey info props, edit nodeDefs, edit codeLists, edit taxonomies, publishSurvey
  surveyEdit: 'surveyEdit',

  // records
  recordCreate: 'recordCreate',
  recordDataEdit: 'recordDataEdit',
  recordView: 'recordView',

  // users
  userInvite: 'userInvite',

  // edit
  // only owner and admin - for now
  permissionsEdit: 'permissionsEdit',
}

const groupNames = {
  systemAdmin: 'systemAdmin',
  surveyAdmin: 'surveyAdmin',
  surveyEditor: 'surveyEditor',
  dataEditor: 'dataEditor',
  dataCleanser: 'dataCleanser',
  dataAnalyst: 'dataAnalyst',
  guest: 'guest',
}

module.exports = {
  permissions,
  groupNames,
}
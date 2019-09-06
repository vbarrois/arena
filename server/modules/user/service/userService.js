const fs = require('fs')

const passwordGenerator = require('generate-password')

const aws = require('../../../system/aws')

const UserManager = require('../manager/userManager')
const AuthManager = require('../../auth/manager/authManager')
const SurveyManager = require('../../survey/manager/surveyManager')

const Survey = require('../../../../common/survey/survey')
const User = require('../../../../common/user/user')
const AuthGroups = require('../../../../common/auth/authGroups')
const Authorizer = require('../../../../common/auth/authorizer')

const SystemError = require('../../../utils/systemError')
const UnauthorizedError = require('../../../utils/unauthorizedError')
const Mailer = require('../../../utils/mailer')

// ====== CREATE

const inviteUser = async (user, surveyId, email, groupUuid, serverUrl, i18n) => {
  const group = await AuthManager.fetchGroupByUuid(groupUuid)

  // Only system admins can invite new system admins
  if (!User.isSystemAdmin(user) && AuthGroups.isSystemAdminGroup(group)) {
    throw new UnauthorizedError(User.getName(user))
  }

  // If the survey is not published, only survey admins and system admins can be invited
  const survey = await SurveyManager.fetchSurveyById(surveyId)
  const surveyInfo = Survey.getSurveyInfo(survey)
  const surveyLabel = Survey.getLabel(surveyInfo)
  const isPublished = Survey.isPublished(surveyInfo)

  if (!isPublished && !(AuthGroups.isSystemAdminGroup(group) || Survey.isAuthGroupAdmin(group)(surveyInfo))) {
    throw new UnauthorizedError(User.getName(user))
  }

  const dbUser = await UserManager.fetchUserByEmail(email)
  const groupName = AuthGroups.getName(Authorizer.getSurveyUserGroup(user, surveyInfo))
  const groupLabel = `$t(authGroups.${groupName}.label)`
  if (dbUser) {
    const newUserGroups = User.getAuthGroups(dbUser)
    const hasRoleInSurvey = newUserGroups.some(g => AuthGroups.getSurveyUuid(g) === Survey.getUuid(surveyInfo))

    if (hasRoleInSurvey) {
      throw new SystemError('userHasRole')
    }
    if (User.isSystemAdmin(dbUser)) {
      throw new SystemError('userIsAdmin')
    }

    await Promise.all([
      UserManager.addUserToGroup(user, surveyId, groupUuid, dbUser),
      Mailer.sendEmail(email, 'emails.userInvite', { serverUrl, surveyLabel, groupLabel }, i18n),
    ])
  } else {
    const password = passwordGenerator.generate({ length: 8, numbers: true, uppercase: true, strict: true })
    const { User: { Username: userUuid } } = await aws.inviteUser(email, password)

    const msgParams = { serverUrl, email, password, surveyLabel, groupLabel, temporaryPasswordMsg: password ? '$t(emails.userInvite.temporaryPasswordMsg)' : '' }
    await Promise.all([
      Mailer.sendEmail(email, 'emails.userInvite', msgParams, i18n),
      UserManager.insertUser(user, surveyId, userUuid, email, groupUuid)
    ])
  }
}

// ====== READ

const fetchUsersBySurveyId = async (user, surveyId, offset, limit) => {
  const fetchSystemAdmins = User.isSystemAdmin(user)

  return await UserManager.fetchUsersBySurveyId(surveyId, offset, limit, fetchSystemAdmins)
}

const countUsersBySurveyId = async (user, surveyId) => {
  const countSystemAdmins = User.isSystemAdmin(user)

  return await UserManager.countUsersBySurveyId(surveyId, countSystemAdmins)
}

// ====== UPDATE

const updateUser = async (user, surveyId, userUuid, name, email, groupUuid, file) => {
  const survey = await SurveyManager.fetchSurveyById(surveyId)
  const surveyInfo = Survey.getSurveyInfo(survey)
  const userToUpdate = await UserManager.fetchUserByUuid(userUuid)
  const groupToUpdate = Authorizer.getSurveyUserGroup(userToUpdate, surveyInfo)

  if (AuthGroups.getUuid(groupToUpdate) !== groupUuid && !Authorizer.canEditUserGroup(user, surveyInfo, userToUpdate)) {
    throw new UnauthorizedError(User.getName(user))
  }

  // Check if email has changed
  const oldEmail = User.getEmail(userToUpdate)
  if (oldEmail !== email) {
    const canEditEmail = Authorizer.canEditUserEmail(user, Survey.getSurveyInfo(survey), userToUpdate)

    // Throw exception if user is not allowed
    if (!canEditEmail) {
      throw new UnauthorizedError(User.getName(user))
    }

    // Send aws a email update request if changed
    await aws.updateEmail(oldEmail, email)
  }

  // Get profile picture
  const profilePicture = file ? fs.readFileSync(file.tempFilePath) : null
  return await UserManager.updateUser(user, surveyId, userUuid, name, email, groupUuid, profilePicture)
}

const updateUsername = async (user, userUuid, name) => {
  // For now a user can change only his own name
  if (User.getUuid(user) !== userUuid) {
    throw new UnauthorizedError(User.getName(user))
  }

  await UserManager.updateUsername(user, name)
}

module.exports = {
  // ==== User
  // CREATE
  inviteUser,

  // READ
  countUsersBySurveyId,
  fetchUsersBySurveyId,
  fetchUserByUuid: UserManager.fetchUserByUuid,
  fetchUserProfilePicture: UserManager.fetchUserProfilePicture,

  // UPDATE
  updateUser,
  updateUsername,

  // DELETE
  deleteUser: UserManager.deleteUser,

  // ==== User prefs
  updateUserPref: UserManager.updateUserPref,
  deleteUserPref: UserManager.deleteUserPref,
}
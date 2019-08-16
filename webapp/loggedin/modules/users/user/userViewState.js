import React, { useEffect, useState } from 'react'
import * as R from 'ramda'

import useI18n from '../../../../commonComponents/useI18n'

import User from '../../../../../common/user/user'
import Survey from '../../../../../common/survey/survey'
import AuthGroups from '../../../../../common/auth/authGroups'

import UserValidator from '../../../../../common/user/userValidator'
import {
  useAsyncGetRequest,
  useAsyncPostRequest,
  useAsyncPutRequest,
  useFormObject,
  useOnUpdate
} from '../../../../commonComponents/hooks'

import Authorizer from '../../../../../common/auth/authorizer'

import { appModuleUri, userModules } from '../../../appModules'

export const useUserViewState = props => {
  const {
    user, survey, userUuidUrlParam, groups: groupsProps,
    showAppLoader, hideAppLoader, showNotificationMessage,
    history,
  } = props

  const i18n = useI18n()

  const isInvitation = !userUuidUrlParam
  const surveyId = Survey.getId(survey)

  const { data: userToUpdate = {}, dispatch: fetchUser } = useAsyncGetRequest(
    `/api/survey/${surveyId}/user/${userUuidUrlParam}`,
    {}
  )

  const isNewUser = !userToUpdate.name
  const [loaded, setLoaded] = useState(isInvitation)

  const [editPermissions, setEditPermissions] = useState({
    user: isNewUser,
    userName: false,
    userGroupAndEmail: false,
  })

  const validationFn = isNewUser ? UserValidator.validateNewUser : UserValidator.validateUser(editPermissions.userName)
  const {
    object: formObject, objectValid,
    setObjectField, enableValidation, getFieldValidation,
  } = useFormObject({ name: '', email: '', groupUuid: null }, validationFn, false)

  const [surveyGroups, setSurveyGroups] = useState([])

  // init groups
  useEffect(() => {
    setSurveyGroups(groupsProps.map(g => ({
      uuid: AuthGroups.getUuid(g),
      label: i18n.t(`authGroups.${AuthGroups.getName(g)}.label`)
    })))
  }, [])

  const setName = name => setObjectField('name', name)

  const setEmail = email => setObjectField('email', email)

  const setGroup = group => {
    const groupUuid = AuthGroups.getUuid(group)
    setObjectField('groupUuid', groupUuid)
  }

  useEffect(() => {
    if (!isInvitation) {
      fetchUser()
    }
  }, [])

  useEffect(() => {
    if (!R.isEmpty(userToUpdate)) {
      const { name, email } = userToUpdate

      // look for current survey's group in returned user object
      const userGroup = Authorizer.isSystemAdmin(userToUpdate)
        ? User.getAuthGroups(userToUpdate)[0]
        : Authorizer.getSurveyUserGroup(userToUpdate, Survey.getSurveyInfo(survey))

      // Name can be null if user has not accepted the invitation
      setName(isNewUser ? undefined : name)
      setEmail(email)
      setGroup(userGroup)

      setLoaded(true)
    }
  }, [userToUpdate])

  useEffect(() => {
    if (loaded) {
      const canEdit = Authorizer.canEditUser(user, Survey.getSurveyInfo(survey), userToUpdate)
      const canEditName = canEdit && User.getName(userToUpdate) !== null

      enableValidation(canEdit)
      setEditPermissions({
        user: canEdit,
        userName: canEditName,
        userGroupAndEmail: isInvitation || Authorizer.canEditUserGroupAndEmail(user, Survey.getSurveyInfo(survey), userToUpdate),
      })
    }
  }, [loaded])

  const {
    dispatch: saveUser,
    data: userSaveResponse,
    error: userSaveError,
  } = isInvitation
    ? useAsyncPostRequest(`/api/survey/${surveyId}/users/invite`, R.omit(['name'], formObject))
    : useAsyncPutRequest(`/api/survey/${surveyId}/user/${User.getUuid(userToUpdate)}`, formObject)

  useOnUpdate(() => {
    hideAppLoader()
    if (userSaveResponse) {
      history.push(appModuleUri(userModules.users))
      if (isInvitation) {
        showNotificationMessage('usersView.inviteUserConfirmation', { email: formObject.email })
      } else {
        showNotificationMessage('usersView.updateUserConfirmation', { name: formObject.name })
      }
    }
  }, [userSaveResponse, userSaveError])

  const sendRequest = () => {
    showAppLoader()
    saveUser()
  }

  return {
    loaded,

    isNewUser,
    isInvitation,

    canEdit: editPermissions.user,
    canEditName: editPermissions.userName,
    canEditGroupAndEmail: editPermissions.userGroupAndEmail,

    name: formObject.name,
    email: formObject.email,
    group: surveyGroups.find(R.propEq('uuid', formObject.groupUuid)),
    surveyGroups,
    objectValid,

    getFieldValidation,
    setName,
    setEmail,
    setGroup,
    sendRequest,
  }
}

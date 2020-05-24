import './appHeader.scss'

import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as User from '@core/user/user'
import * as Survey from '@core/survey/survey'

import { usePrevious, useUser, useSurveyCycleKey, useI18n, useSurveyInfo } from '@webapp/commonComponents/hooks'
import ProfilePicture from '@webapp/commonComponents/profilePicture'
import ProgressBar from '@webapp/commonComponents/progressBar'

import * as AppState from '@webapp/app/appState'

import { updateUserPrefs } from '@webapp/app/actions'
import { publishSurvey } from '@webapp/survey/actions'
import UserPopupMenu from './components/userPopupMenu'
import CycleSelector from './components/cycleSelector'

const AppHeader = () => {
  const dispatch = useDispatch()
  const user = useUser()
  const i18n = useI18n()
  const { lang } = i18n
  const appSaving = useSelector(AppState.isSaving)
  const surveyInfo = useSurveyInfo()
  const surveyCycleKey = useSurveyCycleKey()

  const [showUserPopup, setShowUserPopup] = useState(false)
  const toggleShowUserPopup = () => setShowUserPopup((showUserPopupPrev) => !showUserPopupPrev)

  const prevUser = usePrevious(user)
  const pictureUpdateKeyRef = useRef(0)

  pictureUpdateKeyRef.current += prevUser !== user

  return (
    <div className="app-header">
      <div className="app-header__logo">
        <a href="http://www.openforis.org" target="_blank" rel="noopener noreferrer">
          <img src="/img/of_icon_black.png" alt="Open Foris" />
        </a>
      </div>

      <div className="app-header__survey">
        {Survey.isValid(surveyInfo) &&
          (appSaving ? (
            <ProgressBar className="running progress-bar-striped" progress={100} showText={false} />
          ) : (
            <>
              <div>{Survey.getLabel(surveyInfo, lang)}</div>
              <CycleSelector
                surveyInfo={surveyInfo}
                surveyCycleKey={surveyCycleKey}
                onChange={(cycle) => {
                  const surveyId = Survey.getIdSurveyInfo(surveyInfo)
                  const userUpdated = User.assocPrefSurveyCycle(surveyId, cycle)(user)
                  dispatch(updateUserPrefs(userUpdated))
                }}
              />
              {Survey.isDraft(surveyInfo) && (
                <button
                  type="button"
                  className="btn btn-s btn-secondary btn-publish"
                  onClick={() => dispatch(publishSurvey())}
                >
                  <span className="icon icon-warning icon-left icon-10px" />
                  {i18n.t('common.publish')}
                </button>
              )}
            </>
          ))}
      </div>

      <div
        className="app-header__user"
        onClick={toggleShowUserPopup}
        onKeyDown={toggleShowUserPopup}
        role="button"
        tabIndex="0"
      >
        <ProfilePicture userUuid={User.getUuid(user)} forceUpdateKey={pictureUpdateKeyRef.current} thumbnail />

        <button type="button" className="btn btn-transparent">
          <span className="icon icon-ctrl" />
        </button>
      </div>

      {showUserPopup && <UserPopupMenu onClose={() => setShowUserPopup(false)} />}
    </div>
  )
}

export default AppHeader

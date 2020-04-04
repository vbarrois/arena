import './surveyInfoView.scss'

import React from 'react'

import { useAuthCanEditSurvey, useI18n, useSurveyInfo } from '@webapp/commonComponents/hooks'

import { Input } from '@webapp/commonComponents/form/input'
import * as Survey from '@core/survey/survey'
import LabelsEditor from '../../../surveyViews/labelsEditor/labelsEditor'
import LanguagesEditor from './components/languagesEditor'
import SrsEditor from './components/srsEditor'
import CyclesEditor from './components/cyclesEditor'
import { useSurveyInfoViewState } from './components/surveyInfoViewState'

const SurveyInfoView = () => {
  const surveyInfo = useSurveyInfo()
  const readOnly = !useAuthCanEditSurvey()

  const i18n = useI18n()

  const {
    name,
    languages,
    srs,
    labels,
    descriptions,
    cycles,
    setName,
    setLanguages,
    setSrs,
    setLabels,
    setDescriptions,
    setCycles,
    getFieldValidation,
    saveProps,
  } = useSurveyInfoViewState()

  return (
    <div className="home-survey-info">
      <div className="form">
        <div className="form-item">
          <label className="form-label" htmlFor="survey-info-name">
            {i18n.t('common.name')}
          </label>
          <Input
            id="survey-info-name"
            value={name}
            validation={getFieldValidation(Survey.infoKeys.name)}
            onChange={setName}
            readOnly={readOnly}
          />
        </div>

        <LabelsEditor readOnly={readOnly} languages={languages} labels={labels} onChange={setLabels} />

        <LabelsEditor
          readOnly={readOnly}
          formLabelKey="common.description"
          languages={languages}
          labels={descriptions}
          onChange={setDescriptions}
        />

        <LanguagesEditor readOnly={readOnly} languages={languages} setLanguages={setLanguages} />

        <div className="form-item">
          <label className="form-label" htmlFor="survey-info-srs">
            {i18n.t('common.srs')}
          </label>
          <SrsEditor readOnly={readOnly} srs={srs} setSrs={setSrs} validation={getFieldValidation('srs')} />
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="survey-info-cycles">
            {i18n.t('common.cycle_plural')}
          </label>
          <CyclesEditor
            readOnly={readOnly}
            cycles={cycles}
            setCycles={setCycles}
            surveyInfo={surveyInfo}
            validation={getFieldValidation(Survey.infoKeys.cycles)}
          />
        </div>

        {!readOnly && (
          <button className="btn btn-save" type="button" onClick={saveProps}>
            <span className="icon icon-floppy-disk icon-12px icon-left" />
            {i18n.t('common.save')}
          </button>
        )}
      </div>
    </div>
  )
}

export default SurveyInfoView

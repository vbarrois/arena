import axios from 'axios'
import { useDispatch } from 'react-redux'

import { SurveyActions } from '@webapp/store/survey'

export const useOnCreate = ({ newSurvey, setNewSurvey }) => {
  const dispatch = useDispatch()

  return () => {
    ;(async () => {
      const { name, label, lang } = newSurvey

      const {
        data: { survey, validation },
      } = await axios.post('/api/survey', { name, label, lang })

      if (survey) {
        dispatch(SurveyActions.createSurvey({ survey }))
      } else {
        setNewSurvey({
          ...newSurvey,
          validation,
        })
      }
    })()
  }
}

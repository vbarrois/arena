import * as R from 'ramda'
import * as SurveyState from '../state'

export const stateKey = 'status'

const keys = {
  defsFetched: 'defsFetched',
  defsDraftFetched: 'defsDraftFetched',
}

const getStatus = R.pipe(SurveyState.getSurvey, R.propOr(false, stateKey))

const _areDefsFetched = R.pipe(getStatus, R.propEq(keys.defsFetched, true))
const _areDefsDraftFetched = R.pipe(getStatus, R.propEq(keys.defsDraftFetched, true))

export const areDefsFetched = (draft) => (state) => _areDefsFetched(state) && _areDefsDraftFetched(state) === draft

export const assocDefsFetched = (draft) =>
  R.pipe(R.assoc(keys.defsFetched, true), R.assoc(keys.defsDraftFetched, draft))

export const resetDefsFetched = R.pipe(R.assoc(keys.defsFetched, false), R.assoc(keys.defsDraftFetched, false))

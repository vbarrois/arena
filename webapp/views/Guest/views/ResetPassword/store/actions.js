import * as actionTypes from './actionTypes'

export const initUser = ({ name, email }) => (dispatch) =>
  dispatch({
    type: actionTypes.USER_INIT,
    payload: { name, email },
  })

export const updateUser = (event) => (dispatch) =>
  dispatch({
    type: actionTypes.USER_UPDATE,
    payload: { [event.target.name]: event.target.value },
  })

export const updateError = (error) => (dispatch) =>
  dispatch({
    type: actionTypes.ERROR_UPDATE,
    payload: { error },
  })

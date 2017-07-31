import { RECEIVE_ERROR, DISMISS_ERROR } from '../constants'

export const receiveError = error => ({
  error,
  type: RECEIVE_ERROR
})

export const dismissError = () => ({
  type: DISMISS_ERROR
})

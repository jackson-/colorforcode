import { RECEIVE_ALERT, DISMISS_ALERT } from '../constants'

export const receiveAlert = alert => ({
  alert,
  type: RECEIVE_ALERT
})

export const dismissAlert = () => ({
  type: DISMISS_ALERT
})

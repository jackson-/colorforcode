import { RECEIVE_ALERT, DISMISS_ALERT } from './constants'

// if action.error, it will be an object with status (optional) and message
const alertReducer = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_ALERT: return action.alert
    case DISMISS_ALERT: return null
    default: return state
  }
}

export default alertReducer

// example loading reducer, useful for UI state changes like button text
// and loading animations

import {
  REQUEST_JOBS,
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  RECEIVE_JOBS,
  REQUEST_JOB,
  DONE_LOADING
} from './constants'

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case DONE_LOADING: return false
    case REQUEST_JOBS: return true
    case REQUEST_JOB: return true
    case CREATE_JOB: return true
    case UPDATE_JOB: return true
    case DELETE_JOB: return true
    case RECEIVE_JOBS: return false
    default: return state
  }
}

export default loadingReducer

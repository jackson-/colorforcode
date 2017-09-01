// example loading reducer, useful for UI state changes like button text
// and loading animations

import { CREATE_JOB, UPDATE_JOB, DELETE_JOB, RECEIVE_SKILLS,
         AUTHENTICATED, CREATE_USER, UPDATE_USER, DELETE_USER,
         BEGIN_UPLOADING, DONE_UPLOADING, CREATE_PROJECT } from './constants'

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case CREATE_JOB: return action.loading
    case UPDATE_JOB: return action.loading
    case DELETE_JOB: return action.loading
    case RECEIVE_SKILLS: return action.loading
    case BEGIN_UPLOADING: return action.loading
    case DONE_UPLOADING: return action.loading

    case CREATE_USER: return action.loading
    case UPDATE_USER: return action.loading
    case DELETE_USER: return action.loading
    case AUTHENTICATED: return action.loading
    case CREATE_PROJECT: return action.loading

    default: return state
  }
}

export default loadingReducer

// example loading reducer, useful for UI state changes like button text
// and loading animations

import { REQUEST_ALL_JOBS, REQUEST_JOB, CREATE_JOB,
         UPDATE_JOB, DELETE_JOB, RECEIVE_JOBS,
         RECEIVE_ALL_USERS, AUTHENTICATED,
         CREATE_USER, UPDATE_USER, DELETE_USER, REQUEST_ALL_USERS,
         RECEIVE_ALL_SKILLS, BEGIN_UPLOADING, DONE_UPLOADING,
         CREATE_PROJECT } from './constants'

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return action.loading
    case REQUEST_JOB: return action.loading
    case CREATE_JOB: return action.loading
    case UPDATE_JOB: return action.loading
    case DELETE_JOB: return action.loading
    case RECEIVE_JOBS: return action.loading
    case RECEIVE_ALL_SKILLS: return action.loading
    case BEGIN_UPLOADING: return action.loading
    case DONE_UPLOADING: return action.loading

    case REQUEST_ALL_USERS: return action.loading
    case CREATE_USER: return action.loading
    case UPDATE_USER: return action.loading
    case DELETE_USER: return action.loading
    case RECEIVE_ALL_USERS: return action.loading
    case AUTHENTICATED: return action.loading
    case CREATE_PROJECT: return action.loading

    default: return state
  }
}

export default loadingReducer

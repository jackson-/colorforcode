import { RECEIVE_ALL_JOBS, RECEIVE_JOB, RECEIVE_USER_JOBS, RECEIVE_APPLIED_JOBS } from './constants'

const initialState = {
  all: null,
  currentJob: null,
  user_jobs:null,
  applied_jobs:null
}

const jobsReducer = (state=initialState, action) => {
  switch (action.type) {
    case RECEIVE_JOB: return {
      // all: [...state.all],
      currentJob: action.job
    }
    case RECEIVE_ALL_JOBS: return {
      // currentJob: {...state.currentJob} || null,
      all: action.jobs
    }
    case RECEIVE_USER_JOBS: return {
      user_jobs: action.jobs,
    }
    case RECEIVE_APPLIED_JOBS: return {
      user_jobs: action.jobs,
    }
    default: return state
  }
}

export default jobsReducer

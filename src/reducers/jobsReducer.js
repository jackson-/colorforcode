import { RECEIVE_JOBS, RECEIVE_JOB, RECEIVE_USER_JOBS, RECEIVE_APPLIED_JOBS } from './constants'

const initialState = {
  all: null,
  currentJob: null,
  user_jobs: null,
  applied_jobs: null,
  total:null,
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_JOB: return {
      currentJob: action.job
    }
    case RECEIVE_JOBS: return {
      all: action.jobs.hits,
      total:action.jobs.total
    }
    case RECEIVE_USER_JOBS: return {
      user_jobs: action.jobs
    }
    case RECEIVE_APPLIED_JOBS: return {
      user_jobs: action.jobs
    }
    default: return state
  }
}

export default jobsReducer

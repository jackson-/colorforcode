import { RECEIVE_ALL_JOBS, RECEIVE_JOB, RECEIVE_USER_JOBS } from './constants'

const initialState = {
  all: [],
  currentJob: null,
  user_jobs:[]
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
    default: return state
  }
}

export default jobsReducer

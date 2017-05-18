import { RECEIVE_ALL_JOBS, RECEIVE_JOB } from './constants'

const initialState = {
  all: [],
  currentJob: null
}

const jobsReducer = (state=initialState, action) => {
  switch (action.type) {
    case RECEIVE_JOB: return {
      all: [...state.all],
      currentJob: action.job
    }
    case RECEIVE_ALL_JOBS: return {
      currentJob: {...state.currentJob} || null,
      all: action.jobs
    }

    default: return state
  }
}

export default jobsReducer

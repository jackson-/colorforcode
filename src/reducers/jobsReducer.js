import { RECEIVE_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB,
         REQUEST_FILTERED_JOBS } from './constants'

const initialState = {
  all: null,
  currentJob: null
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_JOB: return {
      currentJob: action.job,
      all: state.all ? [...state.all] : null
    }
    case RECEIVE_JOBS: return {
      fetching: false,
      all: action.jobs.hits
    }
    case REQUEST_JOB: return {
      fetchingJob: true,
      all: state.all ? [...state.all] : null
    }
    case REQUEST_ALL_JOBS: return {
      fetching: true
    }

    case REQUEST_FILTERED_JOBS: return {
      fetching: true
    }

    default: return state
  }
}

export default jobsReducer

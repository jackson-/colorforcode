import {
  RECEIVE_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB,
  REQUEST_FILTERED_JOBS, CREATE_JOB, UPDATE_JOB, DELETE_JOB } from './constants'

const initialState = {
  all: null,
  currentJob: null,
  fetching: false, // all jobs
  fetchingJob: false
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return {
      fetching: true,
      all: state.all ? [...state.all] : null
    }
    case REQUEST_FILTERED_JOBS: return {
      fetching: true,
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
    case RECEIVE_JOB: return {
      fetching: false,
      currentJob: action.job,
      all: state.all ? [...state.all] : null
    }
    case CREATE_JOB: return {
      fetching: false,
      fetchingJob: true,
      all: state.all ? [...state.all] : null
    }
    case UPDATE_JOB: return {
      fetching: false,
      currentJob: {...state.job} || null,
      fetchingJob: true,
      all: state.all ? [...state.all] : null
    }
    case DELETE_JOB: return {
      fetching: false,
      currentJob: {...state.job} || null,
      fetchingJob: true,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default jobsReducer

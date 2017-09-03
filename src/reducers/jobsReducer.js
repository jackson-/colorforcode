import {
  RECEIVE_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB,
  REQUEST_FILTERED_JOBS, CREATE_JOB, UPDATE_JOB, DELETE_JOB } from './constants'

const initialState = {
  fetchingAll: false,
  all: null,
  fetchingSelected: false,
  selected: null
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null
    }
    case REQUEST_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null
    }
    case RECEIVE_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.jobs.hits
    }
    case REQUEST_JOB: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }
    case RECEIVE_JOB: return {
      fetchingSelected: false,
      selected: action.job,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }
    case CREATE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }
    case UPDATE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }
    case DELETE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default jobsReducer

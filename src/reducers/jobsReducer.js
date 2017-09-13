import {
  RECEIVE_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB, RECEIVE_FILTERED_JOBS,
  REQUEST_FILTERED_JOBS, CREATE_JOBS, UPDATE_JOB, DELETE_JOB } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null,
  filteredJobs: null,
  filtered: false
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false
    }
    case RECEIVE_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.jobs,
      filteredJobs: null,
      filtered: false
    }
    case REQUEST_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredJobs: null,
      filtered: state.filteredJobs === null
    }
    case RECEIVE_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: action.jobs,
      filtered: true
    }
    case REQUEST_JOB: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: state.filteredJobs !== null
    }
    case RECEIVE_JOB: return {
      fetchingSelected: false,
      selected: action.job,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: state.filteredJobs !== null
    }
    case CREATE_JOBS: return {
      fetchingSelected: false,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false
    }
    case UPDATE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false
    }
    case DELETE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false
    }

    default: return state
  }
}

export default jobsReducer

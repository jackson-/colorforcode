import {
  RECEIVE_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB, RECEIVE_FILTERED_JOBS,
  REQUEST_FILTERED_JOBS, CREATE_JOBS, UPDATE_JOB, DELETE_JOB } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null,
  filtered: null
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case RECEIVE_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.jobs,
      filtered: null
    }
    case REQUEST_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filtered: null
    }
    case RECEIVE_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: action.jobs
    }
    case REQUEST_JOB: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case RECEIVE_JOB: return {
      fetchingSelected: false,
      selected: action.job,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case CREATE_JOBS: return {
      fetchingSelected: false,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case UPDATE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case DELETE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }

    default: return state
  }
}

export default jobsReducer

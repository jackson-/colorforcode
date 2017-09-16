import {
  RECEIVE_ALL_JOBS, RECEIVE_JOB, REQUEST_ALL_JOBS, REQUEST_JOB,
  RECEIVE_FILTERED_JOBS, REQUEST_FILTERED_JOBS, CREATE_JOBS,
  PAGINATE_JOBS, UPDATE_JOB, DELETE_JOB } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null,
  filteredJobs: null,
  filtered: false,
  filter: null, // we persist user's search parameters between navigations to/from home and job detail pages
  offset: 0,
  pageNum: 1
}

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case RECEIVE_ALL_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.jobs,
      filteredJobs: null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case REQUEST_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredJobs: null,
      filtered: state.filteredJobs !== null,
      filter: action.filter,
      offset: 0,
      pageNum: 1
    }
    case RECEIVE_FILTERED_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: action.jobs,
      filtered: true,
      filter: {...state.filter},
      offset: 0,
      pageNum: 1
    }
    case PAGINATE_JOBS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: state.filteredJobs !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: action.offset,
      pageNum: action.pageNum
    }
    case REQUEST_JOB: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: state.filteredJobs !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: state.offset,
      pageNum: state.pageNum
    }
    case RECEIVE_JOB: return {
      fetchingSelected: false,
      selected: action.job,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: state.filteredJobs !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: state.offset,
      pageNum: state.pageNum
    }
    case CREATE_JOBS: return {
      fetchingSelected: false,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case UPDATE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case DELETE_JOB: return {
      fetchingSelected: true,
      selected: state.selected ? {...state.selected} : null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredJobs: state.filteredJobs ? [...state.filteredJobs] : null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }

    default: return state
  }
}

export default jobsReducer

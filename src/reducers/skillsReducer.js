import {
  RECEIVE_SKILLS, RECEIVE_PROJECT, RECEIVE_JOB,
  RECEIVE_JOBS, REQUEST_ALL_SKILLS, RECEIVE_SELECTED_SKILLS } from './constants'

const initialState = {
  all: null,
  selected: null
}

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_SKILLS: return {
      fetching: true,
      all: null,
      selected: state.selected ? [...state.selected] : null
    }
    case RECEIVE_SKILLS: return {
      fetching: false,
      all: action.skills,
      selected: state.selected ? [...state.selected] : null
    }
    case RECEIVE_SELECTED_SKILLS: return {
      all: state.all ? [...state.all] : null,
      selected: action.selected
    }
    case RECEIVE_PROJECT: return {
      all: action.skills,
      selected: [...action.project.skills] || null
    }
    case RECEIVE_JOB: return {
      all: action.skills,
      selected: [...action.job.skills] || null
    }
    case RECEIVE_JOBS: return {
      all: action.skills,
      selected: null
    }

    default: return state
  }
}

export default skillsReducer

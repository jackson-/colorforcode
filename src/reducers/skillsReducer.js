import {
  RECEIVE_SKILLS, RECEIVE_PROJECT, RECEIVE_JOB,
  REQUEST_ALL_SKILLS, RECEIVE_SELECTED_SKILLS } from './constants'

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
      all: action.skills.all ? action.skills.all : ([...state.all] || null),
      selected: action.skills.selected
    }
    case RECEIVE_JOB: return {
      all: action.skills,
      selected: [...action.job.skills] || null
    }

    default: return state
  }
}

export default skillsReducer

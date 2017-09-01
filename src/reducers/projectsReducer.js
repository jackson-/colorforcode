import { RECEIVE_ALL_PROJECTS, RECEIVE_PROJECT } from './constants'

const initialState = {
  all: [],
  currentProject: null
}

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_PROJECT: return {
      all: [...state.all] || [],
      currentProject: action.project
    }
    case RECEIVE_ALL_PROJECTS: return {
      all: action.projects,
      currentProject: null
    }
    default: return state
  }
}

export default projectsReducer

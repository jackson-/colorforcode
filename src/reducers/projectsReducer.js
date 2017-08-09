import { RECEIVE_ALL_PROJECTS, RECEIVE_PROJECT, AUTHENTICATED } from './constants'

const initialState = {
  all: [],
  currentProject: null
}

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED: return {
      all: action.user.projects,
      currentProject: null
    }
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

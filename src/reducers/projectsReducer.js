import { RECEIVE_ALL_PROJECTS, RECEIVE_PROJECT } from './constants'

const initialState = {
  all: null,
  currentProject: null,
}

const projectsReducer = (state=initialState, action) => {
  switch (action.type) {
    case RECEIVE_PROJECT: return {
      currentProject: action.project
    }
    case RECEIVE_ALL_PROJECTS: return {
      all: action.projects
    }
    default: return state
  }
}

export default projectsReducer

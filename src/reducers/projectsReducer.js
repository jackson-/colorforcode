import {
  RECEIVE_PROJECT, REQUEST_PROJECT,
  CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from './constants'

const initialState = {
  currentProject: null,
  fetchingProject: false
}

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_PROJECT: return {
      currentProject: null,
      fetchingProject: true
    }
    case RECEIVE_PROJECT: return {
      fetchingProject: false,
      currentProject: action.project
    }
    case UPDATE_PROJECT: return {
      currentProject: {...state.currentProject},
      fetchingProject: true
    }
    case CREATE_PROJECT: return {
      currentProject: {...state.currentProject},
      fetchingProject: false
    }
    case DELETE_PROJECT: return {
      currentProject: {...state.currentProject},
      fetchingProject: false
    }
    default: return state
  }
}

export default projectsReducer

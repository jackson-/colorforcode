import {
  RECEIVE_USERS, REQUEST_ALL_USERS, RECEIVE_USER, REQUEST_USER, REQUEST_FILTERED_USERS } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null
    }
    case REQUEST_FILTERED_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null
    }
    case RECEIVE_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.users
    }
    case REQUEST_USER: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }
    case RECEIVE_USER: return {
      fetchingSelected: false,
      selected: action.selected,
      fetchingAll: false,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default usersReducer

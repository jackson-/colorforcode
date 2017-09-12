import {
  RECEIVE_USERS, REQUEST_ALL_USERS, RECEIVE_USER,
  REQUEST_USER, REQUEST_FILTERED_USERS, RECEIVE_FILTERED_USERS } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null,
  filtered: null
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case RECEIVE_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.users,
      filtered: null
    }
    case REQUEST_FILTERED_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filtered: null
    }
    case RECEIVE_FILTERED_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: action.users
    }
    case REQUEST_USER: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }
    case RECEIVE_USER: return {
      fetchingSelected: false,
      selected: action.selected,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filtered: state.filtered ? [...state.filtered] : null
    }

    default: return state
  }
}

export default usersReducer

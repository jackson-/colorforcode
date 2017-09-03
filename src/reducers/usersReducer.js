import {
  RECEIVE_USERS, REQUEST_ALL_USERS, RECEIVE_USER, REQUEST_USER, REQUEST_FILTERED_USERS } from './constants'

const initialState = {
  selected: null,
  fetching: false, // all
  fetchingUser: false,
  authenticating: false
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_USERS: return {
      fetchingUser: false,
      fetching: true,
      all: state.all ? [...state.all] : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_FILTERED_USERS: return {
      fetchingUser: false,
      fetching: true,
      all: state.all ? [...state.all] : null,
      selected: state.selected ? {...state.selected} : null
    }
    case RECEIVE_USERS: return {
      fetching: false,
      fetchingUser: false,
      all: action.users,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_USER: return {
      fetchingUser: true,
      fetching: false,
      all: state.all ? [...state.all] : null,
      selected: null
    }
    case RECEIVE_USER: return {
      fetching: false,
      fetchingUser: false,
      selected: action.selected,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default usersReducer

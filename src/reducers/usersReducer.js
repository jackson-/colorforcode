import { RECEIVE_USERS, AUTHENTICATED, REQUEST_ALL_USERS,
         RECEIVE_USER, REQUEST_USER, REQUEST_FILTERED_USERS } from './constants'

const initialState = {
  all: null,
  currentUser: null,
  selected: null
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USERS: return {
      fetching: false,
      fetchingUser: false,
      all: action.users,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case AUTHENTICATED: return {
      fetchingUser: false,
      currentUser: action.user,
      all: state.all ? [...state.all] : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_ALL_USERS: return {
      fetchingUser: false,
      fetching: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_FILTERED_USERS: return {
      fetchingUser: false,
      fetching: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_USER: return {
      fetchingUser: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      all: state.all ? [...state.all] : null,
      selected: null
    }
    case RECEIVE_USER: return {
      fetchingUser: false,
      selected: action.selected,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default usersReducer

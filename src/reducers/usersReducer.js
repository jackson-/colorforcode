import { RECEIVE_USERS, AUTHENTICATED, REQUEST_ALL_USERS,
         RECEIVE_USER, REQUEST_USER, REQUEST_FILTERED_USERS,
         AUTHENTICATING } from './constants'

const initialState = {
  all: null,
  currentUser: null,
  selected: null
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USERS: return {
      authenticating: state.authenticating || false,
      fetching: false,
      fetchingUser: false,
      all: action.users,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case AUTHENTICATED: return {
      authenticating: false,
      fetching: state.fetching || false,
      fetchingUser: state.fetchingUser || false,
      currentUser: action.user,
      all: state.all ? [...state.all] : null,
      selected: state.selected ? {...state.selected} : null
    }
    case AUTHENTICATING: return {
      authenticating: true,
      fetching: state.fetching || false,
      fetchingUser: state.fetchingUser || false,
      currentUser: state.currentUser ? state.currentUser : null,
      all: state.all ? [...state.all] : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_ALL_USERS: return {
      authenticating: state.authenticating || false,
      fetchingUser: false,
      fetching: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_FILTERED_USERS: return {
      authenticating: state.authenticating || false,
      fetchingUser: false,
      fetching: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      selected: state.selected ? {...state.selected} : null
    }
    case REQUEST_USER: return {
      authenticating: state.authenticating || false,
      fetchingUser: true,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      all: state.all ? [...state.all] : null,
      selected: null
    }
    case RECEIVE_USER: return {
      authenticating: state.authenticating || false,
      fetchingUser: false,
      selected: action.selected,
      currentUser: state.currentUser ? {...state.currentUser} : null,
      all: state.all ? [...state.all] : null
    }

    default: return state
  }
}

export default usersReducer

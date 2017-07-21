import { RECEIVE_ALL_USERS, AUTHENTICATED, RECEIVE_USER } from './constants'

const initialState = {
  all: [],
  currentUser: null,
  selected:null,
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ALL_USERS: return {
      all: action.users,
      currentUser: {...state.currentUser} || null
    }

    case AUTHENTICATED: return {
      all: [...state.all],
      currentUser: action.user
    }

    case RECEIVE_USER: return {
      all: [...state.all],
      selected: action.selected,
      currentUser: {...state.currentUser} || null
    }

    default: return state
  }
}

export default usersReducer

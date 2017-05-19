import { RECEIVE_ALL_USERS, AUTHENTICATED } from './constants'

const initialState = {
  all: [],
  currentUser: null
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

    default: return state
  }
}

export default usersReducer

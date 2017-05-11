import { RECEIVE_USERS } from './constants'

const defaultState = {
  all:[],
  current:null
}

const jobsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_USERS: return {all:action.users}
    default: return state
  }
}

export default jobsReducer

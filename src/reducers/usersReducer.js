import { RECEIVE_USERS, RECEIVE_USER } from './constants'

const defaultState = {
  all:[],
  current:null
}

const jobsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_USERS: return {all:action.users}
    case RECEIVE_USER: {console.log("ACTION", action)
      return {current:action.user}}
    default: return state
  }
}

export default jobsReducer

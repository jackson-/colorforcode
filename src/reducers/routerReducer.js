import { RECEIVE_ROUTER_STATE } from './constants'

const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ROUTER_STATE: return action.router

    default: return state
  }
}

export default routerReducer

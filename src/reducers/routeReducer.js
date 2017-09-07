import { RECEIVE_DASH_LOCATION, RECEIVE_NEXT_ROUTE } from './constants'

export const receiveDashLocation = dashLocation => ({
  dashLocation,
  type: RECEIVE_DASH_LOCATION
})

export const receiveNextRoute = nextRoute => ({
  nextRoute,
  type: RECEIVE_NEXT_ROUTE
})

const initialState = {
  dashLocation: {},
  nextRoute: ''
}

// if action.error, it will be an object with status (optional) and message
const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_DASH_LOCATION: return {
      dashLocation: action.dashLocation,
      nextRoute: state.nextRoute || ''
    }
    case RECEIVE_NEXT_ROUTE: return {
      nextRoute: action.nextRoute,
      dashLocation: state.dashLocation
    }
    default: return state
  }
}

export default routeReducer

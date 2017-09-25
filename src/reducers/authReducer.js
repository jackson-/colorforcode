import { AUTHENTICATED, AUTHENTICATING, BEGIN_UPLOADING } from './constants'

const initialState = {
  currentUser: null,
  authenticating: false
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED: return {
      authenticating: false,
      currentUser: action.user
    }
    case AUTHENTICATING: return {
      authenticating: true,
      currentUser: null
    }
    case BEGIN_UPLOADING: return {
      authenticating: true,
      currentUser: null
    }

    default: return state
  }
}

export default authReducer

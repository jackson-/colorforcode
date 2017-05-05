// example loading reducer, useful for UI state changes like button text
// and loading animations

import {
  FETCH_POSTS,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  RECEIVE_POSTS
} from './constants'

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_POSTS: return true
    case CREATE_POST: return true
    case UPDATE_POST: return true
    case DELETE_POST: return true
    case RECEIVE_POSTS: return false
    default: return state
  }
}

export default loadingReducer

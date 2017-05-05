import { RECEIVE_JOBS } from './constants'

const jobsReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_JOBS: return action.jobs
    default: return state
  }
}

export default jobsReducer

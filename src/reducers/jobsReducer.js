import { RECEIVE_JOBS } from './constants'
import { RECEIVE_JOB } from './constants'

const defaultState = {
  all:[],
  job:null
}

const jobsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_JOB: return Object.assign({},{job:action.job});
    case RECEIVE_JOBS: return {...state, all:action.jobs};
    default: return state
  }
}

export default jobsReducer

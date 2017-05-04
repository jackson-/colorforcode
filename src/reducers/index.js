import { combineReducers } from 'redux'
// just import your reducers as you want your state keys named and
// add them to the combineReducers arguments
import loading from './loadingReducer'
import jobs from './jobsReducer'

const rootReducer = combineReducers({
  loading,
  jobs
})

export default rootReducer

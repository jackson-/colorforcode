import { combineReducers } from 'redux'
// just import your reducers as you want your state keys named and
// add them to the combineReducers arguments
import loading from './loadingReducer'
import jobs from './jobsReducer'
import users from './usersReducer'
import router from './routerReducer'
import skills from './skillsReducer'

const rootReducer = combineReducers({
  loading,
  jobs,
  users,
  router,
  skills
})

export default rootReducer

import { combineReducers } from 'redux'
// just import your reducers as you want your state keys named and
// add them to the combineReducers arguments
import loading from './loadingReducer'
import jobs from './jobsReducer'
import users from './usersReducer'
import skills from './skillsReducer'
import projects from './projectsReducer'
import error from './errorReducer'

const rootReducer = combineReducers({
  loading,
  jobs,
  users,
  skills,
  projects,
  error
})

export default rootReducer

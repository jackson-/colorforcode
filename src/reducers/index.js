import { combineReducers } from 'redux'
// just import your reducers as you want your state keys named and
// add them to the combineReducers arguments
import jobs from './jobsReducer'
import users from './usersReducer'
import auth from './authReducer'
import skills from './skillsReducer'
import projects from './projectsReducer'
import alert from './alertReducer'
import location from './routeReducer'

const rootReducer = combineReducers({
  auth,
  jobs,
  users,
  skills,
  projects,
  alert,
  location
})

export default rootReducer

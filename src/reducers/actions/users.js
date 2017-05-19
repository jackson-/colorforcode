import axios from 'axios'
import { RECEIVE_ALL_USERS, AUTHENTICATED } from '../constants'
import { createNewUser, requestAllUsers } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveAllUsers = users => ({
  users,
  loading: false,
  type: RECEIVE_ALL_USERS
})

export const authenticated = user => ({
  user,
  loading: false,
  type: AUTHENTICATED
})

// export const receiveUser = user => ({
//   user,
//   type: RECEIVE_USER
// })

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllUsers = () => dispatch => {
  dispatch(requestAllUsers())
  axios.get('/api/users')
  .then(res => res.data)
  .then(users => dispatch(receiveAllUsers(users)))
  .catch(err => console.error(`Mang, I couldn't find any users! ${err.stack}`))
}

export const whoami = (history) => dispatch => {
  axios.get('/api/auth/whoami')
  .then(response => {
    const user = response.data
    dispatch(authenticated(user))
    if (typeof user !== 'string') history.push('/dashboard')
    else history.push('/login')
  })
  .catch(failed => {
    dispatch(authenticated(null))
  })
}

export const login = (email, password, history) => dispatch => {
  axios.post('/api/auth/login/local', {email, password})
  .then(() => dispatch(whoami(history)))
  .catch(() => dispatch(whoami()))
}

export const logout = (history) => dispatch => {
  axios.post('/api/auth/logout')
  .then(() => dispatch(whoami(history)))
  .catch(() => dispatch(whoami()))
}

export const creatingNewUser = (user, history) => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new user
  axios.post('/api/users', user)
  .then(res => res.data)
  // if the user is successfully created, we receive the update to users list
  .then(newUser => {
    dispatch(gettingAllUsers())
    dispatch(login(newUser.email, newUser.password, history))
  })
  // otherwise we catch the error...
  .catch(err => console.error(`Sorry, cuz. We couldn't create that user...${err.stack}`))
}

export const creatingNewEmployer = employer => dispatch => {
  axios.post('/api/employers', employer)
  .then(res => res.data)
  .catch(err => console.error(`Couldn't create employer ${employer.name}...${err.stack}`))
}

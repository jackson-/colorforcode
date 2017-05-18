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

export const whoami = () => dispatch => {
  axios.get('/api/auth/whoami')
  .then(response => {
    const user = response.data
    dispatch(authenticated(user))
  })
  .catch(failed => dispatch(authenticated(null)))
}

export const login = (username, password) => dispatch => {
  axios.post('/api/auth/login/local', {username, password})
  .then(() => dispatch(whoami()))
  .catch(() => dispatch(whoami()))
}

export const logout = () => dispatch => {
  axios.post('/api/auth/logout')
  .then(() => dispatch(whoami()))
  .catch(() => dispatch(whoami()))
}

export const creatingNewUser = user => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new user
  axios.post('/api/users', user)
  .then(res => res.data)
  // if the user is successfully created, we receive the update to users list
  .then(newUser => {
    dispatch(gettingAllUsers())
    dispatch(login(newUser.email, newUser.password))
  })
  // otherwise we catch the error...
  .catch(err => console.error(`Sorry, cuz. We couldn't create that user...${err.stack}`))
}

export const creatingNewEmployer = employer => dispatch => {
  axios.post('/api/employers', employer)
  .then(res => res.data)
  .catch(err => console.error(`Couldn't create employer ${employer.name}...${err.stack}`))
}

// export const authenticatingUser = user => dispatch => {
//   dispatch(authenticateUser())
//   axios.post('/api/users/login', user)
//   .then(res => {
//     return res.data
//   })
//   .then(user => {
//     sessionStorage.setItem('user', user.id)
//
//     dispatch(receiveUser(user))
//   })
//   .catch(err => console.error(`Bitch I couldn't sign you in!...${err.stack}`))
// }

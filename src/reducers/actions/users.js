import axios from 'axios'
import { RECEIVE_USERS } from '../constants'
import { createNewUser, requestAllUsers } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveUsers = users => ({
  users,
  type: RECEIVE_USERS
})

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllUsers = () => dispatch => {
  dispatch(requestAllUsers())
  axios.get('/api/users')
  .then(res => res.data)
  .then(users => dispatch(receiveUsers(users)))
  .catch(err => console.log('Bitch I couldn\'t find the users!'))
}

export const creatingNewUser = user => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new job
  axios.post('/api/users', user)
  .then(res => res.data)
  // if the user is successfully created, we receive the update to users list
  .then(users => dispatch(gettingAllUsers()))
  // otherwise we catch the error...
  .catch(err => console.error('Sorry, cuz. We couldn\'t create that user...'))
}

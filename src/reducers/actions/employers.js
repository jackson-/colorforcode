import axios from 'axios'
import { RECEIVE_USERS, RECEIVE_USER } from '../constants'
import { authenticateEmployer, createNewEmployer, requestAllEmployers, doneLoading } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveEmployers = employers => ({
  employers,
  type: RECEIVE_USERS
})

export const receiveEmployer = employer => ({
  employer,
  type: RECEIVE_USER
})

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllEmployers = () => dispatch => {
  dispatch(requestAllEmployers())
  axios.get('/api/employers')
  .then(res => res.data)
  .then(employers => dispatch(receiveEmployers(employers)))
  .catch(err => console.log('Bitch I couldn\'t find the employers!'))
}

export const creatingNewEmployer = employer => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewEmployer())
  // create the new job
  axios.post('/api/employers', employer)
  .then(res => res.data)
  // if the employer is successfully created, we receive the update to employers list
  .then(employers => dispatch(gettingAllEmployers()))
  // otherwise we catch the error...
  .catch(err => console.error('Sorry, cuz. We couldn\'t create that employer...'))
}

export const authenticatingEmployer = employer => dispatch => {
  console.log('NEW SHIT')
  dispatch(authenticateEmployer())
  axios.post('/api/employers/login', employer)
  .then(res => {
    return res.data
  })
  .then(employer => {
    console.log("USER", employer)
    sessionStorage.setItem('employer', employer.id)

    dispatch(receiveEmployer(employer))
  })
  .then(() => {
    dispatch(doneLoading())
  })
  // .then(job => console.log("JOB", job))
  .catch(err => console.log('Bitch I couldn\'t sign you in!'))
}

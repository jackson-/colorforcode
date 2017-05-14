// import axios from 'axios'
// import { RECEIVE_JOBS, RECEIVE_JOB } from '../constants'
// import { authenticateUser, doneLoading } from './loading'
//
// /* --------- PURE ACTION CREATORS ---------*/
// export const receiveAuth = job => ({
//   job:job,
//   type: RECEIVE_JOB
// })
// export const receiveJobs = jobs => ({
//   jobs:jobs,
//   type: RECEIVE_JOBS
// })
//
//
// /* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/
//
// export const authenticatingUser = user => dispatch => {
//   dispatch(authenticateUser())
//   console.log("user", user)
//   axios.post('http://localhost:1337/api/auth/login/local/', user)
//   .then(res => {
//     return res.data
//   })
//   .then(auth => {
//     console.log("auth", auth)
//     dispatch(receiveAuth(auth))
//   })
//   .then(() => {
//     dispatch(doneLoading())
//   })
//   // .then(job => console.log("JOB", job))
//   .catch(err => console.log('Bitch I couldn\'t sign you in!'))
// }

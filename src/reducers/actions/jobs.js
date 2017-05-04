import axios from 'axios'
import { RECEIVE_JOBS } from '../constants'
import { createNewJob, requestAllJobs } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveJobs = jobs => ({
  jobs,
  type: RECEIVE_JOBS
})

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllJobs = () => dispatch => {
  dispatch(requestAllJobs())
  axios.get('/api/jobs')
  .then(res => res.data)
  .then(jobs => dispatch(receiveJobs(jobs)))
  .catch(err => console.log('Bitch I couldn\'t find the jobs!'))
}

export const creatingNewJob = jobPost => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewJob())
  // create the new job
  axios.post('/api/jobs', jobPost)
  .then(res => res.data)
  // if the job is successfully created, we fetch all the jobs to update jobs state
  .then(createdJob => dispatch(gettingAllJobs()))
  // otherwise we catch the error...
  .catch(err => console.error('Sorry, cuz. We couldn\'t create that job post...'))
}

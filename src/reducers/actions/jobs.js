import axios from 'axios'
import { RECEIVE_JOBS, RECEIVE_JOB } from '../constants'
import { createNewJob, requestAllJobs, requestJob, doneLoading } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveJob = job => ({
  job:job,
  type: RECEIVE_JOB
})
export const receiveJobs = jobs => ({
  jobs:jobs,
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

export const gettingJob = job_id => dispatch => {
  dispatch(requestJob())
  axios.get('/api/jobs/'+job_id)
  .then(res => res.data)
  .then(job => {
    dispatch(receiveJob(job))
  })
  .then(() => {
    dispatch(doneLoading())
  })
  // .then(job => console.log("JOB", job))
  .catch(err => console.log('Bitch I couldn\'t find the job!'))
}

export const creatingNewJob = jobPost => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewJob())
  // create the new job
  axios.post('/api/jobs', jobPost)
  .then(res => res.data)
  // if the job is successfully created, we receive the update to date jobs list
  .then(jobs => dispatch(gettingAllJobs()))
  // otherwise we catch the error...
  .catch(err => console.error('Sorry, cuz. We couldn\'t create that job post...'))
}

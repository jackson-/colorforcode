import axios from 'axios'
import { RECEIVE_ALL_JOBS, RECEIVE_JOB,
         RECEIVE_USER_JOBS, APPLIED_TO_JOB, RECEIVE_APPLIED_JOBS } from '../constants'
import { createNewJob, requestAllJobs,
         requestJob, requestUserJobs, requestAppliedJobs, applyToJob } from './loading'
import { gettingAllSkills } from './skills'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveJob = job => ({
  job,
  type: RECEIVE_JOB
})
export const receiveAllJobs = jobs => ({
  jobs,
  loading: false,
  type: RECEIVE_ALL_JOBS
})
export const receiveUserJobs = jobs => ({
  jobs,
  loading: false,
  type: RECEIVE_USER_JOBS
})
export const receiveAppliedJobs = jobs => ({
  jobs,
  loading: false,
  type: RECEIVE_APPLIED_JOBS
})
export const appliedToJob = () => ({
  loading: false,
  type: APPLIED_TO_JOB
})

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllJobs = () => dispatch => {
  dispatch(requestAllJobs())
  axios.get('/api/jobs')
  .then(res => res.data)
  .then(jobs => dispatch(receiveAllJobs(jobs)))
  .catch(err => console.error(`Mang, I couldn't find the jobs! ${err.stack}`))
}

export const applyingToJob = (user_id, job_id, history) => dispatch => {
  dispatch(applyToJob())
  axios.post(`/api/jobs/${job_id}/apply`, {user_id, job_id})
  .then(() => {
    dispatch(appliedToJob())
    history.push('/')
  })
  .catch(err => console.error(`Mang, I couldn't apply to the job! ${err.stack}`))
}

export const gettingUserJobs = (employer) => dispatch => {
  dispatch(requestUserJobs())
  axios.get(`/api/jobs/employer/${employer.id}`)
  .then(res => res.data)
  .then(jobs => dispatch(receiveUserJobs(jobs)))
  .catch(err => console.error(`Mang, I couldn't find the jobs! ${err.stack}`))
}

export const gettingUserApps = (user) => dispatch => {
  console.log("IN REDUCER")
  dispatch(requestAppliedJobs())
  axios.get(`/api/jobs/apps/${user.id}`)
  .then(res => res.data)
  .then(jobs => dispatch(receiveUserJobs(jobs)))
  .catch(err => console.error(`Mang, I couldn't find the jobs! ${err.stack}`))
}

export const gettingJobById = job_id => dispatch => {
  dispatch(requestJob())
  axios.get(`/api/jobs/${job_id}`)
  .then(res => res.data)
  .then(job => {
    dispatch(receiveJob(job))
    dispatch(gettingAllSkills())
  })
  .catch(err => console.error(`Mang I couldn't find the job! ${err.stack}`))
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
  .catch(err => console.error(`Sorry, cuz. We couldn't create that job post...${err.stack}`))
}

export const updatingJob = (postData, history) => dispatch => {
  axios.put(`/api/jobs/${postData.job.id}`, postData)
  .then(() => {
    history.push('/dashboard')
  })
  .catch(err => console.error(`Sorry, cuz. Couldn't update that job post...${err.stack}`))
}

export const deletingJob = (id, history) => dispatch => {
  axios.delete(`/api/jobs/${id}`)
  .then(() => {
    history.push('/dashboard')
  })
  .catch(err => console.error(`Sorry, cuz. Couldn't delete that job post...${err.stack}`))
}

import axios from 'axios'
import {
  RECEIVE_ALL_JOBS, RECEIVE_JOB, CREATE_JOBS, UPDATE_JOB, PAGINATE_JOBS,
  DELETE_JOB, REQUEST_JOB, REQUEST_ALL_JOBS, RECEIVE_FILTERED_JOBS,
  REQUEST_FILTERED_JOBS, APPLY_TO_JOB, APPLIED_TO_JOB } from '../constants'
import { whoami } from './auth'
import { receiveAlert } from './alert'

/* --------- PURE ACTION CREATORS --------- */

export const requestAllJobs = () => ({
  type: REQUEST_ALL_JOBS
})

export const receiveAllJobs = jobs => ({
  jobs,
  type: RECEIVE_ALL_JOBS
})

export const requestFilteredJobs = filter => ({
  filter,
  type: REQUEST_FILTERED_JOBS
})

export const receiveFilteredJobs = jobs => ({
  jobs,
  type: RECEIVE_FILTERED_JOBS
})

export const paginateJobs = (offset, pageNum) => ({
  offset,
  pageNum,
  type: PAGINATE_JOBS
})

export const requestJob = () => ({
  type: REQUEST_JOB
})

export const receiveJob = (job, skills) => ({
  job,
  skills,
  type: RECEIVE_JOB
})

export const createNewJobs = () => ({
  type: CREATE_JOBS
})

export const updateJob = () => ({
  type: UPDATE_JOB
})

export const deleteJob = () => ({
  type: DELETE_JOB
})

export const applyToJob = () => ({
  type: APPLY_TO_JOB
})

export const appliedToJob = () => ({
  type: APPLIED_TO_JOB
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingAllJobs = () => dispatch => {
  dispatch(requestAllJobs())
  axios.get('/api/jobs')
    .then(res => res.data)
    .then(jobs => dispatch(receiveAllJobs(jobs)))
    .catch(err => console.error(`Mang, I couldn't find the jobs! ${err.stack}`))
}

export const filteringJobs = ({query, advanced}) => dispatch => {
  dispatch(requestFilteredJobs({terms: query.split(' '), advanced}))
  axios.post('/api/jobs/search', {query})
    .then(res => res.data)
    .then(jobs => dispatch(receiveFilteredJobs(jobs)))
    .catch(err => console.error(`Mang, I couldn't filter the jobs! ${err.stack}`))
}

export const advancedFilteringJobs = body => dispatch => {
  dispatch(requestFilteredJobs(body))
  axios.post('/api/jobs/search/advanced', body)
    .then(res => res.data)
    .then(jobs => {
      if (!jobs) dispatch(receiveFilteredJobs([]))
      else dispatch(receiveFilteredJobs(Array.isArray(jobs) ? jobs : [jobs]))
    })
    .catch(err => console.error(`Mang, I couldn't advanced filter the jobs! ${err.stack}`))
}

export const applyingToJob = (user, job_id, history) => dispatch => {
  dispatch(applyToJob())
  axios.post(`/api/jobs/${job_id}/apply`, {user, job_id})
    .then(() => {
      dispatch(whoami())
      dispatch(appliedToJob())
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'You\'ve applied to this job. If this recruiter reaches out to your email you\'ll be guaranteed a phone interview!',
        next: '/dashboard/applications'
      }))
    })
    .catch(err => console.error(`Mang, I couldn't apply to the job! ${err.stack}`))
}

export const gettingJobById = job_id => dispatch => {
  dispatch(requestJob())
  axios.get(`/api/jobs/${job_id}`)
    .then(res => res.data)
    .then((res) => {
      const {job, skills} = res
      dispatch(receiveJob(job, skills))
    })
    .catch(err => console.error(`Mang I couldn't find the job! ${err.stack}`))
}

export const creatingNewJobs = (data, history) => dispatch => {
  // set loading state to true to trigger UI changes
  dispatch(createNewJobs())
  // create the new job

  axios.post('/api/jobs', data)
    .then(res => res.data)
    // if the job is successfully created, we fetch the updated jobs list
    .then(updatedJobsList => {
      dispatch(whoami())
      dispatch(receiveAllJobs(updatedJobsList))
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'Jobs successfully posted.',
        next: '/dashboard/manage-jobs'
      }))
    })
    // otherwise we catch the error...
    .catch(err => console.error(`Sorry, cuz. We couldn't create that job post...${err.stack}`))
}

export const updatingJob = (postData, history) => dispatch => {
  axios.put(`/api/jobs/${postData.job.id}`, postData)
    .then(res => res.data)
    .then(updatedJob => {
      dispatch(whoami())
      dispatch(receiveJob(updatedJob, updatedJob.skills))
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'Job successfully updated.',
        next: '/dashboard/manage-jobs'
      }))
    })
    .catch(err => console.error(`Sorry, cuz. Couldn't update that job post...${err.stack}`))
}

export const deletingJob = (id, history) => dispatch => {
  axios.delete(`/api/jobs/${id}`)
    .then(() => {
      dispatch(whoami())
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'Job successfully deleted.',
        next: '/dashboard/manage-jobs'
      }))
    })
    .catch(err => console.error(`Sorry, cuz. Couldn't delete that job post...${err.stack}`))
}

export const savingJob = ({userId, savedJobsArr}) => dispatch => {
  if (!userId) {
    return dispatch(receiveAlert({
      status: null,
      message: 'Sign in or register to save jobs.'
    }))
  }
  axios.put(`/api/users/${userId}`, {savedJobsArr})
    .then(() => dispatch(whoami()))
    .catch(err => console.error(`Sorry, cuz. Couldn't save job for user ${userId}...${err.stack}`))
}

export const unsavingJob = ({userId, savedJobsArr}) => dispatch => {
  axios.put(`/api/users/${userId}`, {savedJobsArr})
    .then(() => dispatch(whoami()))
    .catch(err => console.error(`Sorry, cuz. Couldn't unsave job for user ${userId}...${err.stack}`))
}

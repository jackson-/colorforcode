import axios from 'axios'
import { RECEIVE_JOBS, RECEIVE_JOB, APPLIED_TO_JOB } from '../constants'
import {
  createNewJobs,
  requestAllJobs,
  requestFilteredJobs,
  requestJob,
  applyToJob
} from './loading'
import { whoami } from './users'
import { receiveAlert } from './alert'

/* --------- PURE ACTION CREATORS --------- */
export const receiveJob = (job, skills) => ({
  job,
  skills,
  type: RECEIVE_JOB
})
export const receiveJobs = (jobs, skills) => ({
  jobs,
  skills,
  loading: false,
  type: RECEIVE_JOBS
})

export const appliedToJob = () => ({
  loading: false,
  type: APPLIED_TO_JOB
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingAllJobs = () => dispatch => {
  dispatch(requestAllJobs())
  axios.get('/api/jobs')
    .then(res => res.data)
    .then(data => {
      const {hits, total, skills} = data
      return dispatch(receiveJobs({hits, total}, skills))
    })
    .catch(err => console.error(`Mang, I couldn't find the jobs! ${err.stack}`))
}

export const filteringJobs = query => dispatch => {
  dispatch(requestFilteredJobs())
  axios.post('/api/jobs/search', {query})
    .then(res => res.data)
    .then(data => {
      const {hits, total, skills} = data
      return dispatch(receiveJobs({hits, total}, skills))
    })
    .catch(err => console.error(`Mang, I couldn't filter the jobs! ${err.stack}`))
}

export const advancedFilteringJobs = body => dispatch => {
  axios.post('/api/jobs/search/advanced', body)
    .then(res => res.data)
    .then(jobs => dispatch(receiveJobs(jobs)))
    .catch(err => console.error(`Mang, I couldn't advanced filter the jobs! ${err.stack}`))
}

export const grabbingCoords = () => {
  // returning a Promise so it's thenable (*then* we'll call setState once resolved)
  return new Promise((resolve, reject) => {
    let coords = ''
    if (navigator.geolocation) {
      console.log('GRABBING COORDS')
      const positionId = navigator.geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords
          coords = `${latitude}, ${longitude}`
          navigator.geolocation.clearWatch(positionId)
          resolve(coords)
        },
        error => {
          console.error(
            'Could not locate user for advanced search distance filters.',
            error.stack
          )
          reject(error)
        }
      )
    }
  })
}

export const buildBodyThenSearchJobs = (bodyBuilderFunc, coords, from) => {
  return dispatch => {
    dispatch(requestFilteredJobs())
    const body = bodyBuilderFunc(coords, from)
    dispatch(advancedFilteringJobs(body))
  }
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
    .then(newJobId => {
      dispatch(whoami())
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
    .then(() => {
      dispatch(whoami())
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

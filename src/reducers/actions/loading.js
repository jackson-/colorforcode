import { CREATE_JOB, REQUEST_JOBS } from '../constants'

/* --------- PURE ACTION CREATORS ---------*/

export const createNewJob = () => ({
  type: CREATE_JOB,
  loading: true
})

export const requestAllJobs = () => ({
  type: REQUEST_JOBS,
  loading: true
})

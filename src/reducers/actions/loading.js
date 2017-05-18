import { CREATE_JOB, UPDATE_JOB, DELETE_JOB, REQUEST_JOB,
         REQUEST_ALL_JOBS, CREATE_USER, UPDATE_USER, DELETE_USER, REQUEST_ALL_USERS,   } from '../constants'

/* --------- PURE ACTION CREATORS ---------*/

export const createNewJob = () => ({
  type: CREATE_JOB,
  loading: true
})

export const updateJob = () => ({
  type: UPDATE_JOB,
  loading: true
})

export const deleteJob = () => ({
  type: DELETE_JOB,
  loading: true
})

export const requestJob = () => ({
  type: REQUEST_JOB,
  loading: true
})

export const requestAllJobs = () => ({
  type: REQUEST_ALL_JOBS,
  loading: true
})

export const createNewUser = () => ({
  type: CREATE_USER,
  loading: true
})

export const updateUser = () => ({
  type: UPDATE_USER,
  loading: true
})

export const deleteUser = () => ({
  type: DELETE_USER,
  loading: true
})

export const requestAllUsers = () => ({
  type: REQUEST_ALL_USERS,
  loading: true
})

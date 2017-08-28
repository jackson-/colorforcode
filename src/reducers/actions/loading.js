import { CREATE_JOB, UPDATE_JOB, DELETE_JOB, REQUEST_JOB,
         REQUEST_ALL_JOBS, CREATE_USER, UPDATE_USER,
         DELETE_USER, REQUEST_ALL_USERS, REQUEST_ALL_SKILLS,
         REQUEST_USER_JOBS, REQUEST_APPLIED_JOBS, APPLY_TO_JOB,
         APPLIED_TO_JOB, BEGIN_UPLOADING, DONE_UPLOADING,
         CREATE_PROJECT, REQUEST_FILTERED_JOBS, REQUEST_USER,
         REQUEST_FILTERED_USERS, REQUEST_PROJECT,
         REQUEST_ALL_PROJECTS, UPDATE_PROJECT } from '../constants'

/* --------- PURE ACTION CREATORS --------- */

export const beginUploading = () => ({
  type: BEGIN_UPLOADING,
  loading: true
})

export const doneUploading = () => ({
  type: DONE_UPLOADING,
  loading: false
})

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

export const requestFilteredJobs = () => ({
  type: REQUEST_FILTERED_JOBS,
  loading: true
})

export const requestFilteredUsers = () => ({
  type: REQUEST_FILTERED_USERS,
  loading: true
})

export const requestUserJobs = () => ({
  type: REQUEST_USER_JOBS,
  loading: true
})

export const requestAppliedJobs = () => ({
  type: REQUEST_APPLIED_JOBS,
  loading: true
})

export const applyToJob = () => ({
  type: APPLY_TO_JOB,
  loading: true
})

export const appliedToJob = () => ({
  type: APPLIED_TO_JOB,
  loading: true
})

export const requestUser = () => ({
  type: REQUEST_USER,
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

export const requestAllSkills = () => ({
  type: REQUEST_ALL_SKILLS,
  loading: true
})

export const createNewProject = () => ({
  type: CREATE_PROJECT,
  loading: true
})

export const updateProject = () => ({
  type: UPDATE_PROJECT,
  loading: true
})

export const requestProject = () => ({
  type: REQUEST_PROJECT,
  loading: true
})

export const requestAllProjects = () => ({
  type: REQUEST_ALL_PROJECTS,
  loading: true
})

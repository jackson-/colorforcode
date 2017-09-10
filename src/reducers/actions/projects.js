import axios from 'axios'
import {
  RECEIVE_PROJECT, REQUEST_PROJECT,
  CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../constants'
import { beginUploading, doneUploading } from './users'
import { whoami } from './auth'
import { receiveAlert } from './alert'
import storage from 'APP/firebase'
const storageRef = storage.ref()

/* --------- PURE ACTION CREATORS --------- */

export const requestProject = () => ({
  type: REQUEST_PROJECT
})

export const receiveProject = (project, skills) => ({
  skills,
  project,
  type: RECEIVE_PROJECT
})

export const createNewProject = () => ({
  type: CREATE_PROJECT
})

export const updateProject = () => ({
  type: UPDATE_PROJECT
})

export const deleteProject = () => ({
  type: DELETE_PROJECT
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingProjectById = (id) => dispatch => {
  dispatch(requestProject())
  axios.get(`/api/projects/${id}`)
    .then(res => res.data)
    .then(res => {
      const {skills, project} = res
      dispatch(receiveProject(project, skills))
    })
    .catch(err => console.error(`Mang I couldn't find the project! ${err.stack}`))
}

export const creatingNewProject = ({project, skills}) => dispatch => {
  // set loading state to true to trigger UI changes
  dispatch(createNewProject())
  // create the new project
  axios.post('/api/projects', {project, skills})
    .then(res => res.data)
  // if the project is successfully created, we receive the update to date
  // projects list by regrabbing the user (projects are eager loaded)
    .then(() => {
      dispatch(whoami())
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'New project successfully added to your profile.',
        next: '/dashboard/projects'
      }))
    })
    // otherwise we catch the error...
    .catch(err => {
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh oh!',
        body: 'Unable to create new project, please double check form fields and try again.',
        next: null
      }))
      console.error(`Sorry, cuz. We couldn't create that new project...${err.stack}`)
    })
}

export const updatingProject = (postData, screenshot) => dispatch => {
  dispatch(updateProject())
  axios.put(`/api/projects/${postData.project.id}`, postData)
    .then(project => {
      dispatch(whoami())
      return dispatch(receiveProject(project, {selected: project.skills}))
    })
    .then(() => {
      if (!screenshot) {
        dispatch(receiveAlert({
          type: 'confirmation',
          style: 'success',
          title: 'Success!',
          body: 'Your project has been successfully updated.',
          next: '/dashboard/projects'
        }))
      }
    })
    .catch(err => {
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh oh!',
        body: 'We couldn\'t update your project, please double check form fields and try again.',
        next: null
      }))
      console.error(`Sorry, cuz. Couldn't update that project...${err.stack}`)
    })
}

export const uploadingScreenshot = (project, file) => dispatch => {
  const name = `${project.title.split(' ').join('-')}-${project.user_id}`
  const screenshotRef = storageRef.child(`screenshots/${name}`)
  dispatch(beginUploading())
  screenshotRef.put(file)
    .then(() => screenshotRef.getDownloadURL())
    .then(url => {
      project.screenshot = url
      dispatch(updatingProject({project}, 'screenshot'))
      dispatch(doneUploading())
    })
    .catch((err) => {
      console.error(err)
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh Oh!',
        body: 'Sorry, we could not upload that project screenshot. Please try again.',
        next: null
      }))
    })
}

export const deletingProject = (id, history) => dispatch => {
  dispatch(deleteProject())
  axios.delete(`/api/projects/${id}`)
    .then(() => {
      dispatch(whoami())
      dispatch(receiveAlert({
        type: 'confirmation',
        style: 'success',
        title: 'Success!',
        body: 'Your project has been successfully deleted.',
        next: '/dashboard/projects'
      }))
    })
    .catch(err => {
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh oh!',
        body: 'We couldn\'t delete that project, please double check form fields and try again.',
        next: ''
      }))
      console.error(`Sorry, cuz. Couldn't delete that project...${err.stack}`)
    })
}

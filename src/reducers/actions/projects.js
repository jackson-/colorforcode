import axios from 'axios'
import { whoami } from './users'
import { RECEIVE_ALL_PROJECTS, RECEIVE_PROJECT, RECEIVE_USER_PROJECTS } from '../constants'
import { createNewProject, requestAllProjects, requestUserProjects,
         requestFilteredProjects, requestProject, updateProject,
         beginUploading, doneUploading } from './loading'
import { receiveAlert } from './alert'

/* --------- PURE ACTION CREATORS --------- */

export const receiveProject = (project, skills) => ({
  skills,
  project,
  type: RECEIVE_PROJECT
})
export const receiveAllProjects = projects => ({
  projects,
  loading: false,
  type: RECEIVE_ALL_PROJECTS
})

export const receiveUserProjects = projects => ({
  projects,
  loading: false,
  type: RECEIVE_USER_PROJECTS
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingAllProjects = () => dispatch => {
  dispatch(requestAllProjects())
  axios.get('/api/projects')
    .then(res => res.data)
    .then(projects => dispatch(receiveAllProjects(projects)))
    .catch(err => console.error(`Mang, I couldn't find the projects! ${err.stack}`))
}

export const gettingUserProjects = (user) => dispatch => {
  dispatch(requestUserProjects())
  axios.get(`/api/projects/employer/${user.id}`)
    .then(res => res.data)
    .then(projects => dispatch(receiveUserProjects(projects)))
    .catch(err => console.error(`Mang, I couldn't find the projects! ${err.stack}`))
}

export const filteringProjects = query => dispatch => {
  dispatch(requestFilteredProjects())
  axios.post('/api/projects/search', {query})
    .then(res => res.data)
    .then(projects => dispatch(receiveAllProjects(projects)))
    .catch(err => console.error(`Mang, I couldn't filter the  projects! ${err.stack}`))
}

export const gettingProjectById = (id) =>
  dispatch => {
    dispatch(requestProject())
    axios.get(`/api/projects/${id}`)
      .then(res => res.data)
      .then(res => {
        const {skills, project} = res
        dispatch(receiveProject(project, skills))
      })
      .catch(err => console.error(`Mang I couldn't find the project! ${err.stack}`))
  }

export const creatingNewProject = (projectPost) => dispatch => {
  // set loading state to true to trigger UI changes
  dispatch(createNewProject())
  // create the new project
  axios.post('/api/projects', projectPost)
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
    .catch(err => console.error(`Sorry, cuz. We couldn't create that new project...${err.stack}`))
}

export const updatingProject = (postData) => dispatch => {
  dispatch(updateProject())
  axios.put(`/api/projects/${postData.project.id}`, postData)
    .then(project => {
      dispatch(whoami)
      return dispatch(receiveProject(project))
    })
    .then(() => dispatch(receiveAlert({
      type: 'confirmation',
      style: 'success',
      title: 'Success!',
      body: 'Your project has been successfully updated.',
      next: '/dashboard/projects'
    })))
    .catch(err => console.error(`Sorry, cuz. Couldn't update that project...${err.stack}`))
}

export const uploadingScreenshot = (project, file) => dispatch => {
  const name = `project-${project.id}-created-${project.created_at}-by-user-${project.user_id}`
  dispatch(beginUploading())
  project.screenshot = `https://s3.amazonaws.com/hireblack/screenshots/${name}`
  const options = {headers: {'Content-Type': file.type}}

  axios.get(
    `http://localhost:1337/api/projects/screenshots/sign-s3?&file-name=${name}&file-type=${file.type}`
  )
    .then(res => {
      axios.put(res.data.signedRequest, file, options)
    })
    .then(() => dispatch(updatingProject({project})))
    .then(() => dispatch(doneUploading()))
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
  .catch(err => console.error(`Sorry, cuz. Couldn't delete that project...${err.stack}`))
}

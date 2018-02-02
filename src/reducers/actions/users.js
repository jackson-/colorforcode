import axios from 'axios'
import {
  RECEIVE_ALL_USERS, RECEIVE_USER, UPDATE_USER,
  DELETE_USER, REQUEST_ALL_USERS, BEGIN_UPLOADING, RECEIVE_FILTERED_USERS, DONE_UPLOADING, REQUEST_USER, REQUEST_FILTERED_USERS, PAGINATE_USERS } from '../constants'
import { whoami } from './auth'
import { receiveAlert } from './alert'
import storage from 'APP/firebase'
const storageRef = storage.ref()
import {API_URL} from  '../../keywords'

/* --------- PURE ACTION CREATORS --------- */

export const requestAllUsers = () => ({
  type: REQUEST_ALL_USERS
})

export const receiveAllUsers = users => ({
  users,
  type: RECEIVE_ALL_USERS
})

export const requestFilteredUsers = filter => ({
  filter,
  type: REQUEST_FILTERED_USERS
})

export const receiveFilteredUsers = users => ({
  users,
  type: RECEIVE_FILTERED_USERS
})

export const paginateUsers = (offset, pageNum) => ({
  offset,
  pageNum,
  type: PAGINATE_USERS
})

export const requestUser = () => ({
  type: REQUEST_USER
})

export const receiveUser = user => ({
  selected: user,
  type: RECEIVE_USER
})

export const updateUser = () => ({
  type: UPDATE_USER
})

export const deleteUser = () => ({
  type: DELETE_USER
})

export const beginUploading = () => ({
  type: BEGIN_UPLOADING
})

export const doneUploading = () => ({
  type: DONE_UPLOADING
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingAllUsers = () => dispatch => {
  dispatch(requestAllUsers())
  axios.get(`/api/users`)
    .then(res => res.data)
    .then(users => dispatch(receiveAllUsers(users)))
    .catch(err => console.error(`Mang, I couldn't find any users! ${err.stack}`))
}

export const gettingUserById = user_id => dispatch => {
  dispatch(requestUser())
  axios.get(`/api/users/${user_id}`)
    .then(res => res.data)
    .then(user => {
      dispatch(receiveUser(user))
    })
    .catch(err => console.error(`Mang I couldn't find the user! ${err.stack}`))
}

export const filteringUsers = ({query, advanced}) => dispatch => {
  dispatch(requestFilteredUsers({terms: query.split(' '), advanced}))
  axios.post(`/api/users/search`, {query})
    .then(res => res.data)
    .then(users => dispatch(receiveFilteredUsers(users)))
    .catch(err => console.error(`Mang, I couldn't filter the users! ${err.stack}`))
}

export const advancedFilteringUsers = body => dispatch => {
  dispatch(requestFilteredUsers(body))
  axios.post(`/api/users/search/advanced`, body)
    .then(res => res.data)
    .then(users => dispatch(receiveFilteredUsers(users)))
    .catch(err => console.error(`Mang, I couldn't advanced filter the users! ${err.stack}`))
}

export const creatingNewEmployer = employer => dispatch => {
  axios.post(`/api/employers`, employer)
    .then(res => res.data)
    .catch((err) => {
      console.error(err)
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh Oh!',
        body: 'Sorry, we weren\'t able to create your account. Please try again. If trouble persists please contact us!',
        next: null
      }))
    })
}

export const updatingUser = (user, savedJobs) => dispatch => {
  if (user.coords) {
    user.coords.crs = {type: 'name', properties: {name: 'EPSG:32661'}}
  }
  axios.put(`/api/users/${user.id}`, {user, savedJobs})
    .then(res => res.data)
    // if the user is successfully updated, we reauthenticate to update the store
    .then(updatedUser => {
      dispatch(whoami())
    })
    // otherwise we catch the error...
    .catch((err) => {
      console.error(err)
      let alertBody = savedJobs
        ? 'We were unable to save this job. Please try again, and let us know if trouble persists!'
        : 'Sorry, we\'re having trouble updating your profile at the moment. Please try again later.'
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh Oh!',
        body: alertBody,
        next: null
      }))
    })
}

export const uploadingAvatar = (user, file) => dispatch => {
  dispatch(beginUploading())
  const avatarRef = storageRef.child(`avatars/${user.id}`)
  avatarRef.put(file)
    .then(() => avatarRef.getDownloadURL())
    .then(url => {
      user.image_url = url
      dispatch(updatingUser(user))
      dispatch(doneUploading())
    })
    .catch((err) => {
      console.error(err)
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh Oh!',
        body: 'Sorry, we\'re having trouble uploading your profile picture. Please try again later.',
        next: null
      }))
    })
}

export const uploadingResume = (user, file) => dispatch => {
  dispatch(beginUploading())
  const resumeRef = storageRef.child(`resumes/${user.id}`)
  dispatch(beginUploading())
  resumeRef.put(file)
    .then(() => resumeRef.getDownloadURL())
    .then(url => {
      user.resume_url = url
      dispatch(updatingUser(user))
      dispatch(doneUploading())
    })
    .catch((err) => {
      console.error(err)
      dispatch(receiveAlert({
        type: 'error',
        style: 'danger',
        title: 'Uh Oh!',
        body: 'Sorry, we\'re having trouble uploading your resume. Please try again later.',
        next: null
      }))
    })
}

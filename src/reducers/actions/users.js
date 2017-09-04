import axios from 'axios'
import {
  RECEIVE_USERS, AUTHENTICATED, RECEIVE_USER,
  AUTHENTICATING, CREATE_USER, UPDATE_USER,
  DELETE_USER, REQUEST_ALL_USERS, BEGIN_UPLOADING,
  DONE_UPLOADING, REQUEST_USER, REQUEST_FILTERED_USERS } from '../constants'
import { receiveNextRoute } from '../routeReducer'
/* --------- PURE ACTION CREATORS --------- */

export const receiveAllUsers = users => ({
  users,
  type: RECEIVE_USERS
})

export const receiveUser = user => ({
  selected: user,
  type: RECEIVE_USER
})

export const authenticated = user => ({
  user,
  type: AUTHENTICATED
})

export const authenticating = () => ({
  type: AUTHENTICATING
})

export const beginUploading = () => ({
  type: BEGIN_UPLOADING
})

export const doneUploading = () => ({
  type: DONE_UPLOADING
})

export const requestFilteredUsers = () => ({
  type: REQUEST_FILTERED_USERS
})

export const requestUser = () => ({
  type: REQUEST_USER
})

export const createNewUser = () => ({
  type: CREATE_USER
})

export const updateUser = () => ({
  type: UPDATE_USER
})

export const deleteUser = () => ({
  type: DELETE_USER
})

export const requestAllUsers = () => ({
  type: REQUEST_ALL_USERS
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const whoami = (history, next) => dispatch => {
  dispatch(authenticating())
  axios.get('/api/auth/whoami')
    .then(response => {
      const user = response.data
      dispatch(authenticated(user))
      if (history) {
        console.log('NEXT', next)
        if (next) {
          history.push(next)
          receiveNextRoute('')
        } else {
          history.push(
            user.is_employer
              ? '/dashboard/manage-jobs'
              : '/dashboard/saved-jobs'
          )
        }
      }
    })
    .catch(err => {
      console.error(err.stack)
      dispatch(authenticated(null))
    })
}

export const login = (email, password, history, next) => dispatch => {
  axios.post('/api/auth/login/local', {email, password})
    .then(() => dispatch(whoami(history, next)))
    .catch(() => dispatch(whoami()))
}

export const logout = () => dispatch => {
  axios.post('/api/auth/logout')
    .then(() => {
      dispatch(whoami())
    })
    .catch(() => dispatch(whoami()))
}

export const creatingNewUser = (user, history, next) => dispatch => {
  // set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new user
  axios.post('/api/users', user)
    .then(res => res.data)
    // if the user is successfully created, we receive the updated users list
    .then(newUser => {
      dispatch(login(newUser.email, newUser.password, history, next))
      dispatch(whoami())
    })
    // otherwise we catch the error...
    .catch(err => console.error(`Sorry, cuz. We couldn't create that user...${err.stack}`))
}

export const gettingAllUsers = () => dispatch => {
  dispatch(requestAllUsers())
  axios.get('/api/users')
    .then(res => res.data)
    .then(users => dispatch(receiveAllUsers(users)))
    .catch(err => console.error(`Mang, I couldn't find any users! ${err.stack}`))
}

export const gettingUserById = user_id => dispatch => {
  dispatch(requestUser())
  axios.get(`/api/users/${user_id}`)
    .then(res => res.data)
    .then(user => {
      dispatch(receiveUser(user._source))
    })
    .catch(err => console.error(`Mang I couldn't find the user! ${err.stack}`))
}

export const filteringUsers = query => dispatch => {
  dispatch(requestFilteredUsers())
  axios.post('/api/users/search', {query})
    .then(res => res.data)
    .then(users => dispatch(receiveAllUsers(users)))
    .catch(err => console.error(`Mang, I couldn't filter the users! ${err.stack}`))
}

export const advancedFilteringUsers = body => dispatch => {
  axios.post('/api/users/search/advanced', body)
    .then(res => res.data)
    .then(users => dispatch(receiveAllUsers(users)))
    .catch(err => console.error(`Mang, I couldn't advanced filter the users! ${err.stack}`))
}

export const buildBodyThenSearchUsers = (bodyBuilderFunc, coords) => {
  return dispatch => {
    dispatch(requestFilteredUsers())
    const body = bodyBuilderFunc(coords)
    dispatch(advancedFilteringUsers(body))
  }
}

export const creatingNewEmployer = employer => dispatch => {
  axios.post('/api/employers', employer)
    .then(res => res.data)
    .catch(err => console.error(`Couldn't create employer ${employer.name}...${err.stack}`))
}

export const updatingUser = (user, savedJobs) => dispatch => {
  // set loading state to true to trigger UI changes
  // update the user
  axios.put(`/api/users/${user.id}`, {user, savedJobs})
    .then(res => res.data)
    // if the user is successfully updated, we fetch the updated users list
    .then(updatedUser => {
      dispatch(whoami())
    })
    // otherwise we catch the error...
    .catch(err => console.error(`Sorry, cuz. We couldn't update that user...${err.stack}`))
}

export const uploadingAvatar = (user, file) => dispatch => {
  dispatch(beginUploading())
  user.image_url = `https://s3.amazonaws.com/hireblack/avatars/${file.name}`
  const options = {headers: {'Content-Type': file.type}}
  axios.get(
    `http://localhost:1337/api/users/avatars/sign-s3?&file-name=${file.name}&file-type=${file.type}`
  )
    .then(res => axios.put(res.data.signedRequest, file, options))
    .then(() => dispatch(updatingUser(user)))
    .then(() => dispatch(doneUploading()))
    .catch(err => console.error(`Mang, I couldn't upload the avatar! ${err.stack}`))
}

export const uploadingResume = (user, file) => dispatch => {
  dispatch(beginUploading())
  user.resume_url = `https://s3.amazonaws.com/hireblack/resumes/${file.name}`
  const options = {headers: {'Content-Type': file.type}}
  axios.get(
    `http://localhost:1337/api/users/resumes/sign-s3?&file-name=${file.name}&file-type=${file.type}`
  )
    .then(res => axios.put(res.data.signedRequest, file, options))
    .then(() => dispatch(updatingUser(user)))
    .then(() => dispatch(doneUploading()))
    .catch(err => console.error(`Mang, I couldn't upload the resume! ${err.stack}`))
}

import axios from 'axios'
import { RECEIVE_ALL_USERS, AUTHENTICATED, RECEIVE_USER } from '../constants'
import { createNewUser, requestAllUsers, beginUploading,
         doneUploading, requestUser, requestFilteredUsers } from './loading'
/* --------- PURE ACTION CREATORS --------- */

export const receiveAllUsers = users => ({
  users,
  loading: false,
  type: RECEIVE_ALL_USERS
})

export const receiveUser = user => ({
  selected: user,
  loading: false,
  type: RECEIVE_USER
})

export const authenticated = user => ({
  user,
  loading: false,
  type: AUTHENTICATED
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

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
    dispatch(receiveUser(user))
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

export const buildBodyThenSearch = (bodyBuilderFunc, coords) => {
  return dispatch => {
    dispatch(requestFilteredUsers())
    const body = bodyBuilderFunc(coords)
    dispatch(advancedFilteringUsers(body))
  }
}

export const whoami = (history) => dispatch => {
  axios.get('/api/auth/whoami')
  .then(response => {
    const user = response.data
    dispatch(authenticated(user))
    if (history) {
      history.push(
      user.is_employer
        ? '/dashboard/manage-jobs'
        : '/dashboard/saved-jobs'
      )
    }
  })
  .catch(err => {
    console.error(err.stack)
    dispatch(authenticated(null))
  })
}

export const login = (email, password, history) => dispatch => {
  axios.post('/api/auth/login/local', {email, password})
  .then(() => dispatch(whoami(history)))
  .catch(() => dispatch(whoami()))
}

export const logout = (history) => dispatch => {
  axios.post('/api/auth/logout')
  .then(() => {
    dispatch(whoami())
    history.push('/login')
  })
  .catch(() => dispatch(whoami()))
}

export const creatingNewUser = (user) => dispatch => {
  // set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new user
  axios.post('/api/users', user)
  .then(res => res.data)
  // if the user is successfully created, we receive the updated users list
  .then(newUser => {
    dispatch(login(newUser.email, newUser.password))
    dispatch(whoami())
  })
  // otherwise we catch the error...
  .catch(err => console.error(`Sorry, cuz. We couldn't create that user...${err.stack}`))
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
  debugger
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

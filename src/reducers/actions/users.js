import axios from 'axios'
import { RECEIVE_ALL_USERS, AUTHENTICATED } from '../constants'
import { createNewUser, requestAllUsers,
  beginUploading, doneUploading } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveAllUsers = users => ({
  users,
  loading: false,
  type: RECEIVE_ALL_USERS
})

export const authenticated = user => ({
  user,
  loading: false,
  type: AUTHENTICATED
})

// export const receiveUser = user => ({
//   user,
//   type: RECEIVE_USER
// })

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/


export const gettingAllUsers = () => dispatch => {
  dispatch(requestAllUsers())
  axios.get('/api/users')
  .then(res => res.data)
  .then(users => dispatch(receiveAllUsers(users)))
  .catch(err => console.error(`Mang, I couldn't find any users! ${err.stack}`))
}

export const whoami = (history) => dispatch => {
  axios.get('/api/auth/whoami')
  .then(response => {
    const user = response.data
    dispatch(authenticated(user))
    if (history) {
      typeof user !== 'string'
        ? history.push('/dashboard/manage-jobs')
        : history.push('/login')
    }
  })
  .catch(err => {
    dispatch(authenticated(null))
  })
}

export const login = (email, password, history) => dispatch => {
  axios.post('/api/auth/login/local', {email, password})
  .then(() => dispatch(whoami(history)))
  .catch(() => dispatch(whoami(history)))
}

export const logout = (history) => dispatch => {
  axios.post('/api/auth/logout')
  .then(() => dispatch(whoami(history)))
  .catch(() => dispatch(whoami(history)))
}

export const creatingNewUser = (user, history) => dispatch => {
  //set loading state to true to trigger UI changes
  dispatch(createNewUser())
  // create the new user
  axios.post('/api/users', user)
  .then(res => res.data)
  // if the user is successfully created, we receive the updated to users list
  .then(newUser => {
    dispatch(gettingAllUsers())
    dispatch(login(newUser.email, newUser.password, history))
    dispatch(whoami(history))
  })
  // otherwise we catch the error...
  .catch(err => console.error(`Sorry, cuz. We couldn't create that user...${err.stack}`))
}


export const creatingNewEmployer = employer => dispatch => {
  axios.post('/api/employers', employer)
  .then(res => res.data)
  .catch(err => console.error(`Couldn't create employer ${employer.name}...${err.stack}`))
}

export const updateUser = (user) => dispatch => {
  //set loading state to true to trigger UI changes
  // create the new user
  axios.put(`/api/users/${user.id}`, {user})
  .then(res => res.data)
  // if the user is successfully created, we receive the updated to users list
  .then(newUser => {
    dispatch(gettingAllUsers())
    dispatch(login(newUser.email, newUser.password, history))
    dispatch(whoami())
  })
  // otherwise we catch the error...
  .catch(err => console.error(`Sorry, cuz. We couldn't update that user...${err.stack}`))
}

export const uploadingAvatar = (user, file) => dispatch => {
  dispatch(beginUploading())
  user.image_url = `https://s3.amazonaws.com/hireblack/avatars/${file.name}`
  const options = {headers: {'Content-Type':file.type}};
  axios.get(`http://localhost:1337/api/users/avatars/sign-s3?&file-name=${file.name}&file-type=${file.type}`)
  .then(res => axios.put(res.data.signedRequest, file, options))
  .then(() => {
    dispatch(updateUser(user))
  })
  .then(() => dispatch(doneUploading()))
  .catch(err => console.error(`Mang, I couldn't upload the avatar! ${err.stack}`))
}

export const uploadingResume = (user, file) => dispatch => {
  dispatch(beginUploading())
  user.resume_url = `https://s3.amazonaws.com/hireblack/resumes/${file.name}`
  const options = {headers: {'Content-Type':file.type}};
  axios.get(`http://localhost:1337/api/users/resumes/sign-s3?&file-name=${file.name}&file-type=${file.type}`)
  .then(res => axios.put(res.data.signedRequest, file, options))
  .then(() => {
    dispatch(updateUser(user))
  })
  .then(() => dispatch(doneUploading()))
  .catch(err => console.error(`Mang, I couldn't upload the resume! ${err.stack}`))
}

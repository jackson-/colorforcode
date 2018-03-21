import axios from 'axios'
import { AUTHENTICATED, AUTHENTICATING, CREATE_USER } from '../constants'
import { receiveNextRoute } from '../routeReducer'
import { receiveAlert } from './alert'

/* --------- PURE ACTION CREATORS --------- */
export const authenticated = user => ({
  user,
  type: AUTHENTICATED
})

export const authenticating = () => ({
  type: AUTHENTICATING
})

export const createNewUser = () => ({
  type: CREATE_USER
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const whoami = (history, next, origin) => dispatch => {
  dispatch(authenticating())
  axios.get(`/api/auth/whoami`)
    .then(response => {
      const user = response.data
      dispatch(authenticated(user))
      if (history) {
        if (next) {
          history.push(next)
          receiveNextRoute('')
        } else {
          history.push('/dashboard')
        }
      }
      if (origin === 'login') {
        dispatch(receiveAlert({
          type: 'error',
          style: 'danger',
          title: 'Uh Oh!',
          body: 'Sorry, we weren\'t able to log you into your account. Please double check your email and password and try again.',
          next: null
        }))
      }
    })
    .catch(err => {
      console.error(err.stack)
      dispatch(authenticated(null))
    })
}

export const login = (email, password, history, next) => dispatch => {
  axios.post(`/api/auth/login/local`, {email, password})
    .then(() => dispatch(whoami(history, next)))
    .catch(() => dispatch(whoami(null, null, 'login')))
}

export const creatingNewUser = (user, history, next) => dispatch => {
  // set loading state to true to trigger UI changes
  user.coords.crs = {type: 'name', properties: {name: 'EPSG:32661'}}
  dispatch(createNewUser())
  // create the new user
  axios.post(`/api/users`, user)
    .then(res => res.data)
    // if successfully created, we automatically log them in
    .then(newUser => {
      dispatch(login(newUser.email, newUser.password, history, next))
    })
    // otherwise we catch the error...
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

export const logout = () => dispatch => {
  axios.post(`/api/auth/logout`)
    .then(() => {
      dispatch(whoami())
    })
    .catch(() => dispatch(whoami()))
}

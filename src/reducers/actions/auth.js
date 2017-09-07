import axios from 'axios'
import { AUTHENTICATED, AUTHENTICATING } from '../constants'
import { receiveNextRoute } from '../routeReducer'

/* --------- PURE ACTION CREATORS --------- */
export const authenticated = user => ({
  user,
  type: AUTHENTICATED
})

export const authenticating = () => ({
  type: AUTHENTICATING
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

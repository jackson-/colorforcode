import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const store = createStore(
  rootReducer,
  applyMiddleware(
    createLogger({collapsed: true}),
    thunkMiddleware
  )
)

export default store

const history = store.getState().router.history || null
store.dispatch(whoami(history))

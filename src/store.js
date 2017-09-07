import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { whoami } from './reducers/actions/auth'

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    createLogger({collapsed: true}),
    thunkMiddleware
  ),
)

export default store

store.dispatch(whoami())

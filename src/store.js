import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { whoami } from './reducers/actions/auth'

let middleware = [thunkMiddleware]
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middleware.push(createLogger({ collapsed: true }))
}

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middleware),
)

export default store

store.dispatch(whoami())

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import Container from './components/app/App'
import store from './store'
import './index.css'

import Raven from 'raven-js';
import { sentry_url } from '../config/sentry.js';

Raven.config(sentry_url).install();

const App = () => (
  <Provider store={store}>
    <Router>
      <Container />
    </Router>
  </Provider>
)

render(<App />, document.getElementById('root'))

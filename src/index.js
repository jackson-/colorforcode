import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Container from './components/app/App'
import Home from './components/home/Home'
import About from './components/about/About'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import './index.css'
import PostNewJobForm from './components/jobs/PostNewJobForm'
import JobDetailPage from './components/jobs/JobDetailPage'
import store from './store'



const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact strict path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/register' component={RegisterForm} />
          <Route exact path='/login' component={LoginForm} />
          <Route exact path='/post-new-job' component={PostNewJobForm}/>
          <Route exact path='/job/:id' component={JobDetailPage} />
        </Switch>
      </Container>
    </Router>
  </Provider>
)

export default App

render(<App />, document.getElementById('root'))

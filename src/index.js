import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import Container from './components/app/App'
import Home from './components/home/Home'
import About from './components/about/About'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import './index.css'
import PostNewJobForm from './components/jobs/PostNewJobForm'
import JobDetailPage from './components/jobs/JobDetailPage'
import EmployerDashboard from './components/employers/Dashboard'
import EmployerLoginForm from './components/auth/EmployerLoginForm'
import EmployerRegisterForm from './components/auth/EmployerRegisterForm'
import store from './store'

const authTransition = function authTransition() {
  let user = null
  try {
    user = sessionStorage.getItem('user')
  } catch(exception){
    console.log("ESXC", exception)
  }
  return user
}

const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact strict path='/' render={() => (authTransition() ? (<Home />) : (<Redirect to="/login"/>))}/>
          <Route exact path='/about' component={About} />
          <Route exact path='/register' component={RegisterForm} />
          <Route exact path='/login' component={LoginForm} />
          <Route exact path='/post-new-job' component={PostNewJobForm}/>
          <Route exact path='/job/:id' component={JobDetailPage} />
          <Route exact path='/employer-login' component={EmployerLoginForm} />
          <Route exact path='/employer-register' component={EmployerRegisterForm} />
          <Route exact path='/employer-dashboard' component={EmployerDashboard}/>
        </Switch>
      </Container>
    </Router>
  </Provider>
)

export default App

render(<App />, document.getElementById('root'))

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Container from './components/app/App'
import Home from './components/home/Home'
import About from './components/about/About'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import PostNewJobForm from './components/jobs/PostNewJobForm'
import JobDetailPage from './components/jobs/JobDetailPage'
import Dashboard from './components/dashboard/Dashboard'
// import EmployerLoginForm from './components/auth/EmployerLoginForm'
// import EmployerRegisterForm from './components/auth/EmployerRegisterForm'
import store from './store'
import './index.css'

// const authTransition = function() {
//   let user = null
//   try {
//     user = sessionStorage.getItem('user')
//   } catch(exception){
//     console.error("ESXC", exception.stack)
//   }
//   return user
// }

const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact strict path='/' component={Home}/>
          <Route exact path='/about' component={About} />
          <Route exact path='/register' component={RegisterForm} />
          <Route exact path='/login' component={LoginForm} />
          <Route exact path='/post-new-job' component={PostNewJobForm} />
          <Route exact path='/job/:id' component={JobDetailPage} />
          <Route exact path='/dashboard' component={Dashboard} />
        </Switch>
      </Container>
    </Router>
  </Provider>
)

render(<App />, document.getElementById('root'))

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Container from './components/app/App'
import Home from './components/home/Home'
import ProjectsPage from './components/projects/ProjectsPage'
import About from './components/about/About'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import JobDetailPage from './components/jobs/JobDetailPage'
import Dashboard from './components/dashboard/EmployerDashboard'
import SearchTalent from './components/search/CandidateSearchPage'
import ProjectCreate from './components/projects/CreateProjectForm'
import store from './store'
import './index.css'

const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/register' component={RegisterForm} />
          <Route path='/login' component={LoginForm} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/dashboard/post-new-job' component={Dashboard} />
          <Route path='/dashboard/manage-jobs' render={() => <h1>Manage Jobs</h1>} />
          <Route path='/dashboard/search-talent' component={SearchTalent} />
          <Route path='/dashboard/edit-profile' render={() => <h1>Edit Profile</h1>} />
          <Route path='/jobs/:id' component={JobDetailPage} />
          <Route path='/projects' component={ProjectsPage} />
          <Route path='/projects/create' component={ProjectCreate} />
        </Switch>
      </Container>
    </Router>
  </Provider>
)

render(<App />, document.getElementById('root'))

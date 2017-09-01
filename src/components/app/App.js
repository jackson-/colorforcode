import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  updatingUser,
  uploadingResume,
  logout,
  gettingAllUsers,
  filteringUsers,
  buildBodyThenSearchUsers
} from '../../reducers/actions/users'

import {
  applyingToJob,
  gettingJobById,
  updatingJob,
  deletingJob,
  savingJob,
  unsavingJob,
  creatingNewJob,
  gettingAllJobs,
  filteringJobs,
  buildBodyThenSearchJobs
} from '../../reducers/actions/jobs'

import { gettingAllSkills } from '../../reducers/actions/skills'

import {
  gettingProjectById,
  updatingProject,
  receiveProject,
  deletingProject
} from 'APP/src/reducers/actions/projects'

import MainNav from './Navbar'
import Home from '../home/Home'
import About from '../about/About'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'
import UserProfile from '../users/UserProfile'
import JobDetailPage from '../jobs/JobDetailPage'
import Dashboard from '../dashboard/Dashboard'
import AlertModal from '../utilities/AlertModal'
import NavCollapse from './NavCollapse'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showDashMenu: false,
      opacity: '0',
      height: '0',
      padding: '0',
      marginBottom: '0',
      display: 'none'
    }
  }

  toggleDashMenu = event => {
    let height = this.props.user.is_employer ? '215px' : '300px'
    if (event) event.preventDefault()
    this.setState({
      showDashMenu: true,
      height: this.state.height === height ? '0' : height,
      padding: this.state.padding === '75px 0 10px 0' ? '0' : '75px 0 10px 0',
      marginBottom: this.state.marginBottom === '-60px' ? '0' : '-60px',
      opacity: this.state.opacity === '1' ? '0' : '1',
      display: this.state.display === 'block' ? 'none' : 'block'
    })
  }

  showPostJob = user => {
    let display = !user || (user && user.is_employer)
      ? 'block'
      : 'none'
    return display
  }

  /*
    The .active class is being applied to '/' even when it isn't the current
    location.pathname because all other paths are its children. This method
    corrects for that.
  */
  onlyOneActiveMatch = (match, location) => {
    if (match) return location.pathname === match.path
    else return false
  }

  logOut = history => event => {
    event.preventDefault()
    this.props.logOut(history)
  }

  render () {
    const dashMenuStyle = {
      padding: this.state.padding,
      height: this.state.height,
      marginBottom: this.state.marginBottom,
      opacity: this.state.opacity
    }

    const dashMobileMenu = {
      employer: [
        {to: '/dashboard/post-new-job', glyph: 'plus-sign', text: 'Post New Job'},
        {to: '/dashboard/manage-jobs', glyph: 'list-alt', text: 'Manage Jobs'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'}
      ],
      applicant: [
        {to: '/dashboard/applications', glyph: 'list-alt', text: 'Applications'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'},
        {to: '/dashboard/saved-jobs', glyph: 'heart', text: 'Saved Jobs'},
        {to: '/dashboard/add-project', glyph: 'plus-sign', text: 'Add Project'},
        {to: '/dashboard/projects', glyph: 'briefcase', text: 'Projects'}
      ]
    }

    const {
      alert,
      user,
      job,
      fetchingJob,
      updateJob,
      deleteJob,
      getJob,
      getJobs,
      filterJobs,
      advancedFilterJobs,
      saveJob,
      unsaveJob,
      applyToJob,
      closeJob,
      duplicateJob,
      getUsers,
      filterUsers,
      advancedFilterUsers,
      updateUser,
      updateProject,
      uploadResume,
      deleteProject,
      getProject,
      skills,
      history
    } = this.props
    return (
      <Router>
        <div>
          <MainNav
            history={history}
            user={this.props.user}
            logOut={this.logOut}
            toggleDashMenu={this.toggleDashMenu}
            onlyOneActiveMatch={this.onlyOneActiveMatch}
            showPostJob={this.showPostJob}
          />
          <NavCollapse
            collapse={this.toggleDashMenu}
            style={dashMenuStyle}
            state={this.state}
            user={user}
            menu={dashMobileMenu}
            history={history}
          />
          {
            alert &&
            <AlertModal
              style={alert.style}
              title={alert.title}
              body={alert.body}
              show={this.props.alert !== null}
              next={alert.next}
            />
          }
          <Grid fluid className='App'>
              {/* PUBLIC ROUTES */}
              <Route exact strict path='/' component={() => (
                <Home
                  user={user}
                  getJobs={getJobs}
                  filterJobs={filterJobs}
                  advancedFilterJobs={advancedFilterJobs}
                  getUsers={getUsers}
                  filterUsers={filterUsers}
                  advancedFilterUsers={advancedFilterUsers}
                />
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/jobs/:id' component={({match, history}) => (
                <JobDetailPage
                  skills={skills}
                  getJob={getJob}
                  updateJob={updateJob}
                  deleteJob={deleteJob}
                  applyToJob={applyToJob}
                  saveJob={saveJob}
                  match={match}
                  history={history}
                />
              )} />
              <Route exact path='/register' component={() => {
                if (!user) return <RegisterForm />
                return <Redirect to='/dashboard' />
              }} />
              <Route exact path='/login' component={() => {
                if (!user) return <LoginForm />
                return <Redirect to='/dashboard' />
              }} />
              <Route exact path='/users/:id' component={UserProfile} />

              {/* PRIVATE ROUTES */}
              <Route exact path='/dashboard' component={() => {
                return user && user.is_employer
                  ? <Redirect to='/dashboard/manage-jobs' />
                  : <Redirect to='/dashboard/saved-jobs' />
              }} />
              <Route
                exact
                path='/dashboard/:action'
                component={({match, history, location}) => {
                  if (!user) return <Redirect to='/login' />
                  return (
                    <Dashboard
                      getJob={getJob}
                      updateJob={updateJob}
                      deleteJob={deleteJob}
                      applyToJob={applyToJob}
                      saveJob={saveJob}
                      unsaveJob={unsaveJob}
                      closeJob={closeJob}
                      duplicateJob={duplicateJob}
                      getProject={getProject}
                      updateProject={updateProject}
                      deleteProject={deleteProject}
                      history={history}
                      location={location}
                      match={match}
                      skills={skills}
                      user={user}
                      updateUser={updateUser}
                      uploadResume={uploadResume}
                    />
                  )
                }}
              />
              <Route
                exact
                path='/dashboard/:action/:id'
                component={({match, history, location}) => {
                  if (!user) return <Redirect to='/login' />
                  return (
                    <Dashboard
                      getJob={getJob}
                      updateJob={updateJob}
                      deleteJob={deleteJob}
                      applyToJob={applyToJob}
                      saveJob={saveJob}
                      unsaveJob={unsaveJob}
                      closeJob={closeJob}
                      duplicateJob={duplicateJob}
                      getProject={getProject}
                      updateProject={updateProject}
                      deleteProject={deleteProject}
                      history={history}
                      location={location}
                      match={match}
                      skills={skills}
                      user={user}
                      updateUser={updateUser}
                      uploadResume={uploadResume}
                    />
                  )
                }}
              />
          </Grid>
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  user: PropTypes.any,
  alert: PropTypes.object,
  logOut: PropTypes.func.isRequired,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  project: PropTypes.object,
  job: PropTypes.object,
  fetchingJob: PropTypes.bool,
  jobs: PropTypes.arrayOf(PropTypes.object),
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.object),
  getUsers: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func,
  uploadResume: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  saveJob: PropTypes.func.isRequired,
  getJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  getJobs: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  skills: PropTypes.array
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  // users: state.users.all,
  alert: state.alert,
  project: state.projects.currentProject,
  loading: state.loading,
  skills: state.skills.all,
  // jobs: state.jobs.all,
  job: state.jobs.currentJob,
  fetchingJob: state.jobs.fetchingJob
})

const mapDispatchToProps = dispatch => ({
  logOut: (history) => dispatch(logout(history)),
  applyToJob: (userId, jobId, history) => dispatch(applyingToJob(userId, jobId, history)),
  unsaveJob: (userId, savedJobs) => dispatch(unsavingJob(userId, savedJobs)),
  getJob: jobId => dispatch(gettingJobById(jobId)),
  updateJob: (job, history) => dispatch(updatingJob(job, history)),
  deleteJob: (id, history) => dispatch(deletingJob(id, history)),
  saveJob: (userId, savedJobs) => dispatch(savingJob(userId, savedJobs)),
  getJobs: () => dispatch(gettingAllJobs()),
  getSkills: () => dispatch(gettingAllSkills()),
  filterJobs: query => dispatch(filteringJobs(query)),
  advancedFilterJobs: (bodyBuilder, coords, from) => {
    dispatch(buildBodyThenSearchJobs(bodyBuilder, coords, from))
  },
  closeJob: (id, history) => dispatch(deletingJob(id, history)),
  duplicateJob: (job, history) => dispatch(creatingNewJob(job, history)),
  updateUser: (user) => dispatch(updatingUser(user)),
  getUsers: post => dispatch(gettingAllUsers()),
  filterUsers: query => dispatch(filteringUsers(query)),
  advancedFilterUsers: (bodyBuilderFunc, coords) => {
    return dispatch(buildBodyThenSearchUsers(bodyBuilderFunc, coords))
  },
  uploadResume: (user, file) => dispatch(uploadingResume(user, file)),
  getProject: (id) => dispatch(gettingProjectById(id)),
  updateProject: (project, history) => dispatch(updatingProject(project, history)),
  deleteProject: (projectId, history) => dispatch(deletingProject(projectId, history)),
  receiveProject: (project) => dispatch(receiveProject(project))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

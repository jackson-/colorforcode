import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { logout } from '../../reducers/actions/auth'
import {
  updatingUser,
  gettingAllUsers,
  filteringUsers,
  advancedFilteringUsers } from '../../reducers/actions/users'

import {
  applyingToJob,
  gettingJobById,
  updatingJob,
  closingJob,
  savingJob,
  unsavingJob,
  creatingNewJobs,
  gettingAllJobs,
  filteringJobs,
  advancedFilteringJobs } from '../../reducers/actions/jobs'

import {
  gettingAllSkills,
  creatingNewSkills,
  receiveSelectedSkills } from '../../reducers/actions/skills'

import {
  gettingProjectById,
  updatingProject,
  receiveProject,
  deletingProject } from '../../reducers/actions/projects'
import { receiveDashLocation, receiveNextRoute } from '../../reducers/routeReducer'
import { receiveAlert } from '../../reducers/actions/alert'

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
import LoadingSpinner from '../utilities/LoadingSpinner'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showDashMenu: false,
      opacity: '0',
      height: '0',
      padding: '0',
      transform: 'translateY(-300px)',
      closing: false
    }
  }

  componentWillMount(){
    if(!this.props.users){
      this.props.getUsers()
    }
  }

  toggleDashMenu = event => {
    if (event) event.preventDefault()
    this.setState({
      showDashMenu: !this.state.showDashMenu,
      padding: this.state.padding === '75px 0 10px 0' ? '0' : '75px 0 10px 0',
      opacity: this.state.opacity === '1' ? '0' : '1',
      transform: this.state.transform === 'translateY(-300px)'
        ? 'translateY(0)'
        : 'translateY(-300px)',
      closing: this.state.showDashMenu
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

  handleNewSkills = selected => {
    const {createNewSkills, receiveSelectedSkills} = this.props
    // first we check for new skills and filter them out into a separate list
    let selectedSkillsNew = selected.filter(skill => skill.className !== undefined)
    // then we filter existing skills into a separate list
    const selectedSkillsExisting = selected.filter(skill => !skill.className)
    // if the user made any new skills, we format them for Sequelize,
    // dispatch an action to create them, and then update the selected skills list
    if (selectedSkillsNew.length) {
      selectedSkillsNew = selectedSkillsNew.map(skill => {
        return {title: skill.title, template: false}
      })
      return createNewSkills(selectedSkillsNew, selectedSkillsExisting)
    }
    receiveSelectedSkills(selected)
  }

  handleClickPostJob = event => {
    const {user, receiveNext, receiveAlert, history} = this.props
    if (!user) {
      receiveNext('/dashboard/post-new-job')
      receiveAlert({
        type: 'error',
        style: 'warning',
        title: 'Not signed in',
        body: 'Welcome! Log in or register for an employer account, then we\'ll send you to your dashboard to post a new job.',
        next: '',
        footer: true,
        footerActions: [
          {
            text: 'Log in',
            next: '/login'
          },
          {
            text: 'Register',
            next: '/register'
          }
        ]
      })
    } else {
      history.push('/dashboard/post-new-job')
    }
  }

  render () {
    const {
      alert,
      user,
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
      deleteProject,
      getProject,
      receiveLocation,
      receiveNext,
      receiveAlert,
      authenticating
    } = this.props
    const animated = !this.state.showDashMenu && !this.state.closing
    const anim = animated ? 'animated' : ''
    return (
      <Router>
        {
          authenticating
            ? <LoadingSpinner />
            : (
              <div>
                <MainNav
                  receiveLocation={receiveLocation}
                  handleClickPostJob={this.handleClickPostJob}
                  user={this.props.user}
                  logOut={this.logOut}
                  toggleDashMenu={this.toggleDashMenu}
                  onlyOneActiveMatch={this.onlyOneActiveMatch}
                  showPostJob={this.showPostJob}
                />
                <NavCollapse
                  collapse={this.toggleDashMenu}
                  state={this.state}
                  isEmployer={(user ? user.is_employer : false)}
                />
                <div
                  className='padding-fix'
                  style={{
                    height: this.state.showDashMenu ? '0' : '60px',
                    background: '#404648'
                  }}
                />
                {
                  alert &&
                  <AlertModal
                    style={alert.style}
                    title={alert.title}
                    body={alert.body}
                    show={this.props.alert !== null}
                    next={alert.next}
                    footer={alert.footer ? alert.footer : false}
                    footerActions={alert.footerActions}
                  />
                }
                <Grid fluid className='App'>
                  {/* PUBLIC ROUTES */}

                  <Route exact strict path='/' component={() => (
                    <Home
                      animated={anim}
                      showDashMenu={this.state.showDashMenu}
                      coords={user ? user.coords : ''}
                      isEmployer={(user ? user.is_employer : false)}
                      getJobs={getJobs}
                      filterJobs={filterJobs}
                      advancedFilterJobs={advancedFilterJobs}
                      getUsers={getUsers}
                      filterUsers={filterUsers}
                      advancedFilterUsers={advancedFilterUsers}
                    />
                  )} />
                  <Route exact path='/about' component={() => (
                    <About animated={anim} />
                  )} />
                  <Route exact path='/jobs/:id' component={({match, history}) => (
                    <JobDetailPage
                      getJob={getJob}
                      updateJob={updateJob}
                      deleteJob={deleteJob}
                      applyToJob={applyToJob}
                      saveJob={saveJob}
                      unsaveJob={unsaveJob}
                      match={match}
                      history={history}
                      receiveAlert={receiveAlert}
                      receiveNext={receiveNext}
                      animated={anim}
                    />
                  )} />
                  <Route exact path='/register' component={() => (
                    <RegisterForm animated={anim} />
                  )} />
                  <Route exact path='/login' component={() => (
                    <LoginForm animated={anim} />
                  )} />
                  <Route exact path='/users/:id' component={() => (
                    <UserProfile animated={anim} />
                  )} />

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
                          handleNewSkills={this.handleNewSkills}
                          user={user}
                          updateUser={updateUser}
                          alert={alert}
                          receiveAlert={receiveAlert}
                          receiveNext={receiveNext}
                          animated={anim}
                        />
                      )
                    }}
                  />
                  <Route
                    exact
                    path='/dashboard/:action/:id'
                    component={({match, history, location}) => {
                      return (
                        <Dashboard
                          getJob={getJob}
                          updateJob={updateJob}
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
                          handleNewSkills={this.handleNewSkills}
                          user={user}
                          updateUser={updateUser}
                          alert={alert}
                          receiveAlert={receiveAlert}
                          receiveNext={receiveNext}
                          animated={anim}
                        />
                      )
                    }}
                  />
                </Grid>
              </div>
            )
        }
      </Router>
    )
  }
}

App.propTypes = {
  authenticating: PropTypes.bool,
  user: PropTypes.any,
  alert: PropTypes.object,
  next: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  project: PropTypes.object,
  logOut: PropTypes.func.isRequired,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  getUsers: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func,
  updateUser: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
  saveJob: PropTypes.func.isRequired,
  getJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  getJobs: PropTypes.func.isRequired,
  createNewSkills: PropTypes.func,
  receiveSelectedSkills: PropTypes.func,
  receiveLocation: PropTypes.func,
  receiveNext: PropTypes.func,
  receiveAlert: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  alert: state.alert,
  dashLocation: state.location.dashLocation,
  authenticating: state.auth.authenticating
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logout()),
  applyToJob: (userId, jobId, history) => dispatch(applyingToJob(userId, jobId, history)),
  unsaveJob: (userId, savedJobs) => dispatch(unsavingJob(userId, savedJobs)),
  getJob: jobId => dispatch(gettingJobById(jobId)),
  updateJob: (job, history) => dispatch(updatingJob(job, history)),
  saveJob: (userId, savedJobs, successAlert) => dispatch(savingJob(userId, savedJobs, successAlert)),
  getJobs: () => dispatch(gettingAllJobs()),
  getSkills: () => dispatch(gettingAllSkills()),
  createNewSkills: (skills, selected) => dispatch(creatingNewSkills(skills, selected)),
  receiveSelectedSkills: skills => dispatch(receiveSelectedSkills(skills)),
  filterJobs: query => dispatch(filteringJobs(query)),
  advancedFilterJobs: (body) => dispatch(advancedFilteringJobs(body)),
  closeJob: (id, history) => dispatch(closingJob(id, history)),
  duplicateJob: (data, history) => dispatch(creatingNewJobs(data, history)),
  updateUser: (user) => dispatch(updatingUser(user)),
  getUsers: post => dispatch(gettingAllUsers()),
  filterUsers: query => dispatch(filteringUsers(query)),
  advancedFilterUsers: (body) => dispatch(advancedFilteringUsers(body)),
  getProject: (id) => dispatch(gettingProjectById(id)),
  updateProject: (project, history) => dispatch(updatingProject(project, history)),
  deleteProject: (projectId, history) => dispatch(deletingProject(projectId, history)),
  receiveProject: (project) => dispatch(receiveProject(project)),
  receiveLocation: location => event => dispatch(receiveDashLocation(location)),
  receiveNext: route => dispatch(receiveNextRoute(route)),
  receiveAlert: alert => dispatch(receiveAlert(alert))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

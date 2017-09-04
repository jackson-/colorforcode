import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import PostAJob from '../jobs/PostNewJobForm'
import ManageJobs from './ManageJobs'
import EditProfile from './EditProfile'
import ApplicantsList from './ApplicantsList'
import UserProfile from '../users/UserProfile'
import JobDetailPage from '../jobs/JobDetailPage'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class EmployerDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      post: false,
      manage: true,
      search: false,
      profile: false
    }
  }

  render () {
    const {
      user,
      handleNewSkills,
      updateUser,
      location,
      getJob,
      updateJob,
      deleteJob,
      closeJob,
      duplicateJob,
      receiveAlert,
      receiveNext
    } = this.props
    const firstName = user ? user.first_name : ''
    const jobs = user && user.is_employer && [...user.employer.listings]
    return (
      <Router>
        <Row className='Dashboard'>
          <div className='container__flex'>
            <Col xsHidden sm={3} md={3} lg={3} className='Dashboard__sidebar'>
              <Sidebar
                header={`Welcome, ${firstName}`}
                content={
                  <Nav className='Sidebar__button-container' stacked>
                    <LinkContainer to='/dashboard/post-new-job' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='plus-sign' /> Post New Job</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/dashboard/applicants' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='list-alt' /> Applicants</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/dashboard/manage-jobs' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='list-alt' /> Manage Jobs</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/dashboard/edit-profile' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='user' /> Edit Profile</NavItem>
                    </LinkContainer>
                  </Nav>
                }
              />
            </Col>
            <Col xs={12} sm={9} md={9} lg={9} className='Dashboard__content'>
              <ScrollToTopOnMount />
              <Switch>
                <Route exact path='/dashboard/edit-profile' component={() => (
                  <EditProfile user={user} updateUser={updateUser} location={location} />
                )} />
                <Route exact path='/dashboard/jobs/:id' component={({match, history}) => (
                  <JobDetailPage
                    user={user}
                    getJob={getJob}
                    updateJob={updateJob}
                    deleteJob={deleteJob}
                    match={match}
                    history={history}
                    handleNewSkills={handleNewSkills}
                  />
                )} />
                <Route path='/dashboard/post-new-job' component={({match, history}) => {
                  if (!user) {
                    receiveNext('/dashboard/post-new-job')
                    return receiveAlert({
                      type: 'error',
                      style: 'warning',
                      title: 'Not signed in!',
                      body: 'Welcome! Please log in or register, and we\'ll  post a new job.',
                      next: ''
                    })
                  }
                  return <PostAJob handleNewSkills={handleNewSkills} />
                }} />
                <Route exact path='/dashboard/applicants' component={() => (
                  <ApplicantsList
                    location={location}
                    jobs={jobs}
                  />
                )} />
                <Route exact path='/dashboard/manage-jobs' component={() => (
                  <ManageJobs
                    location={location}
                    closeJob={closeJob}
                    duplicateJob={duplicateJob}
                    jobs={jobs}
                  />
                )} />
                <Route exact path='/dashboard/users/:id' component={() => (
                  <UserProfile />
                )} />
              </Switch>
            </Col>
          </div>
        </Row>
      </Router>
    )
  }
}

EmployerDashboard.propTypes = {
  skills: PropTypes.array,
  handleNewSkills: PropTypes.func,
  user: PropTypes.any,
  job: PropTypes.object,
  jobs: PropTypes.array,
  location: PropTypes.object,
  getJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  receiveAlert: PropTypes.func,
  receiveNext: PropTypes.func
}

export default withRouter(EmployerDashboard)

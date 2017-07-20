import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import { connect } from 'react-redux'
import { gettingUserJobs, deletingJob, creatingNewJob } from '../../reducers/actions/jobs'
import { updatingUser } from '../../reducers/actions/users'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import PostAJob from '../jobs/PostNewJobForm'
import ManageJobs from './ManageJobs'
import EditProfile from './EditProfile'
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
    const {user} = this.props
    const firstName = user ? user.first_name : ''
    const jobs = user && user.is_employer && [...user.employer.listings]

    if (!this.props.user) return <Redirect to='/login' from='/dashboard/manage-jobs' />

    return (
      <Router>
        <Row className='Dashboard'>
          <div className='container__flex'>
            <Col xsHidden sm={3} md={3} lg={3} className='Dashboard__sidebar'>
              <Sidebar
                headerText={`Welcome, ${firstName}`}
                content={
                  <Nav className='Sidebar__button-container' stacked>
                    <LinkContainer to='/dashboard/post-new-job' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='plus-sign' /> Post New Job</NavItem>
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
              <Route exact path='/dashboard/post-new-job' component={PostAJob} />
              <Route exact path='/dashboard/manage-jobs' component={({history}) => (
                <ManageJobs
                  history={history}
                  closeJob={this.props.closeJob}
                  duplicateJob={this.props.duplicateJob}
                  jobs={jobs}
                />
              )} />
              <Route exact path='/dashboard/edit-profile' component={({history}) => (
                <EditProfile
                  user={user}
                  updateUser={this.props.updateUser}
                  history={history}
                />
              )} />
              <Route exact path='/dashboard/jobs/:id' component={JobDetailPage} />
            </Col>
          </div>
        </Row>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  getJobs: (employerId) => dispatch(gettingUserJobs(employerId)),
  closeJob: (id, history) => dispatch(deletingJob(id, history)),
  duplicateJob: (job, history) => dispatch(creatingNewJob(job, history)),
  updateUser: (user) => dispatch(updatingUser(user))
})

EmployerDashboard.propTypes = {
  user: PropTypes.object,
  jobs: PropTypes.array,
  getJobs: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployerDashboard))

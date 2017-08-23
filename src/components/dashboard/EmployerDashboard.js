import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Redirect, Route, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import PostAJob from '../jobs/PostNewJobForm'
import ManageJobs from './ManageJobs'
import EditProfile from './EditProfile'
import ApplicantsList from './ApplicantsList'
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
    const {user, updateUser} = this.props
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
              <Route
                exact
                location={location}
                path='/dashboard/post-new-job'
                component={PostAJob}
              />
              <Route exact path='/dashboard/applicants' component={() => (
                <ApplicantsList
                  jobs={jobs}
                />
              )} />
              <Route exact path='/dashboard/manage-jobs' component={() => (
                <ManageJobs
                  closeJob={this.props.closeJob}
                  duplicateJob={this.props.duplicateJob}
                  jobs={jobs}
                />
              )} />
              <Route exact path='/dashboard/edit-profile' component={() => (
                <EditProfile user={user} updateUser={updateUser} />
              )} />
              <Route exact path='/dashboard/jobs/:id' component={JobDetailPage} />
            </Col>
          </div>
        </Row>
      </Router>
    )
  }
}

EmployerDashboard.propTypes = {
  user: PropTypes.object,
  jobs: PropTypes.array,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
}

export default withRouter(EmployerDashboard)

import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import PostAJob from '../jobs/PostNewJobForm'
import ManageJobs from './ManageJobs'
import EditProfile from './EditProfile'
import JobDetailPage from '../jobs/JobDetailPage'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

const EmployerDashboard = props => (
  <Router>
    <Row className='Dashboard'>
      <ScrollToTopOnMount />
      <div className='container__flex'>
        <Col xsHidden sm={3} md={3} lg={3} className='Dashboard__sidebar'>
          <Sidebar
            headerText={`Welcome, ${props.user.first_name}`}
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
          <Route exact path='/dashboard/post-new-job' component={PostAJob} />
          <Route exact path='/dashboard/manage-jobs' component={({history}) => (
            <ManageJobs
              history={history}
              closeJob={props.closeJob}
              duplicateJob={props.duplicateJob}
              jobs={props.jobs}
            />
          )} />
          <Route exact path='/dashboard/edit-profile' component={({history}) => (
            <EditProfile
              user={props.user}
              updateUser={props.updateUser}
              history={history}
            />
          )} />
          <Route exact path='/dashboard/jobs/:id' component={JobDetailPage} />
        </Col>
      </div>
    </Row>
  </Router>
)

EmployerDashboard.propTypes = {
  user: PropTypes.object,
  jobs: PropTypes.array,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
}

export default EmployerDashboard

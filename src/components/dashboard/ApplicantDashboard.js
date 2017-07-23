import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import EditProfile from './EditProfile'
import Projects from '../projects/ProjectsPage'
import ProjectCreate from '../projects/CreateProjectForm'
import EditProject from '../projects/EditProjectForm'
import JobDetailPage from '../jobs/JobDetailPage'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

const ApplicantDashboard = ({user, updateUser}) => (
  <Router>
    <Row className='Dashboard'>
      <ScrollToTopOnMount />
      <div className='container__flex'>
        <Col xsHidden sm={3} md={3} lg={3} className='Dashboard__sidebar'>
          <Sidebar
            headerText={`Welcome, ${user.first_name}`}
            content={
              <Nav className='Sidebar__button-container' stacked>
                <LinkContainer to='/dashboard/applications' className='Dashboard__nav-item'>
                  <NavItem><Glyphicon glyph='list-alt' /> Applications</NavItem>
                </LinkContainer>
                <LinkContainer to='/dashboard/edit-profile' className='Dashboard__nav-item'>
                  <NavItem><Glyphicon glyph='user' /> Edit Profile</NavItem>
                </LinkContainer>
                <LinkContainer to='/dashboard/saved-jobs' className='Dashboard__nav-item'>
                  <NavItem><Glyphicon glyph='heart' /> Saved Jobs</NavItem>
                </LinkContainer>
                <LinkContainer to='/dashboard/projects' className='Dashboard__nav-item'>
                  <NavItem><Glyphicon glyph='briefcase' /> Projects</NavItem>
                </LinkContainer>
              </Nav>
            }
          />
        </Col>
        <Col xs={12} sm={9} md={9} lg={9} className='Dashboard__content'>
          <Route path='/dashboard/applications' component={({history}) => (
            <h1>APPLICATION HISTORY</h1>
          )} />
          <Route path='/dashboard/saved-jobs' component={({history}) => (
            <h1>SAVED JOBS</h1>
          )} />
          <Route path='/dashboard/projects' component={Projects} />
          <Route path='/dashboard/projects/create' component={ProjectCreate} />
          <Route path='/dashboard/projects/:id' component={EditProject} />
          <Route path='/dashboard/edit-profile' component={() => (
            <EditProfile user={user} updateUser={updateUser} />
          )} />
          <Route path='/dashboard/saved-jobs/:id' component={JobDetailPage} />
        </Col>
      </div>
    </Row>
  </Router>
)

ApplicantDashboard.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func.isRequired
}

export default ApplicantDashboard

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import { updatingUser } from '../../reducers/actions/users'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import EditProfile from './EditProfile'
import Projects from '../projects/ProjectsPage'
import ProjectCreate from '../projects/CreateProjectForm'
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
          <Route exact path='/dashboard/applications' component={({history}) => (
            <h1>APPLICATION HISTORY</h1>
          )} />
          <Route exact path='/dashboard/saved-jobs' component={({history}) => (
            <h1>SAVED JOBS</h1>
          )} />
          <Route exact path='/dashboard/projects' component={Projects} />
          <Route exact path='/dashboard/projects/create' component={ProjectCreate} />
          <Route exact path='/dashboard/edit-profile' component={({history}) => (
            <EditProfile
              user={user}
              updateUser={updateUser}
              history={history}
            />
          )} />
          <Route exact path='/dashboard/saved-jobs/:id' component={JobDetailPage} />
        </Col>
      </div>
    </Row>
  </Router>
)

ApplicantDashboard.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  updateUser: (user) => dispatch(updatingUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplicantDashboard))

import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import Applications from './Applications'
import EditProfile from './EditProfile'
import Projects from './Projects'
import ProjectCreate from '../projects/CreateProjectForm'
import EditProject from '../projects/EditProjectForm'
import JobDetailPage from '../jobs/JobDetailPage'
import SavedJobs from './SavedJobs'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import ImageUploader from './ImageUploader'

const ApplicantDashboard = ({
  skills,
  handleNewSkills,
  jobs,
  user,
  project,
  getProject,
  updateUser,
  updateProject,
  uploadResume,
  deleteProject,
  unsaveJob,
  applyToJob,
  getJob,
  saveJob,
  match,
  animated
}) => {
  return (
    <Router>
      <Row className='Dashboard'>
        <ScrollToTopOnMount />
        <div className='container__flex'>
          <Col xsHidden sm={3} md={3} lg={3} className='Dashboard__sidebar'>
            <Sidebar
              header={`Welcome, ${user.first_name}`}
              content={
                <Nav className='Sidebar__button-container' stacked>
                  <ImageUploader
                    user={user}
                    type='Avatar'
                    label='Profile Picture'
                    buttonText='Change Avatar'
                  />
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
                  <LinkContainer to='/dashboard/add-project' className='Dashboard__nav-item'>
                    <NavItem><Glyphicon glyph='plus-sign' /> Add Project</NavItem>
                  </LinkContainer>
                </Nav>
              }
            />
          </Col>
          <Col xs={12} sm={9} md={9} lg={9} className='Dashboard__content'>
            <Route exact path='/dashboard/applications' component={({history}) => (
              <Applications user={user} animated={animated} />
            )} />
            <Route exact path='/dashboard/saved-jobs' component={({history}) => (
              <SavedJobs
                jobs={jobs}
                user={user}
                updateUser={updateUser}
                history={history}
                unsaveJob={unsaveJob}
                applyToJob={applyToJob}
                animated={animated}
              />
            )} />
            <Route exact path='/dashboard/projects' component={() => (
              <Projects deleteProject={deleteProject} user={user} animated={animated} />
            )} />
            <Route exact path='/dashboard/add-project' component={() => (
              <ProjectCreate animated={animated} />
            )} />
            <Route exact path='/dashboard/edit-project/:id' component={({match, history}) => {
              return (
                <EditProject
                  history={history}
                  skills={skills}
                  handleNewSkills={handleNewSkills}
                  getProject={getProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                  animated={animated}
                />
              )
            }} />
            <Route exact path='/dashboard/edit-profile' component={() => (
              <EditProfile
                user={user}
                updateUser={updateUser}
                uploadResume={uploadResume}
                animated={animated}
              />
            )} />
            <Route exact path='/dashboard/saved-jobs/:id' component={({match, history}) => (
              <JobDetailPage
                user={user}
                getJob={getJob}
                applyToJob={applyToJob}
                saveJob={saveJob}
                unsaveJob={unsaveJob}
                match={match}
                history={history}
                animated={animated}
              />
            )} />
            <Route exact path='/dashboard/jobs/:id' component={({match, history}) => (
              <JobDetailPage
                user={user}
                getJob={getJob}
                applyToJob={applyToJob}
                saveJob={saveJob}
                unsaveJob={unsaveJob}
                match={match}
                history={history}
                animated={animated}
              />
            )} />
          </Col>
        </div>
      </Row>
    </Router>
  )
}

ApplicantDashboard.propTypes = {
  job: PropTypes.object,
  jobs: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.any,
  skills: PropTypes.arrayOf(PropTypes.object),
  handleNewSkills: PropTypes.func,
  getJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  uploadResume: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  saveJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  project: PropTypes.object,
  match: PropTypes.object,
  animated: PropTypes.string
}

export default withRouter(ApplicantDashboard)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, Row, Col, Glyphicon } from 'react-bootstrap'
import { connect } from 'react-redux'
import { gettingUserJobs } from '../../reducers/actions/jobs'
import PostAJob from '../jobs/PostNewJobForm'
import SearchTalent from '../search/CandidateSearchPage'
import './Dashboard.css'
import Sidebar from '../utilities/Sidebar'
import '../utilities/Sidebar.css'
import ManageJobs from './ManageJobs'
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
    const jobs = user && [...user.employer.listings]

    if (!user) {
      return <Redirect to='/login' from='/dashboard/manage-jobs' />
    }

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
                    <LinkContainer to='/dashboard/search-talent' className='Dashboard__nav-item'>
                      <NavItem><Glyphicon glyph='search' /> Search Talent</NavItem>
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
              {jobs && <Route exact path='/dashboard/manage-jobs' component={ManageJobs} />}
              <Route exact path='/dashboard/edit-profile' render={() => <h1>Edit Profile</h1>} />
            </Col>
          </div>
        </Row>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  jobs: state.jobs.user_jobs
})

const mapDispatchToProps = dispatch => ({
  getJobs: (employerId) => dispatch(gettingUserJobs(employerId))
})

EmployerDashboard.propTypes = {
  user: PropTypes.object.isRequired,
  jobs: PropTypes.array,
  getJobs: PropTypes.func.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployerDashboard))

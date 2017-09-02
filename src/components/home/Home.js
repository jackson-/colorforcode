import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import './Home.css'
import JobBoard from './JobBoard'
import CandidateSearch from '../users/CandidateSearch'

class Home extends Component {
  render () {
    const {
      user,
      getJobs,
      filterJobs,
      advancedFilterJobs,
      getUsers,
      filterUsers,
      advancedFilterUsers
    } = this.props

    return (
      <div className='Home fadeIn animated'>
        <header className='Home-header'>
          <Row>
            <Jumbotron className='Home-hero'>
              <Col className='parallax-content' xs={12} sm={12} md={12} lg={12}>
                <h1 className='tagline'>Welcome to HireBlack</h1>
              </Col>
            </Jumbotron>
          </Row>
        </header>
        {
          user && user.is_employer
            ? (
              <CandidateSearch
                coords={user ? user.coords : ''}
                getUsers={getUsers}
                filterUsers={filterUsers}
                advancedFilterUsers={advancedFilterUsers}
              />
            )
            : (
              <JobBoard
                coords={user ? user.coords : ''}
                getJobs={getJobs}
                filterJobs={filterJobs}
                advancedFilterJobs={advancedFilterJobs}
              />
            )
        }
      </div>
    )
  }
}
Home.propTypes = {
  user: PropTypes.any,
  skills: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  jobs: PropTypes.arrayOf(PropTypes.object),
  getUsers: PropTypes.func,
  getJobs: PropTypes.func,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func
}

export default Home

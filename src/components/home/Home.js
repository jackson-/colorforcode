import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import './Home.css'
import JobBoard from './JobBoard'
import CandidateSearch from '../users/CandidateSearch'

const Home = ({
  getJobs,
  filterJobs,
  advancedFilterJobs,
  getUsers,
  filterUsers,
  advancedFilterUsers,
  coords,
  isEmployer,
  animated
}) => {
  const anim = animated ? 'animated' : ''
  return (
    <div className={`Home fadeIn ${anim}`}>
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
        isEmployer
          ? (
            <CandidateSearch
              coords={coords}
              getUsers={getUsers}
              filterUsers={filterUsers}
              advancedFilterUsers={advancedFilterUsers}
            />
          )
          : (
            <JobBoard
              coords={coords}
              getJobs={getJobs}
              filterJobs={filterJobs}
              advancedFilterJobs={advancedFilterJobs}
            />
          )
      }
    </div>
  )
}

Home.propTypes = {
  coords: PropTypes.object,
  isEmployer: PropTypes.bool,
  animated: PropTypes.string,
  getUsers: PropTypes.func,
  getJobs: PropTypes.func,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func
}

export default Home

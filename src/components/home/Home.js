import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import { HashLink } from 'react-router-hash-link'
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
  animated,
  users
}) => {
  const anim = animated ? 'animated' : ''
  let countdown = 0
  if(users){
    countdown = 500 - users.length
  }
  return (
    <div className={`Home fadeIn ${anim}`}>
      <Row>
        <header className='Home-header'>
          <Jumbotron className='Home-hero' title='Photo credit - #WOCinTechChat'>
            <Col className='parallax-content' xs={12} sm={12} md={12} lg={12}>
              <h1 className='Home__hero-tagline'>Color for Code</h1>
              <hr className='Home__hero-separator' />
              <h2 className='Home__hero-subtag'>Black Tech Talent Hub</h2>
              <p>Color for Code is seeking {countdown} more engineers
                before it officially releases. Until then enjoy all the fake data
                we've created for you to get familiar with platform and
                SPREAD THE WORD!</p>
              <HashLink to={`/#search`}>
                <span className='btn-oval btn-oval__white'>
                  {`SEARCH FOR ${isEmployer ? 'TALENT' : 'JOBS'}`}
                </span>
              </HashLink>
              <div id='search' />
            </Col>
          </Jumbotron>
        </header>
      </Row>
      <main>
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
      </main>
    </div>
  )
}

Home.propTypes = {
  coords: PropTypes.any, // either '' (for falsey-ness) or an object
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

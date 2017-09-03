import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import './Home.css'
import JobBoard from './JobBoard'
import CandidateSearch from '../users/CandidateSearch'

class Home extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(`CWRP: ${nextProps.users ? nextProps.users.length : 0}`)
  }

  render () {
    const {
      getJobs,
      filterJobs,
      advancedFilterJobs,
      getUsers,
      filterUsers,
      advancedFilterUsers,
      coords,
      isEmployer
    } = this.props
    console.log('RE-RENDERING HOME')
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
}
Home.propTypes = {
  coords: PropTypes.string,
  isEmployer: PropTypes.bool,
  getUsers: PropTypes.func,
  getJobs: PropTypes.func,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func
}

export default Home

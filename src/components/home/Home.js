import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import './Home.css'
import JobBoard from './JobBoard'
import CandidateSearch from '../users/CandidateSearch'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

const Home = props => (
  <div className='Home'>
    <header className='Home-header'>
      <ScrollToTopOnMount />
      <Row>
        <Jumbotron className='Home-hero'>
          <Col className='parallax-content' xs={12} sm={12} md={12} lg={12}>
            <h1 className='tagline'>Welcome to HireBlack</h1>
          </Col>
        </Jumbotron>
      </Row>
    </header>
    {props.user && props.user.is_employer ? <CandidateSearch /> : <JobBoard />}
  </div>
)

Home.propTypes = {
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

export default withRouter(connect(mapStateToProps)(Home))

import React from 'react'
import { Row, Jumbotron, Col } from 'react-bootstrap'
import '../home/Home.css'
import CandidateSearch from './CandidateSearch'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

const Home = (props) => {
  return (
    <div className='Home'>
      <header className='Home-header candidate'>
        <ScrollToTopOnMount />
        <Row>
          <Jumbotron className='Home-hero'>
            <Col className='parallax-content' xs={12} sm={12} md={12} lg={12}>
              <h1 className='tagline'>Welcome to Color for Code</h1>
            </Col>
          </Jumbotron>
        </Row>
      </header>
      <CandidateSearch />
    </div>
  )
}

export default Home

import React from 'react'
import { Row, Jumbotron } from 'react-bootstrap'
// import './Home.css'
import CandidateSearch from './CandidateSearch'

const Home = (props) => {
  return(
    <div className='Home'>
      <header className='Home-header'>
        <Row>
          <Jumbotron className='Home-hero'>
            <div className='parallax-content'>
              <h1 className='tagline'>Welcome to HireBlack</h1>
            </div>
          </Jumbotron>
        </Row>
      </header>
      <CandidateSearch />
    </div>
  )
}

export default Home

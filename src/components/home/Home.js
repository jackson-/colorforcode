import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { gettingAllJobs } from 'APP/src/reducers/actions/jobs'
import './Home.css'
import JobBoard from './JobBoard'
import pkg from '../../../package.json'

const Home = (props) => {
  return(
    <div className='Home'>
      <header className='Home-header'>
        <h2>{`Welcome, ${pkg.authors}`}</h2>
        <NavLink to='/post-new-job'><Button>Post a new job</Button></NavLink>
      </header>

      <JobBoard />
    </div>
  )
}

export default Home

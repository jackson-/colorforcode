import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import './Home.css'
import JobBoard from './JobBoard'
import pkg from '../../../package.json'

const Home = (props) => {
  return(
    <div className='Home'>
      <header className='Home-header'>
        <h2>Welcome to HireBlack</h2>
      </header>

      <JobBoard />
    </div>
  )
}

export default Home

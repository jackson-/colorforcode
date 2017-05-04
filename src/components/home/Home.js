import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import './Home.css'
import pkg from '../../../package.json'

const Home = props => (
  <div className='Home'>
    <header className='Home-header'>
      <h2>{`Welcome, ${pkg.authors}`}</h2>
      <NavLink to='/post-new-job'><Button>Post a new job</Button></NavLink>
    </header>
  </div>
)

export default Home

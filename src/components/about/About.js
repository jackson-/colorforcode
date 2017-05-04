import React from 'react'
import './About.css'
import { NavLink } from 'react-router-dom'

const About = props => (
  <div className='About'>
    <header className='About-header'>
      <NavLink to='/about/me'>Me</NavLink>
      <h2>A blurb about this app</h2>
    </header>
  </div>
)

export default About

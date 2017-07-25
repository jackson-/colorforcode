import React from 'react'
import { Route } from 'react-router-dom'
import './About.css'

const About = props => (
  <Route path='/about' render={() => (
    <div className='About'>
      <header className='About-header'>
        <h2>A blurb about this app</h2>
      </header>
    </div>
  )} />
)

export default About

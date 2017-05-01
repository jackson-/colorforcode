import React from 'react'
import './Home.css'
import pkg from '../../../package.json'

const Home = props => (
  <div className='Home'>
    <header className='Home-header'>
      <h2>{`Welcome, ${pkg.authors}`}</h2>
    </header>
  </div>
)

export default Home

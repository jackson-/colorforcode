import React from 'react'
import './Home.css'
import pkg from '../../../package.json'

const Home = props => (
  <div className='Home'>
    <header className='Home-header'>
      <h2>{`Welcome home, ${pkg.author.split(' ')[0]}`}</h2>
    </header>
  </div>
)

export default Home

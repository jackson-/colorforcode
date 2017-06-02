import React from 'react'
import './Home.css'
import JobBoard from './JobBoard'

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

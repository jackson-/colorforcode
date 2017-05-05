import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { gettingAllJobs } from 'APP/src/reducers/actions/jobs'
import pkg from '../../../package.json'

const JobDetail = (props) => {
  const job_id = props.match.params.id
  return(
    <div className='Home'>
      <h1>{job_id}</h1>
    </div>
  )
}

export default JobDetail

import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Home.css'
import { Link } from 'react-router-dom'


class JobList extends Component {

  render(){
    let jobs = [];
    this.props.jobs.forEach((job)=>{
      let url = "/job/"+job.id
      jobs.push(
        <li key={job.id}>
          <Link to={url}>{job.title}</Link>
        </li>
      )
    })
    return(
      <div id='job-board'>
        <ul>
          {jobs}
        </ul>
      </div>
    )
  }
}

export default JobList

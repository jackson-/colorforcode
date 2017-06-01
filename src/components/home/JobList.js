import React, { Component } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'


class JobList extends Component {

  render(){
    let jobs = [];
    if(this.props.jobs){
      this.props.jobs.forEach((job)=>{
        let url = "/job/"+job.id
        jobs.push(
          <li key={job.id}>
          <Link to={url}>{job.title}</Link>
          </li>
        )
      })
    }
    return(
      <div className='JobBoard-cards'>
        <ul>
          {jobs}
        </ul>
      </div>
    )
  }
}

export default JobList

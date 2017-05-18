import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { gettingAllJobs } from 'APP/src/reducers/actions/jobs'
import './Home.css'

class JobBoard extends Component {

  componentWillMount(){
    this.props.getJobs();
  }

  render(){
    let jobs = [];
    this.props.jobs.forEach((job)=>{
      let url = "/job/"+job.id
      jobs.push(
        <li key={job.id}>
          <NavLink to={url}>{job.title}</NavLink>
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

const mapStateToProps = state => ({
  jobs:state.jobs.all
})
const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllJobs())
})

const JobBoardContainer = connect(mapStateToProps, mapDispatchToProps)(JobBoard)

export default JobBoardContainer

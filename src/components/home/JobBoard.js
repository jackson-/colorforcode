import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { gettingAllJobs } from 'APP/src/reducers/actions/jobs'
import './Home.css'
import pkg from '../../../package.json'

class JobBoard extends Component {

  componentWillMount(){
    this.props.getJobs();
  }

  render(){
    let jobs = [];
    this.props.jobs.forEach((job)=>{
      jobs.push(
        <li>{job.title}</li>
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
  jobs:state.jobs
})
const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllJobs())
})

const JobBoardContainer = connect(mapStateToProps, mapDispatchToProps)(JobBoard)


export default JobBoardContainer

import React, {Component} from 'react'
import { NavLink,Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { gettingUserJobs } from '../../reducers/actions/jobs'
import { whoami } from '../../reducers/actions/users'

class EmployerDashboard extends Component {

  componentWillReceiveProps(){
    if(this.props.user && !this.props.jobs){
      this.props.getJobs(this.props.user.employer)
    }
  }

  render(){
    let activity = []
    const open = 6
    const paused = 1
    const closed = 96
    const candidates = {
      new:1154,
      reviewed:816,
      phone_screened:35,
      interviewed:24,
      offer_made:5,
      rejected:3014,
      hired:18
    }
    let my_jobs = [];
    this.props.jobs && this.props.jobs.forEach((job)=>{
      let url = "/job/"+job.id
      my_jobs.push(
        <li key={job.id}>
          <Link to={url}>{job.title}</Link>
        </li>
      )
    })
    return(
      <div className='Home'>
      {this.props.user &&
        <h2>{`Welcome, ${this.props.user.first_name} ${this.props.user.last_name}`}</h2>
      }
      <NavLink to='/post-new-job'><Button>Post a new job</Button></NavLink>
      <div id='activity'>
      <h3>My Jobs</h3>
        <ul>
          {my_jobs}
        </ul>
      </div>
      <div id='activity'>
      <h3>Activity</h3>
      <ul>
      {activity}
      </ul>
      </div>
      <div id='sidebar'>
        <div id='jobs-sidebar'>
          <h3>Job Stats</h3>
          <ul>
            <li>Open {open}</li>
            <li>Paused {paused}</li>
            <li>Closed {closed}</li>
          </ul>
        </div>
        <div id='candidates-sidebar'>
          <h3>Candidates</h3>
          <ul>
            <li>New {candidates.new}</li>
            <li>Reviewed {candidates.reviewed}</li>
            <li>Phone Screened {candidates.phone_screened}</li>
            <li>Interviewed {candidates.interviewed}</li>
            <li>Offer made {candidates.offer_made}</li>
            <li>Rejected {candidates.rejected}</li>
            <li>Hired {candidates.hired}</li>
          </ul>
        </div>
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  jobs: state.jobs.user_jobs
})

const mapDispatchToProps = dispatch => ({
  getJobs: (employer) => dispatch(gettingUserJobs(employer)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmployerDashboard))

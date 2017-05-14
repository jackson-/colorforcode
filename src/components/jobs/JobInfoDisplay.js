import React, {Component} from 'react'
import { connect } from 'react-redux'
import { gettingJob } from 'APP/src/reducers/actions/jobs'

class JobInfoDisplay extends Component {

  componentWillMount(){
    this.props.getJob(this.props.job_id);
  }

  render(){
    const job = this.props.job
    const employer = job ? this.props.job.employer : null
    const skills = job ? this.props.job.skills : null
    const skill_list = []
    if( skills ) {
      skills.forEach((skill) => {
        skill_list.push(
          <li>{skill.title}</li>
        )
      })
    }
    return(
      <div id='job-display'>
        {this.props.loading === false && job &&
          <div>
            <h1>Title: {job.title}</h1>
            {employer &&
              <h3>Company: {employer.name}</h3>}
            <p>Description: {job.description}</p>
            {job.state && job.city &&
              <p>{job.city}, {job.state} {job.country}</p>
            }
            <p>Telecommute: {job.remote ? "Yes" : "No"}</p>
            <p>Pay Rate: {job.pay_rate}</p>
            <p>Compensation: {job.compensation}</p>
            <p>Travel Requirements: {job.travel_requirements}</p>
            <p>Posted Since: {job.created_at}</p>
            {skills &&
              <ul>{skill_list}</ul>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  job:state.jobs.job,
  loading:state.loading
})

const mapDispatchToProps = dispatch => ({
  getJob: job_id => dispatch(gettingJob(job_id))
})

const JobInfoDisplayContainer = connect(mapStateToProps, mapDispatchToProps)(JobInfoDisplay)


export default JobInfoDisplayContainer

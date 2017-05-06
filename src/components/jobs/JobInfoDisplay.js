import React, {Component} from 'react'
import { connect } from 'react-redux'
// import { NavLink } from 'react-router-dom'
import { gettingJob } from 'APP/src/reducers/actions/jobs'

class JobInfoDisplay extends Component {

  componentWillMount(){
    this.props.getJob(this.props.job_id);
  }

  render(){
    console.log("PROPS", this.props)
    return(
      <div id='job-display'>
        {this.props.loading === false && this.props.job &&
          <div>
            <h1>Title: {this.props.job.title}</h1>
            <h3>Company: {this.props.job.employer.name}</h3>
            <p>Description: {this.props.job.description}</p>
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

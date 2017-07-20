import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import { applyingToJob, gettingJobById, updatingJob, deletingJob } from 'APP/src/reducers/actions/jobs'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class JobDetailPage extends Component {

  componentDidMount () {
    const {id} = this.props.match.params
    this.props.getJob(id)
  }

  applyToJob = () => {
    this.props.sendApplication(
      this.props.user.id,
      this.props.job.id,
      this.props.history
    )
  }

  render () {
    const {user, job, skills, history} = this.props
    let jobComponent = ''
    if (job) {
      if (user && user.is_employer && (user.employer.id === job.employer.id)) {
        jobComponent = (
          <JobUpdateDisplay
            user={user}
            skills={skills}
            job={job}
            updateJob={this.props.updateJob}
            deleteJob={this.props.deleteJob}
            history={history}
          />
        )
      } else {
        jobComponent = (
          <JobInfoDisplay
            skills={skills}
            job={job}
            history={history}
            applyToJob={this.applyToJob}
          />
        )
      }
    }

    return (
      <div className='JobDetailPage'>
        <ScrollToTopOnMount />
        {jobComponent}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  skills: state.skills.all,
  job: state.jobs.currentJob
})

const mapDispatchToProps = dispatch => ({
  getJob: job_id => dispatch(gettingJobById(job_id)),
  updateJob: (job, history) => dispatch(updatingJob(job, history)),
  deleteJob: (id, history) => dispatch(deletingJob(id, history)),
  sendApplication: (user_id, job_id, history) => dispatch(applyingToJob(user_id, job_id, history))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobDetailPage))

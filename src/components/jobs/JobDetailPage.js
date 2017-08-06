import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import { applyingToJob, gettingJobById, updatingJob, deletingJob, savingJob, unsavingJob } from 'APP/src/reducers/actions/jobs'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class JobDetailPage extends Component {

  componentDidMount () {
    const {id} = this.props.match.params
    // Do not change != to !==. This is intentional!!!!
    if (!this.props.job || (this.props.job.id != id)) this.props.getJob(id)
  }

  render () {
    const {user, job, skills, history, location, updateJob, deleteJob, saveJob, unsaveJob} = this.props
    let jobComponent = ''
    if (job) {
      if (user && user.is_employer && (user.employer.id === job.employer.id)) {
        jobComponent = (
          <JobUpdateDisplay
            user={user}
            skills={skills}
            job={job}
            updateJob={updateJob}
            deleteJob={deleteJob}
            history={history}
          />
        )
      } else {
        jobComponent = (
          <JobInfoDisplay
            user={user}
            skills={skills}
            job={job}
            history={history}
            applyToJob={this.props.sendApplication}
            saveJob={saveJob}
            unsaveJob={unsaveJob}
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
  getJob: jobId => dispatch(gettingJobById(jobId)),
  updateJob: (job, history) => dispatch(updatingJob(job, history)),
  deleteJob: (id, history) => dispatch(deletingJob(id, history)),
  sendApplication: (user, jobId, history) => dispatch(applyingToJob(user, jobId, history)),
  saveJob: (userId, savedJobs) => dispatch(savingJob(userId, savedJobs)),
  unsaveJob: (userId, savedJobs) => dispatch(unsavingJob(userId, savedJobs))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobDetailPage))

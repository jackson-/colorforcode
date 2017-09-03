import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class JobDetailPage extends Component {
  componentDidMount () {
    const {job, fetchingJob, match, getJob} = this.props
    const {id} = match.params
    if ((!job && !fetchingJob) || (job && (job.id !== Number(id)) && !fetchingJob)) getJob(id)
  }

  render () {
    const {
      user,
      job,
      skills,
      match,
      history,
      applyToJob,
      updateJob,
      deleteJob,
      saveJob,
      unsaveJob
    } = this.props

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
            job={job}
            user={user}
            skills={skills}
            match={match}
            history={history}
            applyToJob={applyToJob}
            saveJob={saveJob}
            unsaveJob={unsaveJob}
          />
        )
      }
    }
    return (
      <div className='JobDetailPage fadeIn animated'>
        <ScrollToTopOnMount />
        {jobComponent}
      </div>
    )
  }
}

JobDetailPage.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.any,
  job: PropTypes.object,
  fetchingJob: PropTypes.bool,
  applyToJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  updateJob: PropTypes.func,
  deleteJob: PropTypes.func,
  saveJob: PropTypes.func,
  getJob: PropTypes.func,
  skills: PropTypes.array
}

const mapStateToProps = state => ({
  job: state.jobs.currentJob,
  fetchingJob: state.jobs.fetchingJob,
  user: state.users.currentUser
})

export default connect(mapStateToProps)(JobDetailPage)

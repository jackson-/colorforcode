import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class JobDetailPage extends Component {
  componentDidMount () {
    console.log('CDM -')
  }

  componentWillMount () {
    console.log('CWM - ')
    const {job, fetchingJob, match, getJob} = this.props
    const {id} = match.params
    if ((!job && !fetchingJob) || (job && (job.id !== Number(id)) && !fetchingJob)) getJob(id)
  }

  componentWillUnMount () {
    console.log('CWUM')
  }

  componentWillReceiveProps (nextProps) {
    console.log('CWRP')
  }

  render () {
    const {
      user,
      job,
      selected,
      match,
      history,
      applyToJob,
      updateJob,
      deleteJob,
      saveJob,
      unsaveJob,
      handleNewSkills
    } = this.props

    let jobComponent = ''
    if (job) {
      if (user && user.is_employer && (user.employer.id === job.employer.id)) {
        jobComponent = (
          <JobUpdateDisplay
            user={user}
            selected={selected}
            job={job}
            updateJob={updateJob}
            deleteJob={deleteJob}
            history={history}
            handleNewSkills={handleNewSkills}
          />
        )
      } else {
        jobComponent = (
          <JobInfoDisplay
            job={job}
            user={user}
            skills={selected}
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
  selected: PropTypes.arrayOf(PropTypes.object), // selected skills
  handleNewSkills: PropTypes.func
  // ^creates new skills if user made any custom ones (class method of App.js)
}

const mapStateToProps = state => ({
  job: state.jobs.currentJob,
  selected: state.skills.selected,
  fetchingJob: state.jobs.fetchingJob,
  user: state.users.currentUser
})

export default connect(mapStateToProps)(JobDetailPage)

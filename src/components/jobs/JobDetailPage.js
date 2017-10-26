import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import LoadingSpinner from '../utilities/LoadingSpinner'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import { receiveSelectedSkills } from '../../reducers/actions/skills'

class JobDetailPage extends Component {
  componentWillMount () {
    const {job, fetching, match, getJob} = this.props
    const {id} = match.params
    if ((!job && !fetching) || (job && (job.id !== Number(id)) && !fetching)) {
      getJob(id)
    } else if (job) {
      this.props.receiveSelectedSkills(job.skills)
    }
  }

  componentWillUnmount () {
    this.props.receiveSelectedSkills(null)
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
      handleNewSkills,
      receiveAlert,
      receiveNext,
      animated
    } = this.props

    let jobComponent = ''
    if (job) {
      if (user && user.is_employer && user.employer.id === job.employer.id) {
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
            receiveAlert={receiveAlert}
            receiveNext={receiveNext}
          />
        )
      }
    }
    return (
      <div className={`JobDetailPage fadeIn ${animated}`}>
        <ScrollToTopOnMount />
        {
          job
            ? jobComponent
            : <LoadingSpinner />
        }
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
  fetching: PropTypes.bool,
  applyToJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  updateJob: PropTypes.func,
  deleteJob: PropTypes.func,
  saveJob: PropTypes.func,
  getJob: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.object), // selected skills
  handleNewSkills: PropTypes.func,
  // ^creates new skills if user made any custom ones (class method of App.js)
  receiveNext: PropTypes.func,
  receiveAlert: PropTypes.func,
  animated: PropTypes.string,
  receiveSelectedSkills: PropTypes.func
}

const mapStateToProps = state => ({
  job: state.jobs.selected,
  selected: state.skills.selected,
  fetching: state.jobs.fetchingSelected,
  user: state.auth.currentUser
})

const mapDispatchToProps = dispatch => ({
  receiveSelectedSkills: skills => dispatch(receiveSelectedSkills(skills))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)

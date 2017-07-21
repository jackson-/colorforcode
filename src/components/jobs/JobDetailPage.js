import React, { Component } from 'react'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import { gettingJobById, updatingJob, deletingJob } from 'APP/src/reducers/actions/jobs'
import { connect } from 'react-redux'

class JobDetailPage extends Component {
  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getJob(id)
  }

  render() {
    const {user, job, skills} = this.props
    return (
      <div className='JobDetailPage'>
        {(user && user.is_employer && job) && job && job.employer.id == user.employer.id
          && <JobUpdateDisplay
              user={user}
              skills={skills}
              job={job}
              updateJob={this.props.updateJob}
              deleteJob={this.props.deleteJob}
              history={this.props.history}
             />
        }
        {((user && !user.is_employer) || (job && !(job.employer.id == user.employer.id)) || !user) && job
          && <JobInfoDisplay skills={skills} job={job} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  skills: state.skills.all,
  job: state.jobs.currentJob,
  history: state.router.history
})

const mapDispatchToProps = dispatch => ({
  getJob: job_id => dispatch(gettingJobById(job_id)),
  updateJob:  (job, history) => dispatch(updatingJob(job, history)),
  deleteJob: (id, history) => dispatch(deletingJob(id, history))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)

import React, { Component } from 'react'
import JobInfoDisplay from './JobInfoDisplay'
import JobUpdateDisplay from './JobUpdateDisplay'
import { gettingJobById } from 'APP/src/reducers/actions/jobs'
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
        {(user && user.is_employer) && job
          && <JobUpdateDisplay user={user} skills={skills} job={job} />
        }
        {((user && !user.is_employer) || !user) && job
          && <JobInfoDisplay skills={skills} job={job} />
        }
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
  getJob: job_id => dispatch(gettingJobById(job_id))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)

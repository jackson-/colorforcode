import React, { Component } from 'react'
import { Table, Row, Button, Glyphicon } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ManageJobs.css'

class SavedJobs extends Component {

  mostRecentDate = job => {
    const {created_at, updated_at} = job
    if (Date.parse(created_at) < Date.parse(updated_at)) {
      return new Date(updated_at).toLocaleDateString()
    } else {
      return new Date(created_at).toLocaleDateString()
    }
  }

  applyToJob = id => () => {
    const {user, applyToJob, history} = this.props
    applyToJob(user.id, id, history)
  }

  unsaveJob = id => () => {
    const {user, unsaveJob} = this.props
    let savedJobsArr = user.savedJobs.filter(j => j.id !== id).map(j => j.id)
    unsaveJob({userId: user.id, savedJobsArr})
  }

  render () {
    const jobs = this.props.user.savedJobs
    return (
      <Row className='SavedJobs'>
        <h1 className='SavedJobs-header'>SAVED JOBS</h1>
        <Table responsive>
          <thead>
            <tr>
              <td>JOB TITLE</td>
              <td>ACTIONS</td>
              <td>STATUS</td>
              <td>LAST UPDATED</td>
              <td>APPLICANTS</td>
            </tr>
          </thead>
          <tbody>
            {jobs && jobs.map((job, i) => (
              <tr key={i}>
                <td>
                  {
                    job.status === 'closed'
                      ? job.title
                      : <Link to={`/dashboard/saved-jobs/${job.id}`}>{job.title}</Link>
                  }
                </td>
                <td>
                  {
                    job.status === 'open' &&
                      <Button
                        onClick={this.applyToJob(job.id)}
                        bsSize='xsmall'
                        bsStyle='primary'
                      >
                        <Glyphicon glyph='briefcase' /> apply
                      </Button>
                  }
                  <Button
                    onClick={this.unsaveJob(job.id)}
                    bsSize='xsmall'
                    bsStyle='danger'
                  >
                    <Glyphicon glyph='trash' /> unsave
                  </Button>
                </td>
                <td>{job.status}</td>
                <td>{this.mostRecentDate(job)}</td>
                <td>{job.applicants.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    )
  }
}

SavedJobs.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func,
  applyToJob: PropTypes.func,
  saveJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  jobs: PropTypes.array,
  history: PropTypes.object
}

export default withRouter(SavedJobs)

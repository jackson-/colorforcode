import React, { Component } from 'react'
import { Table, Row, Button, Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ManageJobs.css'

export default class SavedJobs extends Component {

  mostRecentDate = job => {
    const {created_at, updated_at} = job
    if (Date.parse(created_at) < Date.parse(updated_at)) {
      return new Date(updated_at).toLocaleDateString()
    } else {
      return new Date(created_at).toLocaleDateString()
    }
  }

  handleRemove = id => () => {
    const savedJobs = this.props.user.savedJobs.filter(job => job.id !== id)
    const savedJobsIds = savedJobs.map(job => job.id)
    this.props.updateUser(this.props.user, savedJobsIds)
  }

  render () {
    const {jobs} = this.props
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
                  <Button
                    onClick={this.handleRemove(job.id)}
                    bsSize='xsmall'
                    bsStyle='danger'
                  >
                    <Glyphicon glyph='trash' /> remove
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
  updateUser: PropTypes.func.isRequired,
  jobs: PropTypes.array,
  history: PropTypes.object
}

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

  handleDuplicate = job => event => {
    event.preventDefault()
    job.skills = job.skills.map(skill => skill.id)
    delete job.id
    delete job.created_at
    delete job.updated_at
    job.status = 'open'
    this.props.duplicateJob({job, skills: job.skills}, this.props.history)
  }

  handleClose = id => () => {
    this.props.closeJob(id, this.props.history)
  }

  render () {
    const {jobs} = this.props
    return (
      <Row className='SavedJobs'>
        <h1 className='SavedJobs-header'>MANAGE JOBS</h1>
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
            {jobs.map((job, i) => (
              <tr key={i}>
                <td>
                  {
                    job.status === 'closed'
                      ? job.title
                      : <Link to={`/dashboard/jobs/${job.id}`}>{job.title}</Link>
                  }
                </td>
                <td>
                  {
                    job.status === 'open'
                    ? (
                      <Button
                        onClick={this.handleClose(job.id)}
                        bsSize='xsmall'
                        bsStyle='danger'
                      >
                        <Glyphicon glyph='trash' /> close
                      </Button>
                    )

                    : (
                      <Button
                        onClick={this.handleDuplicate(job)}
                        bsSize='xsmall'
                        bsStyle='primary'
                      >
                        <Glyphicon glyph='retweet' /> duplicate
                      </Button>
                    )
                  }
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
  updateUser: PropTypes.func.isRequired,
  jobs: PropTypes.array.isRequired,
  history: PropTypes.object
}

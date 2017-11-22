import React, { Component } from 'react'
import { Table, Row, Button, Glyphicon } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
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
    const {user, applyToJob, history, receiveAlert} = this.props
    receiveAlert({
      type: 'warning confirmation',
      style: 'warning',
      title: 'Ready to apply?',
      body: `<p>Applying through C4C is as easy as clicking a button! That's why we're double checking that you're ready for us to email this employer about how awesome you are.</p><ul><li>Is your profile complete?</li><li>Projects and resume up to date?</li>`,
      next: '',
      footer: true,
      footerActions: [
        {
          text: `Yes, I'm ready to apply 👍🏿`,
          action: () => { applyToJob(user, id, history) }
        },
        {
          text: `Save job and check profile 👀`,
          action: () => { this.saveJob() },
          next: `/users/${user.id}`
        }
      ]
    })
  }

  unsaveJob = id => () => {
    const {user, unsaveJob} = this.props
    let savedJobsArr = user.savedJobs.filter(j => j.id !== id).map(j => j.id)
    unsaveJob({userId: user.id, savedJobsArr})
  }

  render () {
    const {user, animated} = this.props
    const appliedJobs = user.applications.map(a => a.id)
    const jobs = user.savedJobs
    return (
      <Row className='SavedJobs'>
        <h1 className={`SavedJobs-header fadeIn`}>
          SAVED JOBS
        </h1>
        <ScrollToTopOnMount />
        <Table className={`fadeIn ${animated}`} responsive>
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
            {
              jobs && jobs.map((job, i) => {
                let applied = appliedJobs.includes(job.id)
                return (
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
                            className='btn-xs--action'
                            onClick={this.applyToJob(job.id)}
                            bsSize='xsmall'
                            bsStyle='primary'
                            disabled={applied}
                          >
                            <Glyphicon glyph='briefcase' /> {applied ? 'applied' : 'apply'}
                          </Button>
                      }
                      <Button
                        onClick={this.unsaveJob(job.id)}
                        className='btn-xs--action'
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
                )
              })
            }
          </tbody>
        </Table>
      </Row>
    )
  }
}

SavedJobs.propTypes = {
  user: PropTypes.any,
  updateUser: PropTypes.func,
  applyToJob: PropTypes.func,
  saveJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  jobs: PropTypes.array,
  history: PropTypes.object,
  animated: PropTypes.string,
  receiveAlert: PropTypes.func
}

export default withRouter(SavedJobs)

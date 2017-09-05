import React, { Component } from 'react'
import { Table, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ManageJobs.css'

class Applications extends Component {
  humanReadableDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  render () {
    const {user, animated} = this.props
    const applications = user.applications
    return (
      <Row className={`Applications fadeIn ${animated}`}>
        <h1 className='Applications-header fadeIn animated'>
          APPLICATION HISTORY
        </h1>
        <Table className='fadeIn animated' responsive>
          <thead>
            <tr>
              <td>DATE APPLIED</td>
              <td>JOB TITLE</td>
              <td>JOB STATUS</td>
            </tr>
          </thead>
          <tbody>
            {applications && applications.map((application, i) => (
              <tr key={i}>
                <td>{this.humanReadableDate(application.JobApplication.created_at)}</td>
                <td>
                  {
                    application.status === 'closed'
                      ? application.title
                      : <Link to={`/dashboard/jobs/${application.id}`}>{application.title}</Link>
                  }
                </td>
                <td>{application.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    )
  }
}

Applications.propTypes = {
  user: PropTypes.any,
  animated: PropTypes.string
}

export default Applications

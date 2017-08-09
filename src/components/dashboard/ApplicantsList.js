import React, { Component } from 'react'
import { Table, Row, Button, Glyphicon, Accordion, Panel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ManageJobs.css'

export default class ManageJobs extends Component {

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
    console.log("JOBS", jobs)
    return (
      <Row className='ManageJobs'>
        <h1 className='ManageJobs-header'>MANAGE JOBS</h1>
        <Accordion>
            {jobs.map((job, i) => (
                <Panel header={job.title} eventKey={i}>
                  <Table responsive>
                    <thead>
                      Applicants:
                    </thead>
                    <tbody>
                      {job.applicants.map((app, j) =>
                        <tr>
                          <td><a href={"/users/" + app.id}>{app.first_name} {app.last_name}</a></td>
                          <td>{app.location}</td>
                          <td><a href={app.github} target="_blank">Github</a></td>
                          <td><a href={app.linkedin} target="_blank">LinkedIn</a></td>
                          <td><a href={app.twitter} target="_blank">Twitter</a></td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Panel>
            ))}
        </Accordion>
      </Row>
    )
  }
}

ManageJobs.propTypes = {
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  jobs: PropTypes.array.isRequired,
  history: PropTypes.object
}

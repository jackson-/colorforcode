import React, { Component } from 'react'
import { Table, Row, Button, Glyphicon } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ManageJobs.css'

class Projects extends Component {

  mostRecentDate = project => {
    const {created_at, updated_at} = project
    if (Date.parse(created_at) < Date.parse(updated_at)) {
      return new Date(updated_at).toLocaleDateString()
    } else {
      return new Date(created_at).toLocaleDateString()
    }
  }

  handleDelete = id => event => {
    event.preventDefault()
    this.props.deleteProject(id)
  }

  render () {
    const projects = this.props.user.projects
    return (
      <Row className='Projects fadeIn animated'>
        <h1 className='Projects-header'>PROJECTS</h1>
        <Table responsive>
          <thead>
            <tr>
              <td>TITLE</td>
              <td>ACTIONS</td>
              <td>LAST UPDATED</td>
            </tr>
          </thead>
          <tbody>
            {projects && projects.map((project, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/dashboard/edit-project/${project.id}`}>{project.title}</Link>
                </td>
                <td>
                  <Button
                    onClick={this.handleDelete(project.id)}
                    className='btn-xs--action'
                    bsSize='xsmall'
                    bsStyle='danger'
                  >
                    <Glyphicon glyph='trash' /> delete
                  </Button>
                </td>
                <td>{this.mostRecentDate(project)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    )
  }
}

Projects.propTypes = {
  user: PropTypes.any,
  updateUser: PropTypes.func,
  applyToJob: PropTypes.func,
  saveJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  projects: PropTypes.array,
  history: PropTypes.object
}

export default withRouter(Projects)

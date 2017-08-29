import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-bootstrap'
import ProjectFields from './ProjectFields'
import ImageUploader from '../dashboard/ImageUploader'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import '../auth/Form.css'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

function arrowRenderer () {
  return (
    <span />
  )
}

class EditProjectForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      title: this.props.project ? this.props.project.title : '',
      screenshot: this.props.project ? this.props.project.screenshot : '',
      site: this.props.project ? this.props.project.site : '',
      repo: this.props.project ? this.props.project.repo : '',
      problem: this.props.project ? this.props.project.problem : '',
      approach: this.props.project ? this.props.project.approach : '',
      challenges: this.props.project ? this.props.project.challenges : '',
      outcome: this.props.project ? this.props.project.outcome : '',
      selectValue: this.props.project ? this.formatSkills(this.props.project.skills) : [],
      selectedSkills: []
    }
  }

  componentDidMount () {
    const {id} = this.props.match.params
    if (!this.props.project || this.props.project.id != id) this.props.getProject(id)
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  formatSkills = skills => {
    if (skills) {
      return skills.map(skill => ({
        label: skill.title,
        value: skill.id
      }))
    }
    return null
  }

  _selectSkill = data => {
    let skillIds = data.split(',')
    let newSkills = []
    if (skillIds[0] !== '') {
      skillIds.forEach((id) => {
        this.props.skills.forEach((s) => {
          if (s.id === parseInt(id, 10)) {
            newSkills.push({label: s.title, value: s.id})
          }
        })
      })
    }
    this.setState({
      selectValue: [...newSkills],
      selectedSkills: skillIds
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    let skills, project

    project = this.state
    project.user_id = this.props.project.user_id
    project.id = this.props.project.id
    skills = this.state.selectedSkills
      ? this.state.selectedSkills
      : project.selectValue.map(s => s.id)
    delete project.selectValue
    delete project.selectedSkills
    this.props.updateProject({project, skills}, this.props.history)
  }

  handleDelete = event => {
    event.preventDefault()
    const {project, history} = this.props
    this.props.deleteProject(project.id, history)
  }

  render () {
    let skills = this.props.skills ? this.formatSkills(this.props.skills) : []
    const {project} = this.props
    return (
      <Row className='PostJobForm'>
        <ScrollToTopOnMount />
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>EDIT PROJECT</h1>
          <ProjectFields
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            selectSkill={this._selectSkill}
            arrowRenderer={arrowRenderer}
            state={this.state}
            skills={skills}
          />
          <div style={{background: '#323638', padding: '10px'}}>
            <ImageUploader
              project={project}
              label='Project Screenshot'
              buttonText='Upload Screenshot'
              type='Screenshot'
            />
          </div>
          <Button
            className='btn-oval btn-oval__black btn-oval__danger'
            onClick={this.handleDelete}
          >
            DELETE PROJECT
          </Button>
        </Col>
      </Row>
    )
  }
}

EditProjectForm.propTypes = {
  alert: PropTypes.object,
  history: PropTypes.object,
  project: PropTypes.object,
  skills: PropTypes.array,
  match: PropTypes.object,
  user: PropTypes.object,
  updateProject: PropTypes.func,
  deleteProject: PropTypes.func,
  getProject: PropTypes.func
}

const mapStateToProps = state => ({
  alert: state.alert,
  project: state.projects.currentProject
})

export default withRouter(connect(mapStateToProps)(EditProjectForm))

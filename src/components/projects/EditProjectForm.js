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
import { receiveProject } from '../../reducers/actions/projects'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import LoadingSpinner from '../utilities/LoadingSpinner'

function arrowRenderer () {
  return (
    <span />
  )
}

class EditProjectForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      site: '',
      repo: '',
      problem: '',
      approach: '',
      challenges: '',
      outcome: '',
      selectValue: [],
      selectedSkills: [],
      loading: true
    }
  }

  componentDidMount () {
    const {match, getProject, project, fetchingProject} = this.props
    const {id} = match.params
    console.log('CDM - FETCHING: ', fetchingProject)
    if (!fetchingProject) {
      if (!project || project.id !== Number(id)) {
        console.log('CDM - FETCHING PROJECT: ', Number(id))
        getProject(id)
      }
    }
  }

  componentWillMount () {
    const {fetchingProject} = this.props
    console.log('CWM - FETCHING: ', fetchingProject)
  }

  componentWillReceiveProps (nextProps) {
    const {match} = this.props
    const {id} = match.params
    if (nextProps.project && nextProps.project.id === Number(id)) {
      console.log('CWRP - DONE FETCHING, SETTING LOADING TO FALSE')
      this.setState({loading: false})
    }
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
    let {project, selected} = this.props
    const {loading} = this.state
    return loading
      ? <LoadingSpinner />
      : (
        <Row className='EditProfile'>
          <ScrollToTopOnMount />
          <Col xs={12} sm={6} md={6} lg={6}>
            <h1 className='EditProfile-header fadeIn animated'>
              EDIT PROJECT
            </h1>
            <ProjectFields
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              selectSkill={this._selectSkill}
              arrowRenderer={arrowRenderer}
              state={this.state}
              skills={selected}
              project={project}
              formatSkills={this.formatSkills}
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
  match: PropTypes.object,
  user: PropTypes.any,
  selected: PropTypes.arrayOf(PropTypes.object),
  updateProject: PropTypes.func,
  deleteProject: PropTypes.func,
  getProject: PropTypes.func,
  fetchingProject: PropTypes.bool
}

const mapStateToProps = state => ({
  alert: state.alert,
  project: state.projects.currentProject,
  selected: state.skills.selected,
  fetchingProject: state.projects.fetchingProject
})

const mapDispatchToProps = dispatch => ({
  resetCurrentProject: () => dispatch(receiveProject(null))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProjectForm))

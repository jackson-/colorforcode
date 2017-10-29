import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import { Row } from 'react-bootstrap'
import ProjectFields from './ProjectFields'
import '../auth/Form.css'
import LoadingSpinner from '../utilities/LoadingSpinner'
import { receiveSelectedSkills } from '../../reducers/actions/skills'
import { createValueFromString, createEmptyValue } from 'react-rte'

class EditProjectForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.project ? this.props.project.title : '',
      site: this.props.project ? this.props.project.site : '',
      repo: this.props.project ? this.props.project.repo : '',
      problem: this.props.project ? createValueFromString(this.props.project.problem, 'html') : createEmptyValue(),
      approach: this.props.project ? createValueFromString(this.props.project.approach, 'html') : createEmptyValue(),
      challenges: this.props.project ? createValueFromString(this.props.project.challenges, 'html') : createEmptyValue(),
      outcome: this.props.project ? createValueFromString(this.props.project.outcome, 'html') : createEmptyValue(),
      loading: true
    }
    this.textareaTypes = ['problem', 'approach', 'challenges', 'outcome']
  }

  componentDidMount () {
    const {match, getProject, project, fetchingProject, selected} = this.props
    const {id} = match.params
    if (!fetchingProject) {
      if (!project || project.id !== Number(id) || (!selected && project.skills.length > 0)) {
        getProject(id)
      } else {
        this.setState({
          title: project.title,
          site: project.site,
          repo: project.repo,
          problem: createValueFromString(project.problem, 'html'),
          approach: createValueFromString(project.approach, 'html'),
          challenges: createValueFromString(project.challenges, 'html'),
          outcome: createValueFromString(project.outcome, 'html'),
          loading: false
        })
      }
    } else if (fetchingProject && project !== null && project.id === id) {
      this.setState({loading: false})
    }
  }

  componentWillReceiveProps (nextProps) {
    const {match} = this.props
    const {id} = match.params
    if (nextProps.project && nextProps.project.id === Number(id)) {
      this.setState({
        title: nextProps.project.title,
        site: nextProps.project.site,
        repo: nextProps.project.repo,
        problem: createValueFromString(nextProps.project.problem, 'html'),
        approach: createValueFromString(nextProps.project.approach, 'html'),
        challenges: createValueFromString(nextProps.project.challenges, 'html'),
        outcome: createValueFromString(nextProps.project.outcome, 'html'),
        loading: false
      })
    }
  }

  componentWillUnmount () {
    this.props.receiveSelectedSkills(null)
  }

  handleChange = type => event => {
    let value = type === 'skills' || this.textareaTypes.includes(type)
      ? event
      : event.target.value
    if (type === 'skills') {
      this.props.handleNewSkills(value)
    } else {
      this.setState({[type]: value})
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    let skills, project
    const {updateProject, selected} = this.props
    const {id, user_id} = this.props.project
    project = {...this.state}
    this.textareaTypes.forEach(type => {
      project[type] = project[type].toString('html')
    })
    project.user_id = user_id
    project.id = id
    skills = selected.map(s => s.id)
    updateProject({project, skills})
  }

  isInvalid = () => {
    const {
      title,
      repo,
      problem,
      approach,
      challenges,
      outcome } = this.state

    return (
      !title &&
      !repo &&
      !problem &&
      !approach &&
      !challenges &&
      !outcome
    )
  }

  handleDelete = event => {
    event.preventDefault()
    const {project, history} = this.props
    this.props.deleteProject(project.id, history)
  }

  render () {
    let {project, selected, animated} = this.props
    const {loading} = this.state
    return loading
      ? <LoadingSpinner />
      : (
        <Row className='EditProject'>
          <h1 className={`EditProject-header fadeIn ${animated}`}>
            EDIT PROJECT
          </h1>
          <ProjectFields
            edit
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            selectSkill={this._selectSkill}
            state={this.state}
            skills={selected}
            project={project}
            formatSkills={this.formatSkills}
            isInvalid={this.isInvalid()}
            handleDelete={this.handleDelete}
          />
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
  fetchingProject: PropTypes.bool,
  animated: PropTypes.string,
  handleNewSkills: PropTypes.func,
  receiveSelectedSkills: PropTypes.func
}

const mapStateToProps = state => ({
  alert: state.alert,
  project: state.projects.currentProject,
  selected: state.skills.selected,
  fetchingProject: state.projects.fetchingProject
})

const mapDispatchToProps = dispatch => ({
  receiveSelectedSkills: skills => dispatch(receiveSelectedSkills(skills))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProjectForm))

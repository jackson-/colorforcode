import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-bootstrap'
import ProjectFields from './ProjectFields'
import ImageUploader from '../dashboard/ImageUploader'
import '../auth/Form.css'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import LoadingSpinner from '../utilities/LoadingSpinner'
import { receiveSelectedSkills } from '../../reducers/actions/skills'

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
      site: this.props.project ? this.props.project.site : '',
      repo: this.props.project ? this.props.project.repo : '',
      problem: this.props.project ? this.props.project.problem : '',
      approach: this.props.project ? this.props.project.approach : '',
      challenges: this.props.project ? this.props.project.challenges : '',
      outcome: this.props.project ? this.props.project.outcome : '',
      loading: true
    }
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
          problem: project.problem,
          approach: project.approach,
          challenges: project.challenges,
          outcome: project.outcome,
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
        problem: nextProps.project.problem,
        approach: nextProps.project.approach,
        challenges: nextProps.project.challenges,
        outcome: nextProps.project.outcome,
        loading: false
      })
    }
  }

  componentWillUnmount () {
    this.props.receiveSelectedSkills(null)
  }

  handleChange = type => event => {
    let value = Array.isArray(event)
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
    project = this.state
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
          <ScrollToTopOnMount />
          <Col xs={12} sm={6} md={6} lg={6}>
            <h1 className={`EditProject-header fadeIn ${animated}`}>
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
              isInvalid={this.isInvalid()}
            />
            <div style={{background: '#323638', padding: '25px 10px 10px', margin: '15px 0'}}>
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

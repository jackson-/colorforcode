import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ProjectFields from './ProjectFields'
import { Row } from 'react-bootstrap'
import { creatingNewProject } from 'APP/src/reducers/actions/projects'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import { createEmptyValue } from 'react-rte'
import '../auth/Form.css'

class CreateProjectForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      screenshot: '',
      site: '',
      repo: '',
      problem: createEmptyValue(),
      approach: createEmptyValue(),
      challenges: createEmptyValue(),
      outcome: createEmptyValue()
    }
    this.textareaTypes = ['problem', 'approach', 'challenges', 'outcome']
  }

  componentDidMount () {
    if (!this.props.skills) this.props.getSkills()
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

  clearForm = () => {
    this.setState({
      title: '',
      screenshot: '',
      site: '',
      repo: '',
      problem: createEmptyValue(),
      approach: createEmptyValue(),
      challenges: createEmptyValue(),
      outcome: createEmptyValue()
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const project = {...this.state}
    let {user, skills, createProject} = this.props
    this.textareaTypes.forEach(type => {
      project[type] = project[type].toString('html')
    })
    skills = skills.map(s => s.id)
    project.user_id = user.id
    this.clearForm()
    createProject({project, skills})
  }

  isInvalid = () => {
    const {
      title,
      repo,
      problem,
      approach,
      challenges,
      outcome } = this.state

    return !(
      title &&
      repo &&
      problem &&
      approach &&
      challenges &&
      outcome
    )
  }

  render () {
    const {animated} = this.props
    return (
      <Row className={`CreateProject fadeIn ${animated}`}>
        <h1 className='CreateProject-header'>Add New Project</h1>
        <ProjectFields
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          selectSkill={this._selectSkill}
          state={this.state}
          animated={animated}
          isInvalid={this.isInvalid()}
        />
      </Row>
    )
  }
}

CreateProjectForm.propTypes = {
  getSkills: PropTypes.func,
  createProject: PropTypes.func,
  history: PropTypes.object,
  user: PropTypes.any,
  skills: PropTypes.arrayOf(PropTypes.object),
  animated: PropTypes.string,
  handleNewSkills: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  skills: state.skills.selected
})

const mapDispatchToProps = dispatch => ({
  createProject: project => dispatch(creatingNewProject(project)),
  getSkills: () => dispatch(gettingAllSkills())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectForm))

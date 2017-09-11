import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ProjectFields from './ProjectFields'
import { Row, Col } from 'react-bootstrap'
import { creatingNewProject } from 'APP/src/reducers/actions/projects'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import '../auth/Form.css'

class CreateProjectForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      screenshot: '',
      site: '',
      repo: '',
      problem: '',
      approach: '',
      challenges: '',
      outcome: ''
    }
  }

  componentDidMount () {
    if (!this.props.skills) this.props.getSkills()
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

  clearForm = () => {
    this.setState({
      title: '',
      screenshot: '',
      site: '',
      repo: '',
      problem: '',
      approach: '',
      challenges: '',
      outcome: ''
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const project = this.state
    let {user, skills, createProject} = this.props
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
        <ScrollToTopOnMount />
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='CreateProject-header'>Add New Project</h1>
          <ProjectFields
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            selectSkill={this._selectSkill}
            state={this.state}
            animated={animated}
            isInvalid={this.isInvalid()}
          />
        </Col>
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

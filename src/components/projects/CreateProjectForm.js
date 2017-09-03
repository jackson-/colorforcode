import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ProjectFields from './ProjectFields'
import { Row, Col } from 'react-bootstrap'
import { creatingNewProject } from 'APP/src/reducers/actions/projects'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
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
      outcome: '',
      selectValue: [],
      selectedSkills: []
    }
  }

  componentDidMount () {
    if (!this.props.skills) this.props.getSkills()
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
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

  clearForm = () => {
    this.setState({
      title: '',
      screenshot: '',
      site: '',
      repo: '',
      problem: '',
      approach: '',
      challenges: '',
      outcome: '',
      selectValue: [],
      selectedSkills: []
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const project = this.state
    project.user = this.props.user

    const skills = []
    this.state.selectValue.forEach((skill) => {
      skills.push(skill.value)
    })

    this.clearForm()
    this.props.createProject({project, skills})
  }

  render () {
    let skills = []
    this.props.skills.forEach(s => {
      skills.push({label: s.title, value: s.id})
    })
    return (
      <Row className='PostJobForm fadeIn animated'>
        <ScrollToTopOnMount />
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>Add New Project</h1>
          <ProjectFields
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            selectSkill={this._selectSkill}
            arrowRenderer={arrowRenderer}
            state={this.state}
            skills={skills}
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
  skills: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  skills: state.skills.all
})

const mapDispatchToProps = dispatch => ({
  createProject: project => dispatch(creatingNewProject(project)),
  getSkills: () => dispatch(gettingAllSkills())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectForm))

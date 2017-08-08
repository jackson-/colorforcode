import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import '../auth/Form.css'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import Modal from 'APP/src/components/utilities/Modal'


function arrowRenderer () {
  return (
    <span></span>
  )
}

class EditProjectForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      title: this.props.project.title || '',
      description: this.props.project.description || '',
      external_link: this.props.project.external_link || '',
      learning_point: this.props.project.learning_point || '',
      pain_point: this.props.project.pain_point || '',
      selectValue: this.formatSkills(this.props.project.skills) || [],
      selected_skills: []
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
		let skill_ids = data.split(',')
    let new_skills = []
		if (skill_ids[0] !== '') {
      skill_ids.forEach((sk_id) => {
				this.props.skills.forEach((s) => {
          if(s.id === parseInt(sk_id, 10)){
            new_skills.push({label: s.title, value: s.id})
          }
        })
			});
		}
    this.setState({
      selectValue: [...new_skills],
      selected_skills: skill_ids
    })
	}

  clearForm = () => {
    this.setState({
      title: this.props.project.title ? this.props.project.title : '',
      description: this.props.project.description ? this.props.project.description : '',
      external_link: this.props.project.external_link ? this.props.project.external_link : '',
      learning_point: this.props.project.learning_point ? this.props.project.learning_point : '',
      pain_point: this.props.project.pain_point ? this.props.project.pain_point : '',
      selectValue: this.props.project.skills ? this.formatSkills(this.props.project.skills) : [],
      selected_skills: []
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    let skills, project

    project = this.state
    project.user = this.props.user
    project.id = this.props.project.id
    skills = this.state.selected_skills
      ? this.state.selected_skills
      : project.selectValue.map(s => s.id)
    delete project.selectValue
    delete project.selected_skills
    this.clearForm()
    console.log({project, skills})
    this.props.updateProject({project, skills}, this.props.history)
  }

  handleDelete = (id, history) => event => {
    event.preventDefault()
    this.props.deleteProject(id, history)
  }

  render () {
    let skills = this.props.skills ? this.formatSkills(this.props.skills) : []
    let {project, history} = this.props
    const {alert} = this.props
    return (
      <Row className='PostJobForm'>
        <ScrollToTopOnMount />
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>EDIT PROJECT</h1>
          <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
            <FormGroup controlId='title'>
              <ControlLabel>Project Title</ControlLabel>
              <FormControl
                type='text'
                value={this.state.title}
                onChange={this.handleChange('title')}
              />
            </FormGroup>
            <ControlLabel>
              Applied Skills (type below and hit 'Enter' to select and 'Backspace to deselect')
            </ControlLabel>
            <VirtualizedSelect
              arrowRenderer={arrowRenderer}
              clearable
              searchable
              simpleValue
              labelKey='label'
              valueKey='value'
              ref='job_search'
              multi
              options={skills}
              onChange={this._selectSkill}
              value={this.state.selectValue}
            />
            <FormGroup controlId='external_link'>
              <ControlLabel>External Link</ControlLabel>
              <FormControl
                type='url'
                value={this.state.external_link}
                onChange={this.handleChange('external_link')}
              />
            </FormGroup>
            <FormGroup controlId='description'>
              <ControlLabel>Project Description</ControlLabel>
              <FormControl
                type='text'
                componentClass='textarea'
                value={this.state.description}
                onChange={this.handleChange('description')}
              />
            </FormGroup>
            <FormGroup controlId='learning_point'>
              <ControlLabel>Learning Point</ControlLabel>
              <FormControl
                type='text'
                componentClass='textarea'
                value={this.state.learning_point}
                onChange={this.handleChange('learning_point')}
              />
            </FormGroup>
            <FormGroup controlId='pain_point'>
              <ControlLabel>Pain Point</ControlLabel>
              <FormControl
                type='text'
                componentClass='textarea'
                value={this.state.pain_point}
                onChange={this.handleChange('pain_point')}
              />
            </FormGroup>
            <Button className='btn-oval' type='submit'>SAVE PROJECT</Button>
          </form>
          <Button className='btn-oval btn-oval__black btn-oval__danger' onClick={this.handleDelete(project.id, history)}>
            DELETE PROJECT
          </Button>
        </Col>
        {alert &&
          <Modal
            title={alert.title}
            body={alert.body}
            show={true}
            next="/dashboard/projects"
          />
        }
      </Row>
    )
  }
}

const mapStateToProps = state => ({
	alert:state.alert
})

const EditProjectFormContainer = connect(mapStateToProps, null)(EditProjectForm)

export default withRouter(EditProjectFormContainer)

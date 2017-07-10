import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { creatingNewProject } from 'APP/src/reducers/actions/projects'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import '../auth/Form.css'

function arrowRenderer () {
	return (
		<span></span>
	);
}

class CreateProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      external_link: '',
			learning_point:'',
			pain_point:'',
      selectValue:[],
      selected_skills:[],
    }
  }

  componentDidMount(){
    this.props.getSkills()
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  _selectSkill(data){
		let skill_ids = data.split(',');
    let new_skills = []
		if (skill_ids[0] !== "") {
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
      title: '',
      description: '',
      external_link: '',
			learning_point:'',
			pain_point:'',
      selectValue:[],
      selected_skills:[],
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { title, description, external_link, learning_point, pain_point } = this.state

    const project = {
      title, description, external_link, learning_point, pain_point
    }

    project.user = this.props.user

		const skills = []
		this.state.selectValue.forEach((skill) => {
			skills.push(skill.value)
		})

		// const token = this.refs.card.state.token
    this.clearForm()
    this.props.createProject({project, skills})
		this.props.history.push('/')
  }

  render() {
    let skills = []

    this.props.skills.forEach(s => {
      skills.push({label:s.title, value:s.id})
    })
    return (
      <Row className='PostJobForm'>
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>Create a new project</h1>
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
              clearable={true}
              searchable={true}
              simpleValue
              labelKey='label'
              valueKey='value'
              ref="job_search"
              multi={true}
              options={skills}
              onChange={(data) => this._selectSkill(data)}
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
            <Button className='primary' type='submit'>Save</Button>
          </form>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  skills: state.skills.all
})
const mapDispatchToProps = dispatch => ({
  createProject: job => dispatch(creatingNewProject(job)),
  getSkills: () => dispatch(gettingAllSkills())
})

const CreateProjectFormContainer = connect(mapStateToProps, mapDispatchToProps)(CreateProjectForm)

export default CreateProjectFormContainer

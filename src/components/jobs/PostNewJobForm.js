import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { creatingNewJob } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import CreditCard from './CreditCard';
import './PostNewJobForm.css'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

function arrowRenderer () {
	return (
		<span></span>
	);
}

class PostJobForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      application_email: '',
      cc_email:'',
      application_url:'',
      city:'',
      zip_code:'',
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      app_method:'email'
    }
  }

  componentWillMount(){
    this.props.getSkills()
  }

  switchAppMethod(method){
    this.setState({app_method:method})
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  handleSubmit = event => {
    event.preventDefault()
    const {title, description} = this.state
    const employer = {}
    employer.name = this.props.user.employer.name
    employer.email = this.props.user.email
    const job = {title, description}
    job.application_email = this.props.user.employer.name
    // const token = this.refs.card.state.token
    const token = ""
    debugger;
    this.props.createJobPost({employer, job, token})
  }

  _selectSkill(data){
		let skill_ids = data.split(',');
    let new_skills = []
		if(skill_ids[0] !== ""){
      skill_ids.forEach((sk_id) => {
				this.props.skills.forEach((s) => {
          if(s.id === parseInt(sk_id, 10)){
            new_skills.push({label:s.title, value:s.id})
          }
        })
			});
		} else {
			new_skills = [];
		}
		let new_state = Object.assign({}, this.state,
			 {selectValue:new_skills, selected_skills:skill_ids})
		this.setState(new_state);
	}

  render() {
    let skills = []
    console.log("PORPS", this.props)
    this.props.skills.forEach((s) => {
      skills.push({label:s.title, value:s.id})
    })
    return (
      <div>
        <h1 className='PostJobForm-header'>Post a new job</h1>
        <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
          <FormGroup controlId='title'>
            <ControlLabel>Job Title</ControlLabel>
            <FormControl
            type='text'
            value={this.state.title}
            placeholder='e.g., Senior DevOps Engineer'
            onChange={this.handleChange('title')}
            />
          </FormGroup>
          <VirtualizedSelect
                  arrowRenderer={arrowRenderer}
                  autofocus
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
                  placeholder="Skills"
                />
          <FormGroup controlId='description'>
            <ControlLabel>Job Description and Requirements</ControlLabel>
            <FormControl
              type='text'
              componentClass='textarea'
              value={this.state.description}
              onChange={this.handleChange('description')}
            />
          </FormGroup>
          <FormGroup controlId='application_email'>
            <ControlLabel>Application Email</ControlLabel>
            <FormControl
              type='email'
              value={this.state.application_email}
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('application_email')}
            />
          </FormGroup>
          <FormGroup controlId='cc_email'>
            <ControlLabel>CC Email</ControlLabel>
            <FormControl
              type='email'
              value={this.state.cc_email}
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('cc_email')}
            />
          </FormGroup>
          <FormGroup controlId='application_url'>
            <ControlLabel>Application URL</ControlLabel>
            <FormControl
              type='url'
              value={this.state.application_url}
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('application_url')}
            />
          </FormGroup>
          <FormGroup controlId='city'>
            <ControlLabel>Job City</ControlLabel>
            <FormControl
              type='city'
              value={this.state.city}
              placeholder='e.g., NY'
              onChange={this.handleChange('city')}
            />
          </FormGroup>
          <FormGroup controlId='zip_code'>
            <ControlLabel>Zip Code</ControlLabel>
            <FormControl
              type='zip_code'
              value={this.state.zip_code}
              placeholder='e.g., zip_code'
              onChange={this.handleChange('zip_code')}
            />
          </FormGroup>
          <Button className='primary' type='submit'>Post Job</Button>
        </form>
        <CreditCard ref='card' />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  skills: state.skills.all
})
const mapDispatchToProps = dispatch => ({
  createJobPost: post => dispatch(creatingNewJob(post)),
  getSkills: post => dispatch(gettingAllSkills())
})

const PostNewJobContainer = connect(mapStateToProps, mapDispatchToProps)(PostJobForm)

export default PostNewJobContainer

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { updatingJob } from 'APP/src/reducers/actions/skills'
import CreditCard from './CreditCard';
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

function arrowRenderer () {
	return (
		<span></span>
	);
}
const states = [
	'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS',
	'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
	'NC','ND','MP','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA',
	"WV",'WI','WY']

const job_types = [
  {label:"Full Time",value:"Full Time"},
  {label:"Part Time",value:"Part Time"},
  {label:"Contract",value:"Contract"},
  {label:"Third Pary",value:"Third Party"},
]

class JobUpdateDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
        title: this.props.job.title || '',
        description: this.props.job.description || '',
        application_email: this.props.job.application_email || '',
        cc_email:this.props.job.cc_email || '',
        application_url:this.props.job.application_url || '',
        city:this.props.job.city || '',
        zip_code:this.props.job.zip_code || '',
        selectValue:this.props.job.selectValue || '',
        jobValue:this.props.job.jobValue || '',
        number: this.props.job.number || null,
        exp_month: this.props.job.exp_month || null,
        exp_year: this.props.job.exp_year || null,
  			remote:this.props.job.remote || false,
        cvc: this.props.job.cvc || null,
        token: this.props.job.token || null,
        app_method:this.props.job.app_method || 'email'
    }
  }

	toggleRemote(){
		const remote = !this.state.remote
		this.setState({state:remote})
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
    employer.id = this.props.user.employer.id
    const job = {title, description}
    job.application_emails = [this.state.application_email, this.state.cc_email]
		job.application_url = this.state.application_url
		job.city = this.state.city
		job.state = this.refs.state.value
		job.country = "United States of America"
		job.zip_code = this.state.zip_code
		job.remote = this.state.remote
		job.pay_rate = this.refs.pay_rate.value
		job.compensation = this.refs.compensation.value
		job.travel_requirements = this.refs.travel_requirements.value

		job.employment_types = []
		this.state.jobValue.forEach((jt)=>{
			job.employment_types.push(jt.label)
		})
		job.skills = []
		this.state.selectValue.forEach((skill)=>{
			job.skills.push(skill.value)
		})

		// const token = this.refs.card.state.token
    const token = ""
		debugger;
    this.props.updateJob({employer, job, token})
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

  _selectJobType(data){
		let type_ids = data.split(',');
    let new_types = []
    if(type_ids[0] !== ""){
      type_ids.forEach((t) => {
        new_types.push({label:t, value:t})
      })
    }else {
      new_types = []
    }
		let new_state = Object.assign({}, this.state,
			 {jobValue:new_types, selected_skills:type_ids})
		this.setState(new_state);
	}

  render() {
		let state_options = []
    let skills = []
    this.props.skills.forEach((s) => {
      skills.push({label:s.title, value:s.id})
    })
		states.forEach((s) => {
      state_options.push(<option key={s}>{s}</option>)
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
					<FormGroup controlId='state'>
						<ControlLabel>State</ControlLabel>
						<select ref='state' placeholder='State'>
							{state_options}
						</select>
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
					<FormGroup controlId='job_types'>
						<ControlLabel>Job Types</ControlLabel>
	          <VirtualizedSelect
	                  arrowRenderer={arrowRenderer}
	                  autofocus
	                  searchable={false}
	                  simpleValue
	                  labelKey='label'
	                  valueKey='value'
	                  ref="job_search"
	                  multi={true}
	                  options={job_types}
	                  onChange={(data) => this._selectJobType(data)}
	                  value={this.state.jobValue}
	                  placeholder="Job Types"
	                />
					</FormGroup>
					<FormGroup controlId='compensation'>
						<ControlLabel>Compensation Type</ControlLabel>
						<FormControl componentClass='select' ref='compensation'>
							<option value='Salary'>Salary</option>
							<option value='Hourly'>Hourly</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId='pay_rate'>
						<ControlLabel>Pay Rate</ControlLabel>
						<FormControl
              type='phone'
              value={this.state.pay_rate}
              onChange={this.handleChange('pay_rate')}
            />
					</FormGroup>
					<FormGroup controlId='travel_requirements'>
						<ControlLabel>Travel Requirements</ControlLabel>
						<select ref='travel_requirements' placeholder='Travel Requirements'>
							<option>None</option>
							<option>Occasional</option>
							<option>25%</option>
							<option>50%</option>
							<option>75%</option>
							<option>100%</option>
						</select>
					</FormGroup>
					<FormGroup controlId='remote'>
						<ControlLabel>Tellecomute:</ControlLabel>
						<input ref='remote' type='checkbox' onClick={this.toggleRemote.bind(this)}/>
					</FormGroup>
          <Button className='primary' type='submit'>Update Job</Button>
        </form>
      </div>
    )
  }
}

export default JobUpdateDisplay

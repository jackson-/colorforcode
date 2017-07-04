import React, { Component } from 'react'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
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
const states = [
	'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS',
	'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
	'NC','ND','MP','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA',
	"WV",'WI','WY']

const job_types = [
  {label: "Full Time", value: "Full Time"},
  {label: "Part Time", value: "Part Time"},
  {label: "Contract", value: "Contract"},
  {label: "Contract to Hire", value: "Contract to Hire"},
  {label: "Internship", value: "Internship"},
  {label: "Remote", value: "Remote"}
]

class JobUpdateDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.job.title || '',
      description: this.props.job.description || '',
      application_email: this.props.job.application_email || '',
      cc_email: this.props.job.cc_email || '',
      application_url: this.props.job.application_url || '',
      city: this.props.job.city || '',
      zip_code: this.props.job.zip_code || '',
      state: this.props.job.state || '',
      country: 'US',
      selectValue: '',
      jobValue: this.props.job.employment_types || '',
      number: this.props.job.number || null,
      exp_month: this.props.job.exp_month || null,
      exp_year: this.props.job.exp_year || null,
      pay_rate: this.props.job.pay_rate || '',
      cvc: this.props.job.cvc || null,
      token: this.props.job.token || null,
      app_method:this.props.job.app_method || 'email'
    }
  }

  _selectSkill = data => {
    let skill_ids = data.split(',');
    let new_skills = []

    if (skill_ids[0] !== "") {
      skill_ids.forEach((sk_id) => {
        this.props.skills.forEach((s) => {
          if(s.id === parseInt(sk_id, 10)){
            new_skills.push({label:s.title, value:s.id})
          }
        })
      });
    }
    this.setState({
      selectValue: [...new_skills],
      selected_skills: skill_ids
    })
  }

  _selectJobType = data => {
    let type_ids = data.split(',');
    let new_types = []
    if (type_ids[0] !== "") {
      type_ids.forEach((t) => {
        new_types.push({label:t, value:t})
      })
    }
    this.setState({
      jobValue: [...new_types],
      selected_jobtypes: type_ids
    })
  }

  handleDelete = event => {
    event.preventDefault()
    console.log(this.props)
    this.props.deleteJob(this.props.job.id, this.props.history)
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  handleSubmit = event => {
    event.preventDefault()
    const { title, description, application_url, country,
            city, zip_code, state, selectValue, jobValue,
            pay_rate, travel_requirements, compensation_type,
            app_method, application_email, cc_email, remote } = this.state

    const job = {
      title, description, application_url, country,
      city, zip_code, state, selectValue, jobValue,
      pay_rate, travel_requirements, compensation_type,
      application_email, cc_email, remote, app_method
    }

    job.application_emails = [application_email, cc_email]
    job.id = this.props.job.id

    if (this.state.jobValue[0].label) {
      job.employment_types = []
  		this.state.jobValue.forEach((jt)=>{
  			job.employment_types.push(jt.label)
  		})
    } else {
      job.employment_types = this.state.jobValue
    }

    let skills = []
		if (!this.state.selectValue) {
      skills = this.props.job.skills.map(skill => skill.id)
    } else {
      this.state.selectValue.forEach(skill => {
  			skills.push(skill.value)
  		})
    }
    console.log(this.props)
    this.props.updateJob({skills, job}, this.props.history)
  }

  render() {
    const {job} = this.props
		let state_options = []
    let skills = []
    let initialSkills = []
    this.props.skills.forEach((s) => {
      skills.push({label: s.title, value: s.id})
    })

    if (job) {
      job.skills.forEach(skill => {
        initialSkills.push({label: skill.title, value: skill.id})
      })
    }

		states.forEach((state, idx) => {
      state_options.push(<option value={state} key={idx}>{state}</option>)
    })

    return (
      job &&
      <Row className='UpdateJobForm'>
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='UpdateJobForm-header'>Edit Job</h1>
          <form className='UpdateJobForm-body' onSubmit={this.handleSubmit}>
            <FormGroup controlId='title'>
              <ControlLabel>Job Title</ControlLabel>
              <FormControl
                type='text'
                value={this.state.title}
                placeholder='e.g., Senior DevOps Engineer'
                onChange={this.handleChange('title')}
              />
            </FormGroup>
            <FormGroup controlId='job_types'>
  						<ControlLabel>Skills</ControlLabel>
              <VirtualizedSelect
                arrowRenderer={arrowRenderer}
                clearable={false}
                searchable={false}
                simpleValue
                labelKey='label'
                valueKey='value'
                ref="job_search"
                multi={true}
                options={skills}
                onChange={this._selectSkill}
                value={this.state.selectValue || initialSkills}
                placeholder="Skills"
              />
            </FormGroup>
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
  						<FormControl
                defaultValue={job.state}
                componentClass='select'
                onChange={this.handleChange('state')}
              >
  							{state_options}
  						</FormControl>
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
                clearable={false}
                searchable={false}
                simpleValue
                labelKey='label'
                valueKey='value'
                ref="job_search"
                multi={true}
                options={job_types}
                onChange={this._selectJobType}
                value={this.state.jobValue}
                placeholder="Job Types"
              />
  					</FormGroup>
  					<FormGroup controlId='compensation'>
  						<ControlLabel>Compensation Type</ControlLabel>
  						<FormControl
                defaultValue={job.compensation_type}
                componentClass='select'
                onChange={this.handleChange('compensation_type')}
              >
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
  						<FormControl
                defaultValue={job.travel_requirements}
                componentClass='select'
                onChange={this.handleChange('travel_requirements')}
              >
  							<option value='None'>None</option>
  							<option value='Occasional'>Occasional</option>
  							<option value='25%'>25%</option>
  							<option value='50%'>50%</option>
  							<option value='75%'>75%</option>
  							<option value='100%'>100%</option>
  						</FormControl>
  					</FormGroup>
            <Button type='submit'>Update Job</Button>
          </form>
          <Button bsStyle='danger' type='submit' onClick={this.handleDelete}>
            Delete Job
          </Button>
        </Col>
      </Row>
    )
  }
}

export default JobUpdateDisplay

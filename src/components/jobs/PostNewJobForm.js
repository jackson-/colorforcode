import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { creatingNewJob } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import CreditCardFormControls from './CreditCard';
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
	"WV",'WI','WY'
]

const job_types = [
  {label:"Full Time", value:"Full Time"},
  {label:"Part Time", value:"Part Time"},
  {label:"Contract", value:"Contract"},
  {label:"Contract to Hire", value:"Contract to Hire"},
  {label:"Internship", value:"Internship"},
  {label:"Remote", value:"Remote"}
]

class PostJobForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      application_email: '',
      cc_email: '',
      application_url:'',
      city:'',
      state: '',
      zip_code:'',
      selectValue:[],
      jobValue:[],
      pay_rate: '',
      compensation_type: 'Salary',
      travel_requirements: 'None',
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      app_method:'email',
			remote:false,
    }
  }

  componentDidMount(){
    this.props.getSkills()
  }

	toggleRemote(){
		const remote = !this.state.remote
		this.setState({state: remote})
	}

  switchAppMethod(method){
    this.setState({app_method:method})
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  clearForm = () => {
    this.setState({
      title: '',
      description: '',
      application_email: '',
      cc_email: '',
      application_url:'',
      city:'',
      state: '',
      zip_code:'',
      selectValue: [],
      jobValue:[],
      pay_rate: '',
      compensation_type: 'Salary',
      travel_requirements: 'None',
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      app_method:'email'
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { title, description, application_url,
            city, state, zip_code, selectValue, jobValue,
            pay_rate, compensation_type, travel_requirements,
            number, exp_month, exp_year, cvc, app_method,
            application_email, cc_email, remote } = this.state

    const job = {
      title, description, application_url,
      city, state, zip_code, selectValue, jobValue,
      pay_rate, compensation_type, travel_requirements,
      number, exp_month, exp_year, cvc, app_method,
      application_email, cc_email, remote
    }

    job.employer_id = this.props.user.employer.id
		job.employment_types = []
		this.state.jobValue.forEach((jt)=>{
			job.employment_types.push(jt.label)
		})

		const skills = []
		this.state.selectValue.forEach((skill) => {
			skills.push(skill.value)
		})

		// const token = this.refs.card.state.token
    this.clearForm()
    this.props.createJobPost({job, skills})
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

  _selectJobType(data){
		let type_ids = data.split(',');
    let new_types = []
    if (type_ids[0] !== "") {
      type_ids.forEach((t) => {
        new_types.push({label: t, value: t})
      })
    }
    this.setState({
      jobValue: [...new_types],
      selected_jobtypes: type_ids
    })
	}

  render() {
		let state_options = []
    let skills = []

    this.props.skills.forEach(s => {
      skills.push({label:s.title, value:s.id})
    })

		states.forEach((s, idx) => {
      state_options.push(<option key={idx} value={s}>{s}</option>)
    })

    return (
      <Row className='PostJobForm'>
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>Post a new job</h1>
          <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
            <FormGroup controlId='title'>
              <ControlLabel>Job Title</ControlLabel>
              <FormControl
                type='text'
                value={this.state.title}
                onChange={this.handleChange('title')}
              />
            </FormGroup>
            <ControlLabel>
              Required Skills (type below and hit 'Enter' to select and 'Backspace to deselect')
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
                onChange={this.handleChange('application_email')}
              />
            </FormGroup>
            <FormGroup controlId='cc_email'>
              <ControlLabel>CC Email</ControlLabel>
              <FormControl
                type='email'
                value={this.state.cc_email}
                onChange={this.handleChange('cc_email')}
              />
            </FormGroup>
            <FormGroup controlId='application_url'>
              <ControlLabel>Application URL</ControlLabel>
              <FormControl
                type='url'
                value={this.state.application_url}
                onChange={this.handleChange('application_url')}
              />
            </FormGroup>
            <FormGroup controlId='city'>
              <ControlLabel>Job City</ControlLabel>
              <FormControl
                type='city'
                value={this.state.city}
                onChange={this.handleChange('city')}
              />
            </FormGroup>
  					<FormGroup controlId='state'>
  						<ControlLabel>State</ControlLabel>
  						<FormControl componentClass="select" ref='state'>
  							{state_options}
  						</FormControl>
  					</FormGroup>
            <FormGroup controlId='zip_code'>
              <ControlLabel>Zip Code</ControlLabel>
              <FormControl
                type='phone'
                value={this.state.zip_code}
                onChange={this.handleChange('zip_code')}
              />
            </FormGroup>
  					<FormGroup controlId='job_types'>
  						<ControlLabel>Job Types (select all that apply)</ControlLabel>
  	          <VirtualizedSelect
                arrowRenderer={arrowRenderer}
                searchable={false}
                simpleValue
                labelKey='label'
                valueKey='value'
                ref="job_search"
                multi={true}
                options={job_types}
                onChange={(data) => this._selectJobType(data)}
                value={this.state.jobValue}
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
  						<FormControl componentClass='select' ref='travel_requirements'>
  							<option value='None'>None</option>
  							<option value='Occasional'>Occasional</option>
  							<option value='25%'>25%</option>
  							<option value='50%'>50%</option>
  							<option value='75%'>75%</option>
  							<option value='100%'>100%</option>
  						</FormControl>
  					</FormGroup>
            <CreditCardFormControls ref='card' />
            <Button className='primary' type='submit'>Post Job</Button>
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
  createJobPost: post => dispatch(creatingNewJob(post)),
  getSkills: post => dispatch(gettingAllSkills())
})

const PostNewJobContainer = connect(mapStateToProps, mapDispatchToProps)(PostJobForm)

export default PostNewJobContainer

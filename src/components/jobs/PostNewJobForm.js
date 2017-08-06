import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Checkbox } from 'react-bootstrap'
import Modal from 'APP/src/components/utilities/Modal'
import axios from 'axios'
import { creatingNewJob } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import CreditCardFormControls from './CreditCard'
import VirtualizedSelect from 'react-virtualized-select'
import PropTypes from 'prop-types'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import '../auth/Form.css'

function arrowRenderer () {
  return <span />
}

class PostJobForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      application_email: '',
      cc_email: '',
      application_url: '',
      location: '',
      coords: '',
      zip_code: '',
      selectValue: [],
      employment_types: new Set([]),
      pay_rate: '',
      compensation_type: 'Salary',
      travel_requirements: 'None',
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      status: 'open',
      app_method: 'email',
      finished:false,
      modal:null
    }
  }

  componentDidMount () {
    this.props.getSkills()
  }

  handleLocation = zip_code => {
    axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
    .then(res => res.data)
    .then(json => {
      const address = json.results[0].address_components.filter(c => (
        c.types.includes('locality') ||
        c.types.includes('administrative_area_level_1') ||
        c.types.includes('country')
      ))
      const city = address[0].long_name
      const state = address[1].short_name
      const country = address[2].long_name
      const location = country === 'United States' ? `${city}, ${state}` : `${city}, ${state} ${country}`
      const coords = `${json.results[0].geometry.location.lat},${json.results[0].geometry.location.lng}`
      this.setState({coords, zip_code, location})
    })
    .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    const { value } = event.target
    if (type === 'zip_code' && value.toString().length === 5) {
      /* first we finish updating the state of the input, then we use the zip to find the rest of the location data by passing the callback to setState (an optional 2nd param) */
      this.setState({[type]: value}, this.handleLocation(value))
    } else if (type === 'employment_types') {
      this.state.employment_types.has(value)
        ? this.state.employment_types.delete(value)
        : this.state.employment_types.add(value)
      const employment_types = new Set([...this.state.employment_types])
      /* ^Using a Set instead of an array because we need the data values to be unique */
      this.setState({employment_types})
    } else {
      this.setState({[type]: value})
    }
  }

  clearForm = () => {
    this.setState({
      title: '',
      description: '',
      application_email: '',
      cc_email: '',
      application_url: '',
      location: '',
      coords: '',
      zip_code: '',
      selectValue: [],
      employment_types: new Set([]),
      pay_rate: '',
      compensation_type: 'Salary',
      travel_requirements: 'None',
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      status: 'open',
      app_method: 'email'
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const job = {...this.state}
    job.employer_id = this.props.user.employer.id
    job.employment_types = [...this.state.employment_types]
    const skills = job.selectValue.map(skill => skill.value)
    delete job.selectValue
    // const token = this.refs.card.state.token
    this.clearForm()
    this.props.createJobPost({job, skills}, this.props.history)
  }

  _selectSkill(data){
    let skill_ids = data.split(',')
    let new_skills = []
    if (skill_ids[0] !== '') {
      skill_ids.forEach((sk_id) => {
        this.props.skills.forEach((s) => {
          if (s.id === parseInt(sk_id, 10)) {
            new_skills.push({label: s.title, value: s.id})
          }
        })
      })
    }
    this.setState({
      selectValue: [...new_skills],
      selected_skills: skill_ids
    })
  }

  render () {
    const {modal} = this.state
    let skills = this.props.skills.map(s => ({label: s.title, value: s.id}))
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
              clearable
              searchable
              simpleValue
              labelKey='label'
              valueKey='value'
              ref='job_search'
              multi
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
            {/* with zip_code we auto find user's city, state, country and coords */}
            <FormGroup controlId='zip_code'>
              <ControlLabel>Zip Code</ControlLabel>
              <FormControl
                required
                type='tel'
                value={this.state.zip_code}
                onChange={this.handleChange('zip_code')}
              />
            </FormGroup>
            <FormGroup
              controlId='employment_types'
              name='employment_types'
              onChange={this.handleChange('employment_types')}>
              <ControlLabel>Employment Type(s)</ControlLabel>
              <Checkbox value='Full-time'>Full-time</Checkbox>
              <Checkbox value='Part-time'>Part-time</Checkbox>
              <Checkbox value='Contract'>Contract</Checkbox>
              <Checkbox value='Contract to Hire'>Contract to Hire</Checkbox>
              <Checkbox value='Internship'>Internship</Checkbox>
              <Checkbox value='Remote'>Remote</Checkbox>
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
        {this.state.finished && modal &&

          <Modal
            title={modal.title}
            body={modal.body}
          />
        }
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  skills: state.skills.all
})
const mapDispatchToProps = dispatch => ({
  createJobPost: (post, history) => dispatch(creatingNewJob(post, history)),
  getSkills: post => dispatch(gettingAllSkills())
})

PostJobForm.propTypes = {
  user: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  getSkills: PropTypes.func.isRequired,
  createJobPost: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PostJobForm)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Row, Col, FormGroup, ControlLabel,
  FormControl, Button, Checkbox } from 'react-bootstrap'
import axios from 'axios'
import { creatingNewJobs } from 'APP/src/reducers/actions/jobs'
import { receiveSelectedSkills } from 'APP/src/reducers/actions/skills'
import CreditCardFormControls from './CreditCard'
import SkillTypeaheadSelect from '../utilities/SkillTypeaheadSelect'
import PropTypes from 'prop-types'
import '../auth/Form.css'

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
      jobs: [],
      skills: []
    }
  }

  handleLocation = zip_code => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
      .then(res => res.data)
      .then(json => {
        const address = json.results[0].address_components
        const geometry = json.results[0].geometry.location
        let city = address.filter(c => (
          c.types.includes('sublocality') || c.types.includes('locality')
        ))[0].long_name
        let state = address.filter(c => (
          c.types.includes('administrative_area_level_1')
        ))[0].short_name
        let country = address.filter(c => (
          c.types.includes('country')
        ))[0].long_name
        const location = country === 'United States'
          ? `${city}, ${state}`
          : `${city}, ${state} ${country}`
        const coords = {
          type: 'Point',
          coordinates: [parseFloat(geometry.lng), parseFloat(geometry.lat)],
          crs: {type: 'name', properties: {name: 'EPSG:32661'}}
        }
        this.setState({coords, zip_code, location})
      })
      .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    let value = Array.isArray(event)
      ? event
      : event.target.value
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
    } else if (type === 'skills') {
      this.props.handleNewSkills(value)
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
      app_method: 'email',
      jobs: [],
      skills: []
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    let {user, createJobPosts, receiveSelectedSkills, history, selected} = this.props
    let {jobs, skills, ...job} = this.state
    job.employer_id = user.employer.id
    job.employment_types = [...this.state.employment_types]
    this.clearForm()
    jobs.push(job)
    selected = selected.map((s) => s.id)
    skills.push(selected)
    receiveSelectedSkills([])
    createJobPosts({jobs, skills}, history)
  }

  addJob = event => {
    event.preventDefault()
    let {jobs, skills, ...job} = this.state
    job.employer_id = this.props.user.employer.id
    job.employment_types = [...this.state.employment_types]
    this.clearForm()
    jobs.push(job)
    skills.push(this.props.selected.map((s) => s.id))
    this.props.receiveSelectedSkills([])
    this.setState({jobs, skills})
  }

  render () {
    const {animated} = this.props
    return (
      <Row className={`PostJobForm fadeIn ${animated}`}>
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='PostJobForm-header'>POST NEW JOB</h1>
          <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
            <FormGroup controlId='title'>
              <ControlLabel>Job Title</ControlLabel>
              <FormControl
                type='text'
                value={this.state.title}
                onChange={this.handleChange('title')}
              />
            </FormGroup>
            <SkillTypeaheadSelect handleChange={this.handleChange} />
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
              <Checkbox value='Full Time'>Full Time</Checkbox>
              <Checkbox value='Part Time'>Part Time</Checkbox>
              <Checkbox value='Contract'>Contract</Checkbox>
              <Checkbox value='Contract to Hire'>Contract to Hire</Checkbox>
              <Checkbox value='Internship'>Internship</Checkbox>
              <Checkbox value='Remote'>Remote</Checkbox>
              <Checkbox value='Freelance'>Freelance</Checkbox>
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
            <Button className='primary' type='submit'>Add Job & Checkout</Button>
            <Button className='primary' onClick={this.addJob}>Add Another</Button>
          </form>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  selected: state.skills.selected
})

const mapDispatchToProps = dispatch => ({
  createJobPosts: (data, history) => dispatch(creatingNewJobs(data, history)),
  receiveSelectedSkills: skills => dispatch(receiveSelectedSkills(skills))
})

PostJobForm.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.any,
  selected: PropTypes.arrayOf(PropTypes.object),
  createJobPost: PropTypes.func,
  animated: PropTypes.string,
  handleNewSkills: PropTypes.func,
  // ^creates new skills if user made any custom ones (class method of App.js)
  receiveSelectedSkills: PropTypes.func,
  createJobPosts: PropTypes.func
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostJobForm))

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Checkbox, HelpBlock } from 'react-bootstrap'
import axios from 'axios'
import { creatingNewJob } from 'APP/src/reducers/actions/jobs'
import CreditCardFields from './CreditCard'
import SkillTypeaheadSelect from '../utilities/SkillTypeaheadSelect'
import PropTypes from 'prop-types'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
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
    }
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
      app_method: 'email'
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const {createJobPost, selected, history, user} = this.props
    const job = {...this.state}
    job.employer_id = user.employer.id
    // change employment_types from Set to Array
    job.employment_types = [...this.state.employment_types]
    let skills = selected
    skills = skills.map(s => s.id)
    this.clearForm()
    createJobPost({job, skills}, history)
  }

  render () {
    return (
      <Row className='PostJobForm fadeIn animated'>
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
            <ControlLabel>
              Key Skills
            </ControlLabel>
            <SkillTypeaheadSelect handleChange={this.handleChange} />
            <HelpBlock>
              Type and use arrows to select skill, then hit 'Enter' to add selected skill.
            </HelpBlock>
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
            <CreditCardFields ref='card' />
            <Button className='primary' type='submit'>Post Job</Button>
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
  createJobPost: (post, history) => dispatch(creatingNewJob(post, history))
})

PostJobForm.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.any,
  selected: PropTypes.arrayOf(PropTypes.object),
  createJobPost: PropTypes.func,
  handleNewSkills: PropTypes.func
  // ^creates new skills if user made any custom ones (class method of App.js)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostJobForm))

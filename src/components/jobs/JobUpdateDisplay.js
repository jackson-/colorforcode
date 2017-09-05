import React, { Component } from 'react'
import {
  Row, Col, FormGroup, ControlLabel,
  FormControl, Button, Checkbox, HelpBlock } from 'react-bootstrap'
import axios from 'axios'
import PropTypes from 'prop-types'
// import VirtualizedSelect from 'react-virtualized-select'
import SkillTypeaheadSelect from '../utilities/SkillTypeaheadSelect'
// import 'react-select/dist/react-select.css'
// import 'react-virtualized/styles.css'
// import 'react-virtualized-select/styles.css'
import '../auth/Form.css'

export default class JobUpdateDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.job.title || '',
      description: this.props.job.description || '',
      application_email: this.props.job.application_email || '',
      cc_email: this.props.job.cc_email || '',
      application_url: this.props.job.application_url || '',
      coords: this.props.job.coords || '',
      location: this.props.job.location || '',
      zip_code: this.props.job.zip_code || '',
      state: this.props.job.state || '',
      pay_rate: this.props.job.pay_rate || '',
      compensation_type: this.props.job.compensation_type || '',
      travel_requirements: this.props.job.travel_requirements,
      country: 'US',
      selectValue: this.formatInitialSkills() || [],
      employment_types: new Set([...this.props.job.employment_types]) || new Set([])
    }
  }

  formatInitialSkills = () => this.props.job.skills.map(skill => ({
    label: skill.title,
    value: skill.id
  }))

  _selectSkill = data => {
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

  handleDelete = event => {
    event.preventDefault()
    this.props.deleteJob(this.props.job.id, this.props.history)
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
    if (type === 'zip_code' && value.toString().length >= 5) {
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
      title: this.props.job.title || '',
      description: this.props.job.description || '',
      application_email: this.props.job.application_email || '',
      cc_email: this.props.job.cc_email || '',
      application_url: this.props.job.application_url || '',
      coords: this.props.job.coords || '',
      location: this.props.job.location || '',
      zip_code: this.props.job.zip_code || '',
      state: this.props.job.state || '',
      country: 'US',
      compensation_type: this.props.job.compensation_type || '',
      pay_rate: this.props.job.pay_rate || '',
      selectValue: this.formatInitialSkills() || '',
      employment_types: new Set([...this.props.job.employment_types]) || new Set([]),
      travel_requirements: this.props.job.travel_requirements
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const job = {...this.state}
    const {selected, updateJob, history, user} = this.props
    job.id = this.props.job.id
    job.employer_id = user.employer.id
    // change employment_types from Set to Array
    job.employment_types = [...this.state.employment_types]
    job.status = 'open'
    const skills = selected.map(s => s.id)
    this.clearForm()
    updateJob({job, skills}, history)
  }

  isChecked = type => {
    return this.state.employment_types.has(type)
  }

  render () {
    const {job} = this.props

    return (
      job &&
      <Row className='UpdateJobForm'>
        <Col xs={12} sm={12} md={12} lg={12}>
          <h1 className='UpdateJobForm-header'>Edit Job</h1>
          <Row>
            <form className='UpdateJobForm-body' onSubmit={this.handleSubmit}>
              <Col xs={12} sm={6} md={6} lg={6}>
                <FormGroup controlId='title'>
                  <ControlLabel>JOB TITLE</ControlLabel>
                  <FormControl
                    type='text'
                    value={this.state.title}
                    onChange={this.handleChange('title')}
                  />
                </FormGroup>
                <ControlLabel>
                  KEY SKILLS
                </ControlLabel>
                <SkillTypeaheadSelect handleChange={this.handleChange} />
                <HelpBlock>
                  Type and use arrows to select skill, then hit 'Enter' to add selected skill.
                </HelpBlock>
                <FormGroup controlId='description'>
                  <ControlLabel>JOB DESCRIPTION</ControlLabel>
                  <FormControl
                    type='text'
                    componentClass='textarea'
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                  />
                </FormGroup>
                <FormGroup controlId='application_email'>
                  <ControlLabel>APPLICATION EMAIL</ControlLabel>
                  <FormControl
                    type='email'
                    value={this.state.application_email}
                    onChange={this.handleChange('application_email')}
                  />
                </FormGroup>
                <FormGroup controlId='cc_email'>
                  <ControlLabel>CC EMAIL</ControlLabel>
                  <FormControl
                    type='email'
                    value={this.state.cc_email}
                    onChange={this.handleChange('cc_email')}
                  />
                </FormGroup>
                <FormGroup controlId='application_url'>
                  <ControlLabel>APPLICATION URL</ControlLabel>
                  <FormControl
                    type='url'
                    value={this.state.application_url}
                    onChange={this.handleChange('application_url')}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6} md={4} mdOffset={2} lg={4} lgOffset={2}>
                {/* with zip_code we auto find user's city, state, country and coords */}
                <FormGroup controlId='zip_code'>
                  <ControlLabel>ZIP CODE</ControlLabel>
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
                  <ControlLabel>EMPLOYMENT TYPE(S)</ControlLabel>
                  <Checkbox value='Full-time' defaultChecked={this.isChecked('Full-time')}>
                    Full-time
                  </Checkbox>
                  <Checkbox value='Part-time' defaultChecked={this.isChecked('Part-time')}>
                    Part-time
                  </Checkbox>
                  <Checkbox value='Contract' defaultChecked={this.isChecked('Contract')}>
                    Contract
                  </Checkbox>
                  <Checkbox value='Contract to Hire' defaultChecked={this.isChecked('Contract to Hire')}>
                    Contract to Hire
                  </Checkbox>
                  <Checkbox value='Internship' defaultChecked={this.isChecked('Internship')}>
                    Internship
                  </Checkbox>
                  <Checkbox value='Remote' defaultChecked={this.isChecked('Remote')}>
                    Remote
                  </Checkbox>
                </FormGroup>
                <FormGroup controlId='compensation'>
                  <ControlLabel>COMPENSATION TYPE</ControlLabel>
                  <FormControl
                    componentClass='select'
                    defaultValue={this.state.compensation_type} onChange={this.handleChange('compensation_type')}
                  >
                    <option value='Salary'>Salary</option>
                    <option value='Hourly'>Hourly</option>
                  </FormControl>
                </FormGroup>
                <FormGroup controlId='pay_rate'>
                  <ControlLabel>PAY RATE</ControlLabel>
                  <FormControl
                    type='tel'
                    value={this.state.pay_rate}
                    onChange={this.handleChange('pay_rate')}
                  />
                </FormGroup>
                <FormGroup controlId='travel_requirements'>
                  <ControlLabel>TRAVEL REQUIREMENTS</ControlLabel>
                  <FormControl
                    componentClass='select'
                    defaultValue={this.state.travel_requirements} onChange={this.handleChange('travel_requirements')}
                  >
                    <option value='None'>None</option>
                    <option value='Occasional'>Occasional</option>
                    <option value='25%'>25%</option>
                    <option value='50%'>50%</option>
                    <option value='75%'>75%</option>
                    <option value='100%'>100%</option>
                  </FormControl>
                </FormGroup>
                <Button className='btn-oval' type='submit'>Update Job</Button>
                <Button className='btn-oval btn-oval__black btn-oval__danger' bsStyle='danger' onClick={this.handleDelete}>
                  Delete Job
                </Button>
              </Col>
            </form>
          </Row>
        </Col>
      </Row>
    )
  }
}

JobUpdateDisplay.propTypes = {
  job: PropTypes.object.isRequired,
  user: PropTypes.any.isRequired,
  history: PropTypes.object,
  selected: PropTypes.array.isRequired, // selected skills
  deleteJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
  handleNewSkills: PropTypes.func
  // ^creates new skills if user made any custom ones (class method of App.js)
}

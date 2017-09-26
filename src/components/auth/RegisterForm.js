import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import axios from 'axios'
import PropTypes from 'prop-types'
import { creatingNewUser } from 'APP/src/reducers/actions/auth'
import EmployerFields from './EmployerRegisterFields'
import ApplicantFields from './ApplicantRegisterFields'
import { withRouter } from 'react-router-dom'
import './Form.css'

class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showEmployer: false,
      showApplicant: false,
      email: '',
      password: '',
      passwordConfirm: '',
      company_name: '',
      company_role: '',
      summary: '',
      headline: '',
      title: '',
      is_looking: true,
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      image_url: '',
      company_site: '',
      personal_site: '',
      github: '',
      linkedin: '',
      twitter: '',
      work_auth: '',
      employment_types: new Set([])
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
          type: 'Point', // GeoJSON requires longitude to be first!!
          coordinates: [parseFloat(geometry.lng), parseFloat(geometry.lat)],
          crs: {type: 'name', properties: {name: 'EPSG:32661'}}
        }
        this.setState({coords, zip_code, location})
      })
      .catch(err => console.error(err.stack))
  }

  isChecked = type => {
    return this.state.employment_types.has(type)
  }

  handleChange = type => event => {
    const {value} = event.target
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
    } else if (type === 'work_auth' || type === 'company_role') {
      value === 'select'
        ? this.setState({[type]: ''})
        : this.setState({[type]: value})
    } else if (type === 'is_looking') {
      this.setState({[type]: !this.state.is_looking})
    } else {
      this.setState({[type]: value})
    }
  }

  clearForm = () => {
    this.setState({
      showEmployer: false,
      showApplicant: false,
      email: '',
      password: '',
      passwordConfirm: '',
      company_name: '',
      company_role: '',
      summary: '',
      headline: '',
      title: '',
      is_looking: true,
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      image_url: '',
      company_site: '',
      personal_site: '',
      github: '',
      linkedin: '',
      twitter: '',
      work_auth: '',
      employment_types: new Set([])
    })
  }

  toggleAccountType = event => {
    const type = event.target.value
    if (type === 'applicant') {
      this.setState({
        is_employer: false,
        showApplicant: true,
        showEmployer: false
      })
    } else {
      this.setState({
        is_employer: true,
        showEmployer: true,
        showApplicant: false
      })
    }
  }

  getValidationState = () => {
    const { password, passwordConfirm } = this.state
    if (password === '' || passwordConfirm === '') return null
    else if (password === passwordConfirm) return 'success'
    else return 'error'
  }

  isInvalid = () => {
    const {
      first_name,
      last_name,
      company_name,
      company_site,
      company_role,
      email,
      password,
      passwordConfirm,
      zip_code,
      location,
      work_auth
    } = this.state

    if (this.state.is_employer) {
      return password === passwordConfirm &&
        !(
          first_name &&
          last_name &&
          company_name &&
          company_role &&
          company_site &&
          password &&
          email
        )
    } else {
      return password === passwordConfirm &&
        !(
          first_name &&
          last_name &&
          password &&
          email &&
          zip_code &&
          location &&
          work_auth
        )
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const newUser = {...this.state}
    const {history, next, createUser} = this.props
    // turn the set into an array (postgres rejects sets)
    newUser.employment_types = [...newUser.employment_types]
    this.clearForm()
    createUser(newUser, history, next)
  }

  render () {
    const {animated} = this.props
    let applicantClass = this.state.showApplicant ? 'RegisterForm__applicant' : ''
    return (
      <Row className={`RegisterForm ${applicantClass} fadeIn animated`}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className='form-container'>
            <form className='RegisterForm-body' onSubmit={this.handleSubmit}>
              <div className='RegisterForm-header'>
                <h1 className='RegisterForm-heading'>Register</h1>
                <FormGroup controlId='is_employer' onChange={this.toggleAccountType}>
                  <ControlLabel>What type of account would you like to create?</ControlLabel>
                  <FormControl componentClass='select'>
                    <option>select an account type</option>
                    <option value='employer'>Employer</option>
                    <option value='applicant'>Applicant</option>
                  </FormControl>
                </FormGroup>
              </div>
              <Row>
                {
                  this.state.showEmployer &&
                  <EmployerFields
                    state={this.state}
                    handleChange={this.handleChange}
                    validate={this.getValidationState}
                    isInvalid={this.isInvalid()}
                    buttonText={'Create Account'}
                    animated={animated}
                  />
                }
                {
                  this.state.showApplicant &&
                  <ApplicantFields
                    state={this.state}
                    handleChange={this.handleChange}
                    validate={this.getValidationState}
                    isChecked={this.isChecked}
                    isInvalid={this.isInvalid()}
                    buttonText={'Create Account'}
                    animated={animated}
                  />
                }
              </Row>
            </form>
          </div>
        </Col>
      </Row>
    )
  }
}

RegisterForm.propTypes = {
  user: PropTypes.any, // object or null
  next: PropTypes.any, // object or null
  history: PropTypes.object,
  createUser: PropTypes.func,
  animated: PropTypes.string
}

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  next: state.location.nextRoute
})

const mapDispatchToProps = dispatch => ({
  createUser: (user, history, next) => dispatch(creatingNewUser(user, history, next))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterForm))

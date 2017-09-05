import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import axios from 'axios'
import { creatingNewUser } from 'APP/src/reducers/actions/users'
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
    } else {
      this.setState({[type]: value})
    }
  }

  clearForm = () => {
    this.setState({
      email: '',
      password: '',
      passwordConfirm: '',
      company_name: '',
      company_role: '',
      first_name: '',
      last_name: '',
      summary: '',
      headline: '',
      title: '',
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
    const {history, next} = this.props
    // turn the set into an array (postgres rejects sets)
    newUser.employment_types = [...newUser.employment_types]
    this.clearForm()
    this.props.createUser(newUser, history, next)
  }

  render () {
    const {animated} = this.props
    return (
      <Row className='RegisterForm fadeIn animated'>
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

const mapStateToProps = state => ({
  user: state.auth.currentUser,
  next: state.location.nextRoute
})

const mapDispatchToProps = dispatch => ({
  createUser: (user) => dispatch(creatingNewUser(user))
})

const RegisterFormContainer = connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
export default withRouter(RegisterFormContainer)

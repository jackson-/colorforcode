import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import axios from 'axios'
import { creatingNewUser } from 'APP/src/reducers/actions/users'
import EmployerFields from './EmployerRegisterFields'
import ApplicantFields from './ApplicantRegisterFields'
import { withRouter } from 'react-router-dom'
import './Form.css'

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      company_name: '',
      company_role: '',
      story:'',
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
      employment_type: new Set([])
    }
  }

  handleLocation(zip_code) {
    axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
    .then(res => res.data)
    .then(json => {
      const location = json.results[0].formatted_address
      this.setState({location, zip_code})
    })
    .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    const {value} = event.target
    if (type === 'zip_code' && value.toString().length === 5) {
      this.handleLocation(value)
    } else if (type === 'employment_type') {
      this.state.employment_type.has(value)
        ? this.state.employment_type.delete(value)
        : this.state.employment_type.add(value)
      const employment_type = new Set([...this.state.employment_type])
      /* ^Using a Set instead of an array because we need the data values to be unique */
      this.setState({employment_type})
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
      zip_code: '',
      location: '',
      image_url: '',
      company_site: '',
      personal_site: '',
      github: '',
      linkedin: '',
      twitter: '',
      work_auth: '',
      employment_type: new Set([])
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

  getValidationState() {
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
    // turn the set into an array (postgres rejects sets)
    newUser.employment_type = [...newUser.employment_type]
    this.clearForm()
    this.props.createUser(newUser, this.props.history)
  }

  render() {
    return (
      <Row className='RegisterForm'>
        <Col xs={12} sm={6} md={6} lg={6}>
          <h1 className='RegisterForm-header'>Register</h1>
          <form className='RegisterForm-body' onSubmit={this.handleSubmit}>
            <FormGroup controlId='is_employer' onChange={this.toggleAccountType}>
              <ControlLabel>What type of account would you like to create?</ControlLabel>
              <FormControl componentClass="select">
                <option>select an account type</option>
                <option value='employer'>Employer</option>
                <option value='applicant'>Applicant</option>
              </FormControl>
            </FormGroup>
            {
              this.state.showEmployer &&
              <EmployerFields
                state={this.state}
                handleChange={this.handleChange}
                validate={this.getValidationState}
              />
            }
            {
              this.state.showApplicant &&
              <ApplicantFields
                state={this.state}
                handleChange={this.handleChange}
                validate={this.getValidationState}
              />
            }
            <Button disabled={this.isInvalid()} className='primary' type='submit'>Create Account</Button>
          </form>
        </Col>
      </Row>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUser: (user, history) => dispatch(creatingNewUser(user, history))
})

const RegisterFormContainer = connect(null, mapDispatchToProps)(RegisterForm)

export default withRouter(RegisterFormContainer)

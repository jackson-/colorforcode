import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import axios from 'axios'
import { creatingNewUser, creatingNewEmployer } from 'APP/src/reducers/actions/users'
import EmployerFields from './EmployerRegisterFields'
import ApplicantFields from './ApplicantRegisterFields'

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      company_name: '',
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      image_url: '',
      work_auth: 'US Citizen',
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
      this.setState({employment_type})
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
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      image_url: '',
      work_auth: 'US Citizen',
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

  isInvalid = () => {
    const { email, password, passwordConfirm } = this.state
    return !(email && password && passwordConfirm)
  }

  handleSubmit = event => {
    event.preventDefault()
    const newUser = {...this.state}
    // turn the set into an array (postgres rejects sets)
    newUser.employment_type = [...newUser.employment_type]

    if (this.state.is_employer) {
      const {company_name, email} = this.state
      const newEmployer = {
        email,
        name: company_name,
      }
      this.props.createEmployer(newEmployer)
    }

    this.clearForm()
    this.props.createUser(newUser)
  }

  render() {
    console.log(this.state)
    return (
      <div>
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
            this.state.showEmployer
            && <EmployerFields state={this.state} handleChange={this.handleChange}/>
          }
          {
            this.state.showApplicant
            && <ApplicantFields state={this.state} handleChange={this.handleChange}/>
          }
          <Button disabled={this.isInvalid()} className='primary' type='submit'>Create Account</Button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUser: user => dispatch(creatingNewUser(user)),
  createEmployer: employer => dispatch(creatingNewEmployer(employer))
})

const RegisterFormContainer = connect(null, mapDispatchToProps)(RegisterForm)

export default RegisterFormContainer

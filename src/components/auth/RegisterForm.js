import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Checkbox, Button } from 'react-bootstrap'
import { creatingNewUser } from 'APP/src/reducers/actions/users'
import axios from 'axios'

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      picture_url: '',
      work_auth: 'US Citizen',
      employment_type: new Set()
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
      first_name: '',
      last_name: '',
      zip_code: '',
      location: '',
      picture_url: '',
      work_auth: 'US Citizen',
      employment_type: new Set(),
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const newUser = {...this.state}
    const employment_type = [...newUser.employment_type]
    newUser.employment_type = employment_type
    this.clearForm()
    this.props.createUser(newUser)
  }

  render() {

    return (
      <div>
        <h1 className='RegisterForm-header'>Register</h1>
        <form className='RegisterForm-body' onSubmit={this.handleSubmit}>
          <FormGroup controlId='email'>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type='text'
              value={this.state.email}
              onChange={this.handleChange('email')}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type='text'
              value={this.state.password}
              onChange={this.handleChange('password')}
            />
          </FormGroup>
          <FormGroup controlId='passwordConfirm'>
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              type='text'
              value={this.state.passwordConfirm}
              onChange={this.handleChange('passwordConfirm')}
            />
          </FormGroup>
          <FormGroup controlId='first_name'>
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              type='text'
              value={this.state.first_name}
              onChange={this.handleChange('first_name')}
            />
          </FormGroup>
          <FormGroup controlId='last_name'>
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              type='text'
              value={this.state.last_name}
              onChange={this.handleChange('last_name')}
            />
          </FormGroup>
          {/* with zip_code we auto find user's city, state and country */}
          <FormGroup controlId='zip_code'>
            <ControlLabel>Zip Code</ControlLabel>
            <FormControl
              type='tel'
              value={this.state.zip_code}
              onChange={this.handleChange('zip_code')}
            />
          </FormGroup>
          <FormGroup controlId='work_auth' onChange={this.handleChange('work_auth')}>
            <ControlLabel>Work Authorization</ControlLabel>
            <FormControl componentClass="select">
              <option value='US Citizen'>US Citizen</option>
              <option value='Canadian Citizen'>Canadian Citizen</option>
              <option value='Require Sponsorship'>need H1B Visa</option>
              <option value='Green Card'>Green Card</option>
            </FormControl>
          </FormGroup>
          <FormGroup
            controlId='employment_type'
            name='employment_type'
            onChange={this.handleChange('employment_type')}>
            <ControlLabel>Desired Employment Type(s)</ControlLabel>
            <Checkbox value='Full-time'>Full-time</Checkbox>
            <Checkbox value='Part-time'>Part-time</Checkbox>
            <Checkbox value='Contract'>Contract</Checkbox>
            <Checkbox value='Contract to Hire'>Contract to Hire</Checkbox>
            <Checkbox value='Internship'>Internship</Checkbox>
          </FormGroup>
          <Button className='primary' type='submit'>Next</Button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUser: user => dispatch(creatingNewUser(user))
})

const RegisterFormContainer = connect(null, mapDispatchToProps)(RegisterForm)

export default RegisterFormContainer

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { creatingUser } from 'APP/src/reducers/actions/users'
// import CreditCard from './CreditCard';
// import './PostNewJobForm.css'

class RegisterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  handleSubmit = event => {
    event.preventDefault()
    const {email, password} = this.state
    this.props.createUser({email, password})
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
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('email')}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type='text'
              value={this.state.password}
              placeholder='e.g., password123'
              onChange={this.handleChange('password')}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              type='text'
              value={this.state.password}
              placeholder='e.g., password123'
              onChange={this.handleChange('password')}
            />
          </FormGroup>
          <Button className='primary' type='submit'>Next</Button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createUser: user => dispatch(creatingUser(user))
})

const RegisterFormContainer = connect(null, mapDispatchToProps)(RegisterForm)

export default RegisterFormContainer

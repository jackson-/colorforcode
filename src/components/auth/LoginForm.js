import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { authenticatingUser } from 'APP/src/reducers/actions/users'


class LoginForm extends Component {
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
    this.props.loginUser({email, password})
    this.props.history.push('/')
  }

  render() {

    return (
      <div>
        <h1 className='PostJobForm-header'>Login</h1>
        <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
          <FormGroup controlId='email'>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type='email'
              value={this.state.email}
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('email')}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type='password'
              value={this.state.password}
              placeholder='e.g., password123'
              onChange={this.handleChange('password')}
            />
          </FormGroup>
          <Button className='primary' type='submit'>Login</Button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: user => dispatch(authenticatingUser(user))
})

const LoginFormContainer = connect(null, mapDispatchToProps)(LoginForm)

export default LoginFormContainer

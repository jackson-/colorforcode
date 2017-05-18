import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { login } from 'APP/src/reducers/actions/users'

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

  clearForm = () => {
    this.setState({
      email: '',
      password: ''
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const {email, password} = this.state
    this.clearForm()
    this.props.loginUser(email, password)
    this.props.history.push('/')
  }

  render() {

    return (
      <div>
        <h1 className='Login-header'>Log in to access your dashboard</h1>
        <form className='Login-body' onSubmit={this.handleSubmit}>
          <FormGroup controlId='email'>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type='email'
              value={this.state.email}
              onChange={this.handleChange('email')}
            />
          </FormGroup>
          <FormGroup controlId='password'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type='password'
              value={this.state.password}
              onChange={this.handleChange('password')}
            />
          </FormGroup>
          <Button className='primary' type='submit'>Log In</Button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: (email, password) => dispatch(login(email, password))
})

const LoginFormContainer = connect(null, mapDispatchToProps)(LoginForm)

export default LoginFormContainer

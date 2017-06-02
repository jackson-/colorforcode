import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { login } from 'APP/src/reducers/actions/users'
import './Form.css'

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

  isInvalid = () => {
    const { email, password } = this.state
    return !(email && password)
  }

  handleSubmit = event => {
    event.preventDefault()
    const { email, password } = this.state
    this.clearForm()
    this.props.loginUser(email, password, this.props.history)
  }

  render() {
    return (
      <Row className='LoginForm'>
        <h1 className='LoginForm-header'>Log In</h1>
        <form className='LoginForm-body' onSubmit={this.handleSubmit}>
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
          <Button disabled={this.isInvalid()} className='primary' type='submit'>
            Log In
          </Button>
        </form>
      </Row>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: (email, password, history) => dispatch(login(email, password, history))
})

const LoginFormContainer = connect(null, mapDispatchToProps)(LoginForm)

export default LoginFormContainer

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { login } from 'APP/src/reducers/actions/users'
import './Form.css'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class LoginForm extends Component {
  constructor (props) {
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

  render () {
    return (
      <Row className='LoginForm'>
        <ScrollToTopOnMount />
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className='form-container'>
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
              <Button
                disabled={this.isInvalid()}
                bsStyle='default'
                type='submit'
                className='btn-login-reg'
              >
                Log In
              </Button>
            </form>
          </div>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  loginUser: (email, password, history) => dispatch(login(email, password, history))
})

const LoginFormContainer = connect(mapStateToProps, mapDispatchToProps)(LoginForm)

export default withRouter(LoginFormContainer)

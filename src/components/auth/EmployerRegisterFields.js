import React from 'react'
import {
  Col, FormGroup, ControlLabel,
  FormControl, HelpBlock, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const EmployerRegisterFields = ({
  animated,
  state,
  handleChange,
  isInvalid,
  validate,
  buttonText
}) => (
  <div className={`employer fadeIn ${animated}`}>
    <Col className='form-fields-container--left' xs={12} sm={6} md={6} lg={6}>
      <FormGroup controlId='first_name'>
        <ControlLabel>First Name</ControlLabel>
        <FormControl
          required
          value={state.first_name}
          onChange={handleChange('first_name')}
        />
      </FormGroup>
      <FormGroup controlId='last_name'>
        <ControlLabel>Last Name</ControlLabel>
        <FormControl
          required
          value={state.last_name}
          onChange={handleChange('last_name')}
        />
      </FormGroup>
      <FormGroup controlId='email'>
        <ControlLabel>Email</ControlLabel>
        <FormControl
          required
          type='email'
          value={state.email}
          onChange={handleChange('email')}
        />
      </FormGroup>
      <FormGroup controlId='password'>
        <ControlLabel>Password</ControlLabel>
        <FormControl
          type='password'
          value={state.password}
          onChange={handleChange('password')}
        />
      </FormGroup>
      <FormGroup
        controlId='passwordConfirm'
        validationState={validate()}
      >
        <ControlLabel>Confirm Password</ControlLabel>
        <FormControl
          type='password'
          value={state.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
        />
        <FormControl.Feedback />
        {validate() === 'error' ? <HelpBlock>Passwords do not match</HelpBlock> : null}
      </FormGroup>
    </Col>
    <Col className='form-fields-container--right' xs={12} sm={6} md={6} lg={6}>
      {/* with zip_code we auto find user's city, state and country */}
      <FormGroup controlId='zip_code'>
        <ControlLabel>Zip Code</ControlLabel>
        <FormControl
          required
          type='tel'
          value={state.zip_code}
          onChange={handleChange('zip_code')}
        />
      </FormGroup>
      <FormGroup controlId='company_name'>
        <ControlLabel>Company Name</ControlLabel>
        <FormControl
          required
          value={state.company_name}
          onChange={handleChange('company_name')}
        />
      </FormGroup>
      <FormGroup controlId='company_role'>
        <ControlLabel>Company Role</ControlLabel>
        <FormControl
          required
          defaultValue={state.company_role}
          componentClass='select'
          onChange={handleChange('company_role')}
        >
          <option>select</option>
          <option value='Recruiter'>Recruiter</option>
          <option value='Engineer/Developer'>Engineer/Developer</option>
          <option value='Engineering Manager'>Engineering Manager</option>
          <option value='CTO'>CTO</option>
          <option value='Other'>Other</option>
        </FormControl>
      </FormGroup>
      <FormGroup controlId='company_site'>
        <ControlLabel>Company Website</ControlLabel>
        <FormControl
          required
          value={state.company_site}
          onChange={handleChange('company_site')}
        />
      </FormGroup>
      <Button
        disabled={isInvalid}
        bsStyle='default'
        type='submit'
        className='btn-login-reg'
      >
        {buttonText}
      </Button>
    </Col>
  </div>
)

EmployerRegisterFields.propTypes = {
  animated: PropTypes.string,
  state: PropTypes.object,
  handleChange: PropTypes.func,
  buttonText: PropTypes.string,
  isInvalid: PropTypes.bool,
  validate: PropTypes.func
}

export default EmployerRegisterFields

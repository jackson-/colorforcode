import React from 'react'
import { FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap'

const ApplicantRegisterFields = props => (
  <div>
    <FormGroup controlId='email'>
      <ControlLabel>Email</ControlLabel>
      <FormControl
        type='text'
        value={props.state.email}
        onChange={props.handleChange('email')}
      />
    </FormGroup>
    <FormGroup controlId='password'>
      <ControlLabel>Password</ControlLabel>
      <FormControl
        type='text'
        value={props.state.password}
        onChange={props.handleChange('password')}
      />
    </FormGroup>
    <FormGroup controlId='passwordConfirm'>
      <ControlLabel>Confirm Password</ControlLabel>
      <FormControl
        type='text'
        value={props.state.passwordConfirm}
        onChange={props.handleChange('passwordConfirm')}
      />
    </FormGroup>
    <FormGroup controlId='first_name'>
      <ControlLabel>First Name</ControlLabel>
      <FormControl
        type='text'
        value={props.state.first_name}
        onChange={props.handleChange('first_name')}
      />
    </FormGroup>
    <FormGroup controlId='last_name'>
      <ControlLabel>Last Name</ControlLabel>
      <FormControl
        type='text'
        value={props.state.last_name}
        onChange={props.handleChange('last_name')}
      />
    </FormGroup>
    {/* with zip_code we auto find user's city, state and country */}
    <FormGroup controlId='zip_code'>
      <ControlLabel>Zip Code</ControlLabel>
      <FormControl
        type='tel'
        value={props.state.zip_code}
        onChange={props.handleChange('zip_code')}
      />
    </FormGroup>
    <FormGroup controlId='work_auth' onChange={props.handleChange('work_auth')}>
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
      onChange={props.handleChange('employment_type')}>
      <ControlLabel>Desired Employment Type(s)</ControlLabel>
      <Checkbox value='Full-time'>Full-time</Checkbox>
      <Checkbox value='Part-time'>Part-time</Checkbox>
      <Checkbox value='Contract'>Contract</Checkbox>
      <Checkbox value='Contract to Hire'>Contract to Hire</Checkbox>
      <Checkbox value='Internship'>Internship</Checkbox>
    </FormGroup>
  </div>
)

export default ApplicantRegisterFields

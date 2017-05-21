import React from 'react'
import { FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

const EmployerRegisterFields = props => (
  <div>
    <FormGroup controlId='first_name'>
      <ControlLabel>First Name</ControlLabel>
      <FormControl
        required
        value={props.state.first_name}
        onChange={props.handleChange('first_name')}
      />
    </FormGroup>
    <FormGroup controlId='last_name'>
      <ControlLabel>Last Name</ControlLabel>
      <FormControl
        required
        value={props.state.last_name}
        onChange={props.handleChange('last_name')}
      />
    </FormGroup>
    <FormGroup controlId='email'>
      <ControlLabel>Email</ControlLabel>
      <FormControl
        required
        type='email'
        value={props.state.email}
        onChange={props.handleChange('email')}
      />
    </FormGroup>
    <FormGroup controlId='password'>
      <ControlLabel>Password</ControlLabel>
      <FormControl
        required
        type='password'
        value={props.state.password}
        onChange={props.handleChange('password')}
      />
    </FormGroup>
    <FormGroup
      controlId='passwordConfirm'
      validationState={props.validate()}
    >
      <ControlLabel>Confirm Password</ControlLabel>
      <FormControl
        required
        type='password'
        value={props.state.passwordConfirm}
        onChange={props.handleChange('passwordConfirm')}
      />
      <FormControl.Feedback />
      {props.validate() === 'error' ? <HelpBlock>Passwords do not match</HelpBlock> : null}
    </FormGroup>
    <FormGroup controlId='company_name'>
      <ControlLabel>Company Name</ControlLabel>
      <FormControl
        required
        value={props.state.company_name}
        onChange={props.handleChange('company_name')}
      />
    </FormGroup>
    <FormGroup controlId='company_role'>
      <ControlLabel>Company Role</ControlLabel>
      <FormControl
        required
        componentClass='select'
        onChange={props.handleChange('company_role')}
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
        value={props.state.company_site}
        onChange={props.handleChange('company_site')}
      />
    </FormGroup>
  </div>
)

export default EmployerRegisterFields

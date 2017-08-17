import React from 'react'
import { FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock } from 'react-bootstrap'

const ApplicantRegisterFields = props => (
  <div>
    <FormGroup controlId='email'>
      <ControlLabel>Email</ControlLabel>
      <FormControl
        required
        value={props.state.email}
        onChange={props.handleChange('email')}
      />
    </FormGroup>
    <FormGroup controlId='password'>
      <ControlLabel>Password</ControlLabel>
      <FormControl
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
        type='password'
        value={props.state.passwordConfirm}
        onChange={props.handleChange('passwordConfirm')}
      />
      <FormControl.Feedback />
      {props.validate() === 'error' ? <HelpBlock>Passwords do not match</HelpBlock> : null}
    </FormGroup>
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
    <FormGroup controlId='title'>
      <ControlLabel>Role You're Seeking</ControlLabel>
      <FormControl
        value={props.state.title}
        onChange={props.handleChange('title')}
        placeholder='e.g., Senior Interaction Designer'
      />
    </FormGroup>
    <FormGroup controlId='headline'>
      <ControlLabel>Profile Headline</ControlLabel>
      <FormControl
        value={props.state.headline}
        onChange={props.handleChange('headline')}
        placeholder='e.g., Clean coder, fast runner.'
      />
    </FormGroup>
    <FormGroup controlId='summary'>
      <ControlLabel>Personal Summary</ControlLabel>
      <FormControl
        componentClass="textarea"
        value={props.state.summary}
        onChange={props.handleChange('summary')}
      />
    </FormGroup>
    {/* with zip_code we auto find user's city, state and country along with their coords */}
    <FormGroup controlId='zip_code'>
      <ControlLabel>Zip Code</ControlLabel>
      <FormControl
        required
        type='tel'
        value={props.state.zip_code}
        onChange={props.handleChange('zip_code')}
      />
    </FormGroup>
    <FormGroup controlId='work_auth' onChange={props.handleChange('work_auth')}>
      <ControlLabel>Work Authorization</ControlLabel>
      <FormControl componentClass='select' defaultValue={props.state.work_auth}>
        <option>select</option>
        <option value='US Citizen'>US Citizen</option>
        <option value='Canadian Citizen'>Canadian Citizen</option>
        <option value='Require Visa Sponsorship'>Require Visa Sponsorship</option>
        <option value='Green Card'>Green Card</option>
      </FormControl>
    </FormGroup>
    <FormGroup
      controlId='employment_types'
      name='employment_types'
      onChange={props.handleChange('employment_types')}>
      <ControlLabel>Desired Employment Type(s)</ControlLabel>
      <Checkbox defaultChecked={props.isChecked('Full-time')} value='Full-time'>
        Full-time
      </Checkbox>
      <Checkbox defaultChecked={props.isChecked('Part-time')} value='Part-time'>
        Part-time
      </Checkbox>
      <Checkbox defaultChecked={props.isChecked('Contract')} value='Contract'>
        Contract
      </Checkbox>
      <Checkbox defaultChecked={props.isChecked('Contract to Hire')} value='Contract to Hire'>
        Contract to Hire
      </Checkbox>
      <Checkbox defaultChecked={props.isChecked('Internship')} value='Internship'>
        Internship
      </Checkbox>
    </FormGroup>
    <FormGroup controlId='personal_site'>
      <ControlLabel>Personal Website (optional)</ControlLabel>
      <FormControl
        type='url'
        value={props.state.personal_site}
        onChange={props.handleChange('personal_site')}
      />
    </FormGroup>
    <FormGroup controlId='github'>
      <ControlLabel>Github URL (optional)</ControlLabel>
      <FormControl
        type='url'
        value={props.state.github}
        onChange={props.handleChange('github')}
      />
    </FormGroup>
    <FormGroup controlId='linkedin'>
      <ControlLabel>LinkedIn URL (optional)</ControlLabel>
      <FormControl
        type='url'
        value={props.state.linkedin}
        onChange={props.handleChange('linkedin')}
      />
    </FormGroup>
    <FormGroup controlId='twitter'>
      <ControlLabel>Twitter URL (optional)</ControlLabel>
      <FormControl
        type='url'
        value={props.state.twitter}
        onChange={props.handleChange('twitter')}
      />
    </FormGroup>
  </div>
)

export default ApplicantRegisterFields

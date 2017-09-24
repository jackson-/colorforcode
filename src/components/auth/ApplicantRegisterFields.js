import React from 'react'
import {
  Col, FormGroup, ControlLabel, FormControl,
  Checkbox, HelpBlock, Button, ToggleButton } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ApplicantRegisterFields = ({
  animated,
  state,
  handleChange,
  isInvalid,
  validate,
  buttonText,
  isChecked
}) => {
  return (
  <div className={`applicant fadeIn ${animated}`}>
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
      <FormGroup controlId='is_looking'>
        <ControlLabel>Currently Looking</ControlLabel>
        <input
          type='checkbox'
          name='is_looking'
          checked={state.is_looking}
          value={state.is_looking}
          onChange={handleChange('is_looking')}
        />
      </FormGroup>
      <FormGroup controlId='title'>
        <ControlLabel>Role You're Seeking</ControlLabel>
        <FormControl
          value={state.title}
          onChange={handleChange('title')}
          placeholder='e.g., Senior Interaction Designer'
        />
      </FormGroup>
      <FormGroup
        controlId='employment_types'
        name='employment_types'
        onChange={handleChange('employment_types')}>
        <ControlLabel>Desired Employment Type(s)</ControlLabel>
        <Checkbox defaultChecked={isChecked('Full Time')} value='Full Time'>
          Full Time
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Part Time')} value='Part Time'>
          Part Time
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Contract')} value='Contract'>
          Contract
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Contract to Hire')} value='Contract to Hire'>
          Contract to Hire
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Internship')} value='Internship'>
          Internship
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Remote')} value='Remote'>
          Remote
        </Checkbox>
        <Checkbox defaultChecked={isChecked('Freelance')} value='Freelance'>
          Freelance
        </Checkbox>
      </FormGroup>
      {/* with zip_code we auto find user's city, state and country along with their coords */}
      <FormGroup controlId='zip_code'>
        <ControlLabel>Zip Code</ControlLabel>
        <FormControl
          required
          type='tel'
          value={state.zip_code}
          onChange={handleChange('zip_code')}
        />
      </FormGroup>
    </Col>
    <Col className='form-fields-container--right' xs={12} sm={6} md={6} lg={6}>
      <FormGroup controlId='work_auth' onChange={handleChange('work_auth')}>
        <ControlLabel>Work Authorization</ControlLabel>
        <FormControl componentClass='select' defaultValue={state.work_auth}>
          <option>select</option>
          <option value='US Citizen'>US Citizen</option>
          <option value='Canadian Citizen'>Canadian Citizen</option>
          <option value='Require Visa Sponsorship'>Require Visa Sponsorship</option>
          <option value='Green Card'>Green Card</option>
        </FormControl>
      </FormGroup>
      <FormGroup controlId='headline'>
        <ControlLabel>Profile Headline</ControlLabel>
        <FormControl
          value={state.headline}
          onChange={handleChange('headline')}
          placeholder='e.g., Clean coder, fast runner.'
        />
      </FormGroup>
      <FormGroup controlId='summary'>
        <ControlLabel>Personal Summary</ControlLabel>
        <FormControl
          componentClass='textarea'
          value={state.summary}
          onChange={handleChange('summary')}
        />
      </FormGroup>
      <FormGroup controlId='personal_site'>
        <ControlLabel>Personal Website (optional)</ControlLabel>
        <FormControl
          type='url'
          value={state.personal_site}
          onChange={handleChange('personal_site')}
        />
      </FormGroup>
      <FormGroup controlId='github'>
        <ControlLabel>Github URL (optional)</ControlLabel>
        <FormControl
          type='url'
          value={state.github}
          onChange={handleChange('github')}
        />
      </FormGroup>
      <FormGroup controlId='linkedin'>
        <ControlLabel>LinkedIn URL (optional)</ControlLabel>
        <FormControl
          type='url'
          value={state.linkedin}
          onChange={handleChange('linkedin')}
        />
      </FormGroup>
      <FormGroup controlId='twitter'>
        <ControlLabel>Twitter URL (optional)</ControlLabel>
        <FormControl
          type='url'
          value={state.twitter}
          onChange={handleChange('twitter')}
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
)}

ApplicantRegisterFields.propTypes = {
  animated: PropTypes.string,
  state: PropTypes.object,
  handleChange: PropTypes.func,
  buttonText: PropTypes.string,
  isInvalid: PropTypes.bool,
  validate: PropTypes.func,
  isChecked: PropTypes.func
}

export default ApplicantRegisterFields

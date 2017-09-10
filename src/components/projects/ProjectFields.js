import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import SkillTypeaheadSelect from '../utilities/SkillTypeaheadSelect'
import '../auth/Form.css'

const ProjectFields = ({
  handleSubmit,
  arrowRenderer,
  handleChange,
  selectSkill,
  state,
  skills,
  project,
  formatSkills,
  animated,
  isInvalid
}) => (
  <form className={`PostJobForm-body fadeIn ${animated}`} onSubmit={handleSubmit}>
    <FormGroup controlId='title'>
      <ControlLabel>Project Title</ControlLabel>
      <FormControl
        type='text'
        value={state.title}
        onChange={handleChange('title')}
      />
    </FormGroup>
    <SkillTypeaheadSelect label='Skills Utilized' handleChange={handleChange} />
    <FormGroup controlId='repo'>
      <ControlLabel>Github Repo Link</ControlLabel>
      <FormControl
        type='url'
        value={state.repo}
        onChange={handleChange('repo')}
      />
    </FormGroup>
    <FormGroup controlId='site'>
      <ControlLabel>Other External Link</ControlLabel>
      <FormControl
        type='url'
        value={state.site}
        onChange={handleChange('site')}
      />
    </FormGroup>
    <FormGroup controlId='problem'>
      <ControlLabel>Problem</ControlLabel>
      <FormControl
        type='text'
        componentClass='textarea'
        value={state.problem}
        onChange={handleChange('problem')}
        placeholder={`What problem were you exploring, analyzing, and/or solving with this project? What made you interested in this problem?`}
      />
    </FormGroup>
    <FormGroup controlId='approach'>
      <ControlLabel>Approach</ControlLabel>
      <FormControl
        type='text'
        componentClass='textarea'
        value={state.approach}
        onChange={handleChange('approach')}
        placeholder={`Describe the process you undertook in building this project.`}
      />
    </FormGroup>
    <FormGroup controlId='challenges'>
      <ControlLabel>Challenges</ControlLabel>
      <FormControl
        type='text'
        componentClass='textarea'
        value={state.challenges}
        onChange={handleChange('challenges')}
        placeholder={`Discuss trade-offs you had to make, things you got stuck on (and how you went about figuring things out), etc`}
      />
    </FormGroup>
    <FormGroup controlId='outcome'>
      <ControlLabel>Outcome</ControlLabel>
      <FormControl
        type='text'
        componentClass='textarea'
        value={state.outcome}
        onChange={handleChange('outcome')}
        placeholder={`Briefly sum up any findings, conclusions, takeaways, things you'd change were you to continue on with the project, or "Ahaa!" moments, etc.`}
      />
    </FormGroup>
    <Button
      className='btn-oval'
      type='submit'
      disabled={isInvalid}
    >
      SAVE PROJECT
    </Button>
  </form>
)

ProjectFields.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  formatSkills: PropTypes.func,
  selectSkill: PropTypes.func,
  arrowRenderer: PropTypes.func,
  skills: PropTypes.arrayOf(PropTypes.object),
  state: PropTypes.object,
  project: PropTypes.object,
  animated: PropTypes.string,
  isInvalid: PropTypes.bool
}

export default ProjectFields

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, ControlLabel, FormControl, Button, HelpBlock } from 'react-bootstrap'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import '../auth/Form.css'

class ProjectFields extends Component {
  render () {
    const {
      handleSubmit,
      arrowRenderer,
      handleChange,
      selectSkill,
      state,
      skills,
      project,
      formatSkills,
      animated
    } = this.props

    return (
      <form className={`PostJobForm-body fadeIn ${animated}`} onSubmit={handleSubmit}>
        <FormGroup controlId='title'>
          <ControlLabel>Project Title</ControlLabel>
          <FormControl
            type='text'
            value={project ? project.title : state.title}
            onChange={handleChange('title')}
          />
        </FormGroup>
        <ControlLabel>
          Applied Skills
        </ControlLabel>
        <VirtualizedSelect
          arrowRenderer={arrowRenderer}
          clearable
          searchable
          simpleValue
          labelKey='label'
          valueKey='value'
          multi
          ref='project-edit-create'
          options={skills}
          onChange={data => selectSkill(data)}
          value={project ? formatSkills(project.skills) : state.selectValue}
        />
        <HelpBlock style={{fontSize: 'x-small'}}>
          type then and hit 'Enter' to create a new skill, or click to select from existing skills
        </HelpBlock>
        <FormGroup controlId='repo'>
          <ControlLabel>Github Repo Link</ControlLabel>
          <FormControl
            type='url'
            value={project ? project.repo : state.repo}
            onChange={handleChange('repo')}
          />
        </FormGroup>
        <FormGroup controlId='site'>
          <ControlLabel>Other External Link</ControlLabel>
          <FormControl
            type='url'
            value={project ? project.site : state.site}
            onChange={handleChange('site')}
          />
        </FormGroup>
        <FormGroup controlId='problem'>
          <ControlLabel>Problem</ControlLabel>
          <FormControl
            type='text'
            componentClass='textarea'
            value={project ? project.problem : state.problem}
            onChange={handleChange('problem')}
            placeholder={`What problem were you exploring, analyzing, and/or solving with this project? What made you interested in this problem?`}
          />
        </FormGroup>
        <FormGroup controlId='approach'>
          <ControlLabel>Approach</ControlLabel>
          <FormControl
            type='text'
            componentClass='textarea'
            value={project ? project.approach : state.approach}
            onChange={handleChange('approach')}
            placeholder={`Describe the process you undertook in building this project.`}
          />
        </FormGroup>
        <FormGroup controlId='challenges'>
          <ControlLabel>Challenges</ControlLabel>
          <FormControl
            type='text'
            componentClass='textarea'
            value={project ? project.challenges : state.challenges}
            onChange={handleChange('challenges')}
            placeholder={`Discuss trade-offs you had to make, things you got stuck on (and how you went about figuring things out), etc`}
          />
        </FormGroup>
        <FormGroup controlId='outcome'>
          <ControlLabel>Outcome</ControlLabel>
          <FormControl
            type='text'
            componentClass='textarea'
            value={project ? project.outcome : state.outcome}
            onChange={handleChange('outcome')}
            placeholder={`Briefly sum up any findings, conclusions, takeaways, things you'd change were you to continue on with the project, or "Ahaa!" moments, etc.`}
          />
        </FormGroup>
        <Button className='btn-oval' type='submit'>SAVE PROJECT</Button>
      </form>
    )
  }
}

ProjectFields.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  formatSkills: PropTypes.func,
  selectSkill: PropTypes.func,
  arrowRenderer: PropTypes.func,
  skills: PropTypes.arrayOf(PropTypes.object),
  state: PropTypes.object,
  project: PropTypes.object,
  animated: PropTypes.string
}

export default ProjectFields

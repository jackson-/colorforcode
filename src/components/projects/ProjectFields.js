import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, ControlLabel, FormControl, Button, Col, Row } from 'react-bootstrap'
import SkillTypeaheadSelect from '../utilities/SkillTypeaheadSelect'
import RichTextarea from '../utilities/RichTextarea'
import ImageUploader from '../dashboard/ImageUploader'
import '../auth/Form.css'

const ProjectFields = ({
  handleSubmit,
  arrowRenderer,
  handleChange,
  handleDelete,
  selectSkill,
  state,
  skills,
  project,
  formatSkills,
  edit,
  animated,
  isInvalid
}) => (
  <form className={`fadeIn ${animated}`} onSubmit={handleSubmit}>
    <Col xs={12} sm={12} md={12} lg={12}>
      <Row>
        <Col className='form-fields-container--left' xs={12} sm={6} md={6} lg={6}>
          <FormGroup controlId='title'>
            <ControlLabel>Project Title</ControlLabel>
            <FormControl
              type='text'
              value={state.title}
              onChange={handleChange('title')}
            />
          </FormGroup>
          <SkillTypeaheadSelect label='Skills Utilized' handleChange={handleChange} />
        </Col>
        <Col className='form-fields-container--right' xs={12} sm={6} md={6} lg={6}>
          <FormGroup controlId='site'>
            <ControlLabel>Other External Link</ControlLabel>
            <FormControl
              type='url'
              value={state.site}
              onChange={handleChange('site')}
            />
          </FormGroup>
          <FormGroup controlId='repo'>
            <ControlLabel>Github Repo Link</ControlLabel>
            <FormControl
              type='url'
              value={state.repo}
              onChange={handleChange('repo')}
            />
          </FormGroup>
        </Col>
      </Row>
    </Col>
    <Col xs={12} sm={12} md={12} lg={12}>
      <Row>
        <Col className='form-fields-container--left' xs={12} sm={6} md={6} lg={6}>
          <RichTextarea
            label='Problem'
            value={state.problem}
            onChange={handleChange('problem')}
            placeholder={`What problem were you exploring, analyzing, and/or solving with this project? What made you interested in this problem?`}
          />

        </Col>
        <Col className='form-fields-container--right' xs={12} sm={6} md={6} lg={6}>
          <RichTextarea
            label='Challenges'
            value={state.challenges}
            onChange={handleChange('challenges')}
            placeholder={`Discuss trade-offs you had to make, things you got stuck on (and how you went about figuring things out), etc`}
          />
        </Col>
      </Row>
    </Col>
    <Col xs={12} sm={12} md={12} lg={12}>
      <Row>
        <Col className='form-fields-container--left' xs={12} sm={6} md={6} lg={6}>
          <RichTextarea
            label='Approach'
            value={state.approach}
            onChange={handleChange('approach')}
            placeholder={`Describe the process you undertook in building this project.`}
          />
        </Col>
        <Col className='form-fields-container--right' xs={12} sm={6} md={6} lg={6}>
          <RichTextarea
            label='Outcome'
            value={state.outcome}
            onChange={handleChange('outcome')}
            placeholder={`Briefly sum up any findings, conclusions, takeaways, things you'd change were you to continue on with the project, or "Ahaa!" moments, etc.`}
          />
        </Col>
      </Row>
    </Col>
    <Col xs={12} sm={12} md={6} mdOffset={3} lg={6} lgOffset={3}>
      <Button
        className='btn-oval'
        type='submit'
        disabled={isInvalid}
      >
        SAVE PROJECT
      </Button>
      {
        edit &&
        <div>
          <div
            style={{
              background: '#323638',
              padding: '25px 10px 10px',
              margin: '15px 0',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ImageUploader
              project={project}
              label='Project Screenshot'
              buttonText='Upload Screenshot'
              type='Screenshot'
            />
          </div>
          <Button
            className='btn-oval btn-oval__black btn-oval__danger'
            onClick={handleDelete}
          >
            DELETE PROJECT
          </Button>
        </div>
      }
    </Col>
  </form>
)

ProjectFields.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  handleDelete: PropTypes.func,
  formatSkills: PropTypes.func,
  selectSkill: PropTypes.func,
  arrowRenderer: PropTypes.func,
  skills: PropTypes.arrayOf(PropTypes.object),
  state: PropTypes.object,
  project: PropTypes.object,
  animated: PropTypes.string,
  isInvalid: PropTypes.bool,
  edit: PropTypes.bool
}

export default ProjectFields

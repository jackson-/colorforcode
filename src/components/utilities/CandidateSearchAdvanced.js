import React from 'react'
import PropTypes from 'prop-types'
import {
  FormGroup, FormControl, ControlLabel, HelpBlock,
  Radio, Button, Glyphicon, Row, Col, Checkbox } from 'react-bootstrap'
import './SearchAdvanced.css'

const CandidateSearchAdvanced = props => (
  <form className='SearchAdvanced' onSubmit={props.advancedFilterUsers}>
    <h3 className='SearchAdvanced__header'>Advanced Search</h3>
    {props.filtered &&
      <Row className='SearchAdvanced__button-container'>
        <Col className='SearchAdvanced__chip-container' xs={12} sm={12} md={12} lg={12}>
          {props.terms && props.terms.map((term, i) => (
            <Button key={i} className='search-chip' value={term} onClick={props.clearChip}>
              <Glyphicon glyph='remove-sign' /> {term}
            </Button>
          ))}
        </Col>
        <Button
          className='SearchAdvanced__button--warning'
          onClick={props.clearFilter('filter')}
        >
          Clear Filter
        </Button>
      </Row>
    }
    <FormGroup
      controlId='job-types'
      name='search-advanced__job-types'
      onChange={props.toggleCheckbox}
    >
      <ControlLabel>EMPLOYMENT TYPES</ControlLabel>
      <Checkbox
        value='Full Time'
        checked={props.state && props.state.employment_types.has('Full Time')}
      >
        Full Time
      </Checkbox>
      <Checkbox
        value='Part Time'
        checked={props.state && props.state.employment_types.has('Part Time')}
      >
        Part Time
      </Checkbox>
      <Checkbox
        value='Contract'
        checked={props.state && props.state.employment_types.has('Contract')}
      >
        Contract
      </Checkbox>
      <Checkbox
        value='Contract to Hire'
        checked={props.state && props.state.employment_types.has('Contract to Hire')}
      >
        Contract to Hire
      </Checkbox>
      <Checkbox
        value='Internship'
        checked={props.state && props.state.employment_types.has('Internship')}
      >
        Internship
      </Checkbox>
      <Checkbox
        value='Remote'
        checked={props.state && props.state.employment_types.has('Remote')}
      >
        Remote
      </Checkbox>
      <Checkbox
        value='Freelance'
        checked={props.state && props.state.employment_types.has('Freelance')}
      >
        Freelance
      </Checkbox>
    </FormGroup>
    <div className='SearchAdvanced__input-container'>
      <FormGroup
        controlId='zipcode'
        className='SearchAdvanced__zipcode'
        onChange={props.handleChange('zip_code')}
        validationState={props.validate('zip_code')}
      >
        <ControlLabel>ZIP CODE</ControlLabel>
        <FormControl type='tel' value={props.state.zip_code} />
        {
          props.validate('zip_code') === 'error' &&
            <HelpBlock>
              {`Enter a zip code to find users within ${props.state.distance} miles of.`}
            </HelpBlock>
        }
      </FormGroup>
      <FormGroup
        controlId='distance'
        className='SearchAdvanced__distance'
        onChange={props.handleChange('distance')}
        validationState={props.validate('distance')}
      >
        <ControlLabel>MAX DISTANCE (miles)</ControlLabel>
        <FormControl type='tel' value={props.state.distance} />
        {
          props.validate('distance') === 'error' &&
            <HelpBlock>
              {`Enter the max number of miles away from ${props.state.zip_code}.`}
            </HelpBlock>
        }
      </FormGroup>
    </div>
    <FormGroup
      controlId='SearchAdvanced__sort-by'
      name='SearchAdvanced__sort-by'
      onChange={props.handleChange('sortBy')}
    >
      <ControlLabel>SORT BY</ControlLabel>
      <Radio
        className='SearchAdvanced__radio'
        name='radioGroup'
        value='projectCount'
        checked={props.state && props.state.sortBy === 'projectCount'}
      >
        Project Count
      </Radio>
      <Radio
        className='SearchAdvanced__radio'
        name='radioGroup'
        value='distance'
        checked={props.state.sortBy && props.state.sortBy === 'distance'}
      >
        Distance
      </Radio>
    </FormGroup>
    <Row className='SearchAdvanced__button-container'>
      <Col className='SearchAdvanced__chip-container' xs={12} sm={12} md={12} lg={12}>
        <Button className='SearchAdvanced__button' type='submit'>
          Refine Results
        </Button>
      </Col>
    </Row>
  </form>
)

CandidateSearchAdvanced.propTypes = {
  advancedFilterUsers: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  clearChip: PropTypes.func.isRequired,
  toggleCheckbox: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  filtered: PropTypes.bool.isRequired,
  terms: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired
}

export default CandidateSearchAdvanced

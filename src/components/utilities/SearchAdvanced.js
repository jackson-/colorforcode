import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, ControlLabel,
         Checkbox, Radio, Button, Glyphicon, Row, Col } from 'react-bootstrap'
import './SearchAdvanced.css'

const SearchAdvanced = props => (
  <form className='SearchAdvanced'>
    <h3 className='SearchAdvanced__header'>Advanced Search</h3>
    {props.filtered &&
      <Row className='SearchAdvanced__reset-container'>
        <Col className='SearchAdvanced__chip-container' xs={12} sm={12} md={12} lg={12}>
          {props.terms && props.terms.map((term, i) => (
            <Button key={i} className='search-chip' value={term} onClick={props.clearChip}>
              <Glyphicon glyph='remove-sign' /> {term}
            </Button>
          ))}
        </Col>
        <Button
          className='SearchAdvanced__reset-button'
          onClick={(event, filter) => props.clearFilter(filter)}
        >
          Clear Filter
        </Button>
      </Row>
    }
    <FormGroup
      controlId='SearchAdvanced__job-types'
      name='search-advanced__job-types'
      onChange={props.toggleJobTypes}
    >
      <ControlLabel>EMPLOYMENT TYPES</ControlLabel>
      <Checkbox value='Full-time'>Full-time</Checkbox>
      <Checkbox value='Part-time'>Part-time</Checkbox>
      <Checkbox value='Contract'>Contract</Checkbox>
      <Checkbox value='Contract to Hire'>Contract to Hire</Checkbox>
      <Checkbox value='Internship'>Internship</Checkbox>
    </FormGroup>

    <FormGroup
      controlId='SearchAdvanced-distance'
      className='SearchAdvanced__distance'
      onChange={props.handleChange('distance')}
    >
      <ControlLabel>MAX DISTANCE (miles)</ControlLabel>
      <FormControl onChange={props.handleChange} />
    </FormGroup>

    <FormGroup
      controlId='SearchAdvanced__sort-by'
      name='SearchAdvanced__sort-by'
      onChange={props.handleChange('sortBy')}
      inline
    >
      <ControlLabel>SORT BY</ControlLabel>
      <Radio className='SearchAdvanced__radio' name='radioGroup' value='Date (most recent)'>
        Date (most recent)
      </Radio>
      <Radio className='SearchAdvanced__radio' name='radioGroup' value='Distance'>
        Distance
      </Radio>
    </FormGroup>
  </form>
)

SearchAdvanced.propTypes = {
  toggleJobTypes: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  clearChip: PropTypes.func.isRequired,
  filtered: PropTypes.bool.isRequired,
  terms: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired
}

export default SearchAdvanced

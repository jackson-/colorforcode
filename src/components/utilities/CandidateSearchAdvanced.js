import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, ControlLabel,
         Radio, Button, Glyphicon, Row, Col } from 'react-bootstrap'
import './SearchAdvanced.css'

const CandidateSearchAdvanced = props => (
  <form className='SearchAdvanced' onSubmit={props.filterUsers}>
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
          onClick={(event, filter) => props.clearFilter(filter)}
        >
          Clear Filter
        </Button>
      </Row>
    }
    <FormGroup
      controlId='SearchAdvanced-distance'
      className='SearchAdvanced__distance'
      onChange={props.handleChange('distance')}
    >
      <ControlLabel>MAX DISTANCE (miles)</ControlLabel>
      <FormControl type='tel' value={props.state.distance} />
    </FormGroup>
    <FormGroup
      controlId='SearchAdvanced__sort-by'
      name='SearchAdvanced__sort-by'
      onChange={props.handleChange('sortBy')}
    >
      <ControlLabel>SORT BY</ControlLabel>
      <Radio
        className='SearchAdvanced__radio'
        name='radioGroup'
        value='date'
        checked={props.state && props.state.sortBy === 'project_count'}
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
  filterUsers: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  clearChip: PropTypes.func.isRequired,
  filtered: PropTypes.bool.isRequired,
  terms: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired
}

export default CandidateSearchAdvanced

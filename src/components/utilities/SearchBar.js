import React from 'react'
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './SearchBar.css'

// see JobBoard container for example use of this component

const SearchBar = props => (
  <Form inline={props.inline} className='filter-container' onSubmit={props.handleSubmit}>
    <FormGroup controlId={`${props.type}SearchBar`} >
      <ControlLabel className='filter-label'>
        {props.labelText}
      </ControlLabel>
      <FormControl
        onChange={props.handleChange}
        className='filter'
        value={props.query}
      />
    </FormGroup>
    <Button type='submit' className='filter-button'>
      {props.submitButtonText}
    </Button>
  </Form>
)

SearchBar.propTypes = {
  // e.g., 'job' -- this will make the id of the search bar jobSearchBar (see line 22 above)
  type: PropTypes.string.isRequired,
  // true or false -- styles the search bar label, input, and button inline if true
  inline: PropTypes.bool.isRequired,
  // e.g., this.state.query -- the property on the rendering component/container's
  // state that holds onto the text as it is input
  query: PropTypes.string.isRequired,
  // e.g., this.filterJobs -- called after user hits 'Enter' on keyboard or clicks submit button
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string.isRequired
}

export default SearchBar

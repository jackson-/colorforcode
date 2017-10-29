import React, { Component } from 'react'
import RichTextEditor from 'react-rte'
import PropTypes from 'prop-types'
import { FormGroup, ControlLabel } from 'react-bootstrap'
import './RichTextarea.css'

export default class RichTextarea extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: RichTextEditor.createEmptyValue()
    }
  }

  onChange = (value) => {
    const {onChange} = this.props
    this.setState({value})
    if (onChange) {
      // Send the changes up to the parent component as an HTML string. This is here to demonstrate using `.toString()` but in a real app it would be better to avoid generating a string on each change.
      onChange(value)
    }
  }

  render () {
    const {value, readOnly, label, placeholder} = this.props
    return (
      <FormGroup controlId={`${label.toLowerCase().split(' ').join('-')}`}>
        <ControlLabel>{label}</ControlLabel>
        <RichTextEditor
          value={value}
          onChange={this.onChange}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </FormGroup>
    )
  }
}

RichTextarea.propTypes = {
  value: PropTypes.object,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func
}

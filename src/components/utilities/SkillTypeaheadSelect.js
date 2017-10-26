import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Creatable } from 'react-select'
import { ControlLabel, HelpBlock } from 'react-bootstrap'
import { connect } from 'react-redux'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import 'react-select/dist/react-select.css'
import './SkillTypeaheadSelect.css'

class SkillTypeaheadSelect extends Component {
  componentWillMount () {
    let {skills, fetching, getSkills} = this.props
    if (!skills && !fetching) {
      getSkills()
    }
  }

  render () {
    const {handleChange, skills, selected, label} = this.props
    return (
      <div>
        <ControlLabel>
          {label || 'Key Skills'}
        </ControlLabel>
        <Creatable
          multi
          clearable={false}
          options={skills}
          onChange={handleChange('skills')}
          value={selected}
          labelKey='title'
          valueKey='title'
          placeholder='type to begin selecting...'
          promptTextCreator={(label) => (`Create skill "${label}"`)}
        />
        <HelpBlock>
          Type, click or use arrows to search skills. Press 'Enter' or click to add selected skill. Click 'X' left of skill chip or press 'Backspace' to delete skill.
        </HelpBlock>
      </div>
    )
  }
}

SkillTypeaheadSelect.propTypes = {
  fetching: PropTypes.bool,
  getSkills: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.object),
  // ^selected skills saved to store with each selection
  handleChange: PropTypes.func,
  // ^parent's handleChange func
  skills: PropTypes.arrayOf(PropTypes.object),
  // ^complete list of skills for typeahead selection
  label: PropTypes.string
}

const mapStateToProps = state => ({
  skills: state.skills.all,
  fetching: state.skills.fetching,
  selected: state.skills.selected
})

const mapDispatchToProps = dispatch => ({
  getSkills: (select) => dispatch(gettingAllSkills(select))
})

export default connect(mapStateToProps, mapDispatchToProps)(SkillTypeaheadSelect)

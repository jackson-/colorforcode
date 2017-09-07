import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typeahead } from 'react-bootstrap-typeahead'
import { connect } from 'react-redux'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import './SkillTypeaheadSelect.css'

class SkillTypeaheadSelect extends Component {
  componentWillMount () {
    const {skills, fetching, getSkills} = this.props
    if (!skills && !fetching) {
      console.log('CWM - FETCHING SKILLS')
      getSkills()
    }
  }

  render () {
    const {handleChange, skills, selected} = this.props
    return (
      <Typeahead
        multiple
        allowNew
        bsStyle={'lg'}
        newSelectionPrefix={`add new skill: `}
        onChange={handleChange('skills')}
        options={skills || [{title: 'no skills loaded yet'}]}
        selected={selected}
        labelKey='title'
        emptyLabel=''
        placeholder='click or type to begin selecting...'
      />
    )
  }
}

SkillTypeaheadSelect.propTypes = {
  fetching: PropTypes.bool,
  selected: PropTypes.arrayOf(PropTypes.object),
  getSkills: PropTypes.func,
  handleChange: PropTypes.func,
  // ^parent's handleChange func
  skills: PropTypes.arrayOf(PropTypes.string)
  // ^complete list of skills for typeahead selection
}

const mapStateToProps = state => ({
  skills: state.skills.all,
  fetching: state.skills.fetching,
  selected: state.skills.selected
})

const mapDispatchToProps = dispatch => ({
  getSkills: post => dispatch(gettingAllSkills())
})

export default connect(mapStateToProps, mapDispatchToProps)(SkillTypeaheadSelect)

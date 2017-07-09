import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-bootstrap'
import { gettingAllProjects, filteringProjects } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import SearchBar from '../utilities/SearchBar'
import CandidateList from './CandidateList.js'
// import './Home.css'

class JobBoard extends Component {

  constructor (props) {
    super(props)
    this.state = {
      query: '',
      terms: [],
      filtered: false
    }
  }

  componentDidMount () {
    this.props.getProjects()
  }

  handleChange = event => {
    const {value} = event.target
    const searchTermArray = value.split(' ')
    this.setState({
      query: value,
      terms: searchTermArray
    })
  }

  clearChip = event => {
    event.preventDefault()
    const chipToClear = event.target.value
    let terms = this.state.terms.filter(term => {
      return term !== chipToClear && term !== ''
    })
    const query = terms.join(' ')
    this.setState(
      {terms, query, filtered: query.length > 0},
      this.filterJobs
      // ^second param of setState (optional) is callback to execute after setting state
    )
  }

  clearFilter = (filter) => {
    if (filter) {
      // clear the search bar, show all job listings, and hide search header
      this.setState({
        query: '',
        filtered: false
      })
      this.filterJobs()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  filterJobs = event => {
    // this is an event handler but we also use this in clearFilter,
    // in which case there's no event object to preventDefault of
    if (event) event.preventDefault()

    const {query} = this.state
    this.props.filterJobs(query)
    // ^ when query === '', all job listings are shown
    if (query) this.setState({filtered: true})
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()
  }

  render () {
    let jobs = this.props.jobs || []
    return (
      <Row className='JobBoard'>
        <SearchBar
          type='project'
          inline
          query={this.state.query}
          handleSubmit={this.filterJobs}
          handleChange={this.handleChange}
          labelText='Filter project listings by keyword'
          submitButtonText='Search projects and candidates'
        />
        {
          this.props.loading
            ? <p>Loading Job Listings...</p>
            : <CandidateList
                filtered={this.state.filtered}
                jobs={jobs}
                query={this.state.query}
                clearFilter={this.clearFilter}
                clearChip={this.clearChip}
                terms={this.state.terms}
              />
        }
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects.all,
  skills: state.skills.all,
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllProjects()),
  getSkills: post => dispatch(gettingAllSkills()),
  filterProjects: query => dispatch(filteringProjects(query))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)

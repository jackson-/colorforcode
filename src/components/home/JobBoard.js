import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { gettingAllJobs, filteringJobs, advancedFilteringJobs } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import SearchBar from '../utilities/SearchBar'
import SearchAdvanced from '../utilities/SearchAdvanced'
import JobList from './JobList.js'
import './Home.css'

class JobBoard extends Component {

  constructor (props) {
    super(props)
    this.state = {
      query: '',
      pendingTerms: [],
      terms: [],
      distance: '',
      sortBy: '',
      jobTypes: new Set([]),
      filtered: false
    }
  }

  componentDidMount () {
    this.props.getJobs()
  }

  handleChange = type => event => {
    const {value} = event.target
    const nextState = {}
    nextState[`${type}`] = value
    if (type === 'query') nextState.pendingTerms = value.split(' ')
    this.setState(nextState)
  }

  toggleJobTypes = event => {
    const {value} = event.target
    this.state.jobTypes.has(value)
      ? this.state.jobTypes.delete(value)
      : this.state.jobTypes.add(value)
    const jobTypes = new Set([...this.state.jobTypes])
    /* ^Using a Set instead of an array because we want the data values to be unique */
    this.setState({jobTypes})
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

  clearFilter = filter => {
    if (filter) {
      // if this method is invoked with a filter param,
      // we reset all search interface elements by:
      // clearing the search bar, showing all job listings, and hiding search-header
      // see SearchAdvanced.js line 21 (the Clear Filter button onClick)
      this.setState({
        query: '',
        filtered: false
      })
      this.filterJobs()()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  filterJobs = advanced => event => {
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    if (advanced) {
      const {query, distance, employment_types, sortBy} = this.state
      let coords = ''
      if (this.props.user && this.props.user.coords) {
        coords = this.props.user.coords.split(',')
      } else {
        if ('geolocation' in navigator) {
          const {getCurrentPosition} = navigator.geolocation
          const positionId = Promise.resolve(getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords
            coords = [latitude, longitude]
          }))
          .then(success => navigator.geolocation.clearWatch(positionId))
          .catch(error => console.error(
            'Could not locate user for advanced search max distance.',
            error.stack)
          )
        }
      }
      const must = employment_types.map(type => ({match: {employment_types: type}}))
      const body = {
        query: {
          bool: {
            must,
            filter: [
              {multi_match: {query, fields: ['_all']}},
              {geo_distance: {coords, distance: `${distance}mi`}}
            ]
          },
        },
        sort: [
          {updated_at: {order: 'desc'}},
          {_score: {order: 'desc'}}
        ]
      }
      if (sortBy === 'distance') {
        body.query.function_score = {
          functions: [
            {
              gauss: {
                coords: {
                  origin: {lat: coords[0], lon: coords[1]},
                  offset: `${distance}mi`,
                  scale: '5mi'
                }
              }
            }
          ]
        }
      }
      this.props.filterJobsAdvanced(body)
    } else {
      // no advanced search needed, do a basic query
      const {query} = this.state
      this.props.filterJobs(query)
      // ^ when query === '', all job listings are shown
      if (query) this.setState({filtered: true, terms: [...this.state.pendingTerms]})
      // we only show the search results header if this.state.filtered === true
      this.clearFilter()
    }
  }

  render () {
    let jobs = this.props.jobs || []
    return (
      <Row className='JobBoard'>
        <SearchBar
          type='job'
          inline
          query={this.state.query}
          handleSubmit={this.filterJobs()}
          handleChange={this.handleChange('query')}
          labelText='Filter job listings by keyword'
          submitButtonText='Search jobs'
        />
        <Col className='SearchAdvanced__container' xs={12} sm={3} md={3} lg={3}>
          <SearchAdvanced
            handleChange={this.handleChange}
            toggleCheckbox={this.toggleJobTypes}
            clearFilter={this.clearFilter}
            clearChip={this.clearChip}
            filtered={this.state.filtered}
            query={this.state.query}
            terms={this.state.terms}
          />
        </Col>
        <Col xs={12} sm={9} md={9} lg={9}>
          {this.props.loading
            ? <p>Loading Job Listings...</p>
            : <JobList filtered={this.state.filtered} jobs={jobs} />
          }
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  jobs: state.jobs.all,
  skills: state.skills.all,
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllJobs()),
  getSkills: post => dispatch(gettingAllSkills()),
  filterJobs: query => dispatch(filteringJobs(query)),
  advancedFilterJobs: body => dispatch(advancedFilteringJobs(body))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { gettingAllJobs, filteringJobs, grabbingCoords, buildBodyThenSearch } from 'APP/src/reducers/actions/jobs'
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
      employment_types: new Set([]),
      filtered: false,
      coords: ''
    }
  }

  componentWillMount () {
    if (!this.props.user || !this.props.user.coords) {
      grabbingCoords()
      .then(coords => this.setState({coords}))
      .catch(err => console.error(err))
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
    this.state.employment_types.has(value)
      ? this.state.employment_types.delete(value)
      : this.state.employment_types.add(value)
    const employment_types = new Set([...this.state.employment_types])
    /* ^Using a Set instead of an array because we want the data values to be unique */
    this.setState({employment_types})
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
        pendingTerms: [],
        terms: [],
        distance: '',
        sortBy: '',
        employment_types: new Set([]),
        filtered: false
      })
      this.filterJobs()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  buildBody = coords => {
    const {terms, distance, employment_types, sortBy} = this.state
    let must = {};
    [...employment_types].forEach(type => {
      must.match = {employment_types: type}
    })
    let should = terms.map(term => ({term: {_all: term}}))
    const body = {
      query: {
        bool: {
          must,
          should,
          filter: [

          ]
        }
      },
      sort: [{_score: {order: 'desc'}}]
    }
    if (distance) {
      body.query.bool.filter.push({
        geo_distance: {
          coords,
          distance: `${distance}mi`
        }
      })
    }
    if (sortBy === 'date') body.sort.push({updated_at: {order: 'desc'}})
    if (sortBy === 'distance') {
      body.sort = [{
        _geo_distance: {
          coords,
          order: 'asc',
          unit: 'mi',
          distance_type: 'arc'
        }
      }]
    }
    return body
  }

  advancedFilterJobs = event => {
    event.preventDefault()
    const coords = this.props.user.coords
      ? this.props.user.coords
      : this.state.coords
    this.setState(
      {filtered: true},
      () => this.props.advancedFilterJobs(this.buildBody, coords)
    )
  }

  filterJobs = event => {
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    const {query} = this.state
    this.props.filterJobs(query)
    // ^ when query === '', all job listings are shown
    if (query) this.setState({filtered: true, terms: [...this.state.pendingTerms]})
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()
  }

  render () {
    let jobs = this.props.jobs || []
    console.log(this.state)
    return (
      <Row className='JobBoard'>
        <SearchBar
          type='job'
          inline
          query={this.state.query}
          handleSubmit={this.filterJobs}
          handleChange={this.handleChange('query')}
          labelText='Filter job listings by keyword'
          submitButtonText='Search jobs'
        />
        <div className='container__flex'>
          <Col className='SearchAdvanced__container' xs={12} sm={3} md={3} lg={3}>
            <SearchAdvanced
              filterJobs={this.advancedFilterJobs}
              handleChange={this.handleChange}
              toggleCheckbox={this.toggleJobTypes}
              clearFilter={this.clearFilter}
              clearChip={this.clearChip}
              filtered={this.state.filtered}
              query={this.state.query}
              terms={this.state.terms}
              state={this.state}
            />
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            {this.props.loading
              ? <p>Loading Job Listings...</p>
              : <JobList filtered={this.state.filtered} jobs={jobs} />
            }
          </Col>
        </div>

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
  advancedFilterJobs: (bodyBuilder, coords) => {
    dispatch(buildBodyThenSearch(bodyBuilder, coords))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)

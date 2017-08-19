import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { gettingAllJobs, filteringJobs, buildBodyThenSearch } from 'APP/src/reducers/actions/jobs'
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
      zip_code: '',
      employment_types: new Set([]),
      filtered: false,
      coords: '',
      page_num:1,
      from:0,
    }
  }

  componentDidMount () {
    this.props.getJobs()
  }

  handleLocation = zip_code => {
    axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
    .then(res => res.data)
    .then(json => {
      const {location} = json.results[0].geometry
      const coords = `${location.lat},${location.lng}`
      this.setState({coords, zip_code})
    })
    .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    const {value} = event.target
    const nextState = {}
    nextState[`${type}`] = value
    if (type === 'query') nextState.pendingTerms = value.split(' ')
    if (type === 'zip_code' && value.toString().length >= 5) {
      /* first we finish updating the state of the input, then we use the zip to find the rest of the location data by passing the callback to setState (an optional 2nd param) */
      this.setState({[type]: value}, this.handleLocation(value))
    } else {
      this.setState(nextState)
    }
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

  buildBody = (coords,from) => {
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
      body.sort.push({
        _geo_distance: {
          coords,
          order: 'asc',
          unit: 'mi',
          distance_type: 'arc'
        }
      })
    }
    body.from = from
    return body
  }

  handlePagination(jobs, sign){
    let page_num = 1
    let from = 0
    const next_page= eval(`${this.state.page_num} ${sign} 1`)
    if(sign){
      const nextPageHasItems = (!(this.props.jobs.length < 10) || sign === "-" )
      if(next_page > 0 && nextPageHasItems){
        page_num = next_page
        from = eval(`${this.state.from} ${sign} 10`)
      } else{
        return null
      }
    }
    return {page_num, from}
  }

  advancedFilterJobs = event = (sign) => {
    event.preventDefault()
    const coords = this.props.user.coords
      ? this.props.user.coords
      : this.state.coords
    const {page_num, from} = this.handlePagination(this.props.jobs, sign)
    if(!page_num){
      return
    }
    this.setState(
      { filtered: true,
        page_num,
        from},
      () => this.props.advancedFilterJobs(this.buildBody, coords, from)
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
            <Row>
              <Col className="paginate"  xs={12} sm={12} md={12} lg={12}>
                <Button onClick={() => this.advancedFilterJobs("-")}>
                Back
                </Button>
                <p className="page-number">
                {this.state.page_num}
                </p>
                <Button onClick={() => this.advancedFilterJobs("+")}>
                Next
                </Button>
              </Col>
            </Row>
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
  loading: state.loading,
})

const mapDispatchToProps = dispatch => ({
  getJobs: () => dispatch(gettingAllJobs()),
  getSkills: () => dispatch(gettingAllSkills()),
  filterJobs: query => dispatch(filteringJobs(query)),
  advancedFilterJobs: (bodyBuilder, coords, from) => {
    dispatch(buildBodyThenSearch(bodyBuilder, coords, from))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)

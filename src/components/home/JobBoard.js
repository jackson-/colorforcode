import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { paginateJobs } from '../../reducers/actions/jobs'
import SearchBar from '../utilities/SearchBar'
import SearchAdvanced from '../utilities/SearchAdvanced'
import JobList from './JobList.js'
import LoadingSpinner from '../utilities/LoadingSpinner'
import './Home.css'

class JobBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      pendingTerms: [],
      terms: [],
      distance: '',
      zip_code: '',
      employment_types: new Set([]),
      coords: '',
      loading: true
    }
  }

  componentWillMount () {
    const {allJobs, fetching, authenticating, getJobs} = this.props
    if (!authenticating) {
      if (!allJobs && !fetching) {
        getJobs()
      }
      if (allJobs) {
        this.setState({loading: false})
      }
    }
  }

  componentDidMount () {
    const {terms, distance, zip_code, employment_types, coords, query, pendingTerms} = this.state
    const {filter} = this.props
    if (
      !terms.length &&
      !distance &&
      !zip_code &&
      !employment_types.length &&
      !coords &&
      !query &&
      !pendingTerms.length
    ) {
      if (filter) {
        this.handleChange('filter')()
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const {authenticating, getJobs} = this.props
    if (!authenticating) {
      if (!nextProps.allJobs && !nextProps.filteredJobs && !nextProps.fetching) {
        getJobs()
      }
      if (nextProps.allJobs || nextProps.filteredJobs) {
        this.setState({loading: false})
      }
    }
  }

  handleLocation = zip_code => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
      .then(res => res.data)
      .then(json => {
        const geometry = json.results[0].geometry.location
        const coords = {lat: parseFloat(geometry.lat), lng: parseFloat(geometry.lng)}
        this.setState({coords})
      })
      .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    let nextState, value
    if (event) {
      value = event.target.value
      nextState = {}
      nextState[`${type}`] = value
    }
    if (type === 'filter') {
      const {filter} = this.props
      if (filter.employment_types) filter.employment_types = new Set([...filter.employment_types])
      return this.setState(filter)
    }
    if (type === 'query') nextState.pendingTerms = value.split(' ')
    if (type === 'zip_code' && value.toString().length >= 5) {
      /* first we finish updating the state of the input, then we use the zip to find the rest of the location data by passing the callback to setState (an optional 2nd param) */
      this.setState({[type]: value}, this.handleLocation(value))
    } else {
      this.setState(nextState)
    }
  }

  getValidationState = (type) => {
    const { zip_code, distance } = this.state
    if (type === 'zip_code') {
      if (zip_code.length < 5 && distance.length > 0) return 'error'
      else if (distance.length > 0 && zip_code.length > 0) return null
    } else {
      if (!distance && zip_code.length > 0) return 'error'
      else if (distance.length > 0 && zip_code.length > 0) return null
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

  isChecked = type => {
    const {filter} = this.props
    if (filter && filter.employment_types) {
      return new Set(filter.employment_types).has(type)
    } else {
      return this.state.employment_types.has(type)
    }
  }

  clearChip = event => {
    event.preventDefault()
    const chipToClear = event.currentTarget.value
    let pendingTerms = this.state.terms.filter(term => {
      return term !== chipToClear && term !== ''
    })
    const {getJobs, filter} = this.props
    const query = pendingTerms.length > 0 ? pendingTerms.join(' ') : ''
    this.setState(
      {query, pendingTerms, loading: true},
      () => {
        if (filter.advanced) this.advancedFilterJobs()
        else if (query) this.filterJobs()
        else getJobs()
      }
      // ^second param of setState (optional) is callback to execute after setting state
    )
  }

  clearFilter = filter => event => {
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
        zip_code: '',
        employment_types: new Set([]),
        coords: '',
        loading: false
      }, this.props.getJobs)
    } else {
      // just clear the search bar, nbd
      this.setState({query: '', pendingTerms: []})
    }
  }

  handlePagination = action => event => {
    event.preventDefault()
    const {allJobs, filteredJobs, filtered, savePagination, pageNum, offset} = this.props
    const total = filtered ? filteredJobs.length : allJobs.length
    const maxPageNum = Math.round(total % 10)
    if (action === 'next' && (pageNum + 1 <= maxPageNum)) {
      return savePagination(offset + 10, pageNum + 1)
    } else if (action === 'back' && (pageNum - 1 > 0)) {
      return savePagination(offset - 10, pageNum - 1)
    }
  }

  advancedFilterJobs = event => {
    if (event) event.preventDefault()
    const {advancedFilterJobs} = this.props
    const {terms, coords, distance, employment_types, zip_code} = this.state
    const body = {
      terms,
      coords,
      distance,
      zip_code,
      advanced: true,
      employment_types: [...employment_types]
    }
    this.setState({loading: true}, advancedFilterJobs(body))
  }

  filterJobs = event => {
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    const {query} = this.state
    // ^ when query === '', we don't filter so all job listings continue to be shown
    if (query) {
      console.log('PENDING TERMS', this.state.pendingTerms, 'TERMS', this.state.terms)
      this.setState({
        terms: [...this.state.pendingTerms],
        loading: true
      }, this.props.filterJobs({
        query,
        advanced: this.props.filter
          ? this.props.filter.advanced
          : false
      }))
    }
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()()
  }

  render () {
    const {allJobs, filteredJobs, filtered, fetching, offset, pageNum} = this.props
    const {loading} = this.state
    const jobList = !filteredJobs || !filtered ? allJobs : filteredJobs
    const lastIndex = jobList ? jobList.length - 1 : 0
    const limit = 10
    let jobs = jobList ? jobList.slice(offset, (offset + limit)) : jobList
    return (
      <Row className='JobBoard'>
        <SearchBar
          type='job'
          inline
          id='search-jobs'
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
              validate={this.getValidationState}
              clearFilter={this.clearFilter}
              isChecked={this.isChecked}
              clearChip={this.clearChip}
              filtered={this.props.filtered}
              query={this.state.query}
              terms={this.state.terms}
              state={this.state}
            />
          </Col>
          <Col xs={12} sm={9} md={9} lg={9}>
            <Row>
              <Col className='paginate-container' xs={12} sm={12} md={12} lg={12}>
                <Button
                  className='btn-paginate'
                  onClick={this.handlePagination('back')}
                  disabled={offset === 0}
                >
                  Back
                </Button>
                <span>
                  {pageNum}
                </span>
                <Button
                  className='btn-paginate'
                  onClick={this.handlePagination('next')}
                  disabled={(offset + limit) > lastIndex}
                >
                  Next
                </Button>
              </Col>
            </Row>
            {
              loading || fetching
                ? <LoadingSpinner top={'40vh'} />
                : (
                  <JobList
                    filtered={filtered}
                    jobs={jobs || []}
                    total={jobList ? jobList.length : 0}
                  />
                )
            }
          </Col>
        </div>
      </Row>
    )
  }
}

JobBoard.propTypes = {
  allJobs: PropTypes.arrayOf(PropTypes.object),
  filteredJobs: PropTypes.arrayOf(PropTypes.object),
  filtered: PropTypes.bool,
  getJobs: PropTypes.func,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  fetching: PropTypes.bool,
  coords: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  // either '' (for falsey-ness) or a GeoJSON object
  authenticating: PropTypes.bool,
  offset: PropTypes.number,
  pageNum: PropTypes.number,
  savePagination: PropTypes.func,
  filter: PropTypes.any
}

const mapStateToProps = state => ({
  allJobs: state.jobs.all,
  filteredJobs: state.jobs.filteredJobs,
  filtered: state.jobs.filtered,
  filter: state.jobs.filter,
  fetching: state.jobs.fetchingAll,
  offset: state.jobs.offset,
  pageNum: state.jobs.pageNum,
  authenticating: state.auth.authenticating
})

const mapDispatchToProps = dispatch => ({
  savePagination: (offset, pageNum) => dispatch(paginateJobs(offset, pageNum))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)

import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
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
      sortBy: '',
      zip_code: '',
      employment_types: new Set([]),
      filtered: false,
      coords: '',
      page_num: 1,
      from: 0,
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

  clearChip = event => {
    event.preventDefault()
    this.setState({loading: true})
    const chipToClear = event.target.value
    console.log('chipToClear - ', chipToClear)
    let terms = this.state.terms.filter(term => {
      return term !== chipToClear && term !== ''
    })
    const query = terms.join(' ')
    this.setState(
      {pendingTerms:terms, terms, query, filtered: query.length > 0, loading: false},
      () => {
        if (query) this.props.filterJobs(query)
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
      console.log('CLEARING FILTER')
      this.setState({
        query: '',
        pendingTerms: [],
        terms: [],
        distance: '',
        sortBy: '',
        zip_code: '',
        coords: '',
        employment_types: new Set([]),
        filtered: false,
        loading: false
      })
    } else {
      // just clear the search bar, nbd
      this.setState({query: '', pendingTerms: []})
    }
  }

  buildBody = (coords, from) => {
    const {terms, distance, employment_types, sortBy} = this.state
    return {
      terms,
      coords,
      distance,
      employment_types: [...employment_types],
      sortBy,
      from
    }
  }

  handlePagination = (sign) => {
    const {allJobs, filteredJobs} = this.props
    const {filtered} = this.state
    let page_num = 1
    let from = 0
    const next_page = sign === 'plus'
      ? page_num + 1
      : page_num - 1
    const jobs = filtered ? filteredJobs : allJobs
    const nextPageHasItems = (!(jobs.length < 10) || sign === 'minus')
    if (next_page > 0 && nextPageHasItems) {
      page_num = next_page
      from = sign === 'plus'
        ? from + 10
        : from - 10
    } else {
      return null
    }
    return {page_num, from}
  }

  advancedFilterJobs = sign => event => {
    event.preventDefault()
    const coords = this.state.coords
      ? this.state.coords
      : this.props.coords
    // if this method is being called as a result of clicking Next or Back:
    if (sign) {
      const {page_num, from} = this.handlePagination(sign)
      if (!page_num) {
        return
      } else {
        return this.setState({
          from,
          filtered: true,
          page_num,
          loading: true
        }, this.props.advancedFilterJobs(this.buildBody, coords, from))
      }
    }
    this.setState({
      from: this.state.from,
      filtered: true,
      page_num: this.state.page_num,
      loading: true
    }, this.props.advancedFilterJobs(this.buildBody, coords, this.state.from))
  }

  filterJobs = event => {
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    const {query} = this.state
    // ^ when query === '', we don't filter so all job listings continue to be shown
    if (query) {
      this.setState({
        filtered: true,
        terms: [...this.state.pendingTerms],
        loading: true
      }, this.props.filterJobs(query))
    }
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()()
  }

  render () {
    const {allJobs, filteredJobs} = this.props
    const {loading, filtered} = this.state
    const jobs = !filteredJobs || !filtered ? allJobs : filteredJobs
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
              filterJobs={this.advancedFilterJobs()}
              handleChange={this.handleChange}
              toggleCheckbox={this.toggleJobTypes}
              validate={this.getValidationState}
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
              <Col className='paginate-container' xs={12} sm={12} md={12} lg={12}>
                <Button className='btn-paginate' onClick={this.advancedFilterJobs('minus')}>
                  Back
                </Button>
                <span>
                  {this.state.page_num}
                </span>
                <Button className='btn-paginate' onClick={this.advancedFilterJobs('plus')}>
                  Next
                </Button>
              </Col>
            </Row>
            {
              loading
                ? <LoadingSpinner top={'40vh'} />
                : <JobList filtered={this.state.filtered} jobs={jobs || []} />
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
  getJobs: PropTypes.func,
  filterJobs: PropTypes.func,
  advancedFilterJobs: PropTypes.func,
  fetching: PropTypes.bool,
  coords: PropTypes.object,
  authenticating: PropTypes.bool
}

const mapStateToProps = state => ({
  allJobs: state.jobs.all,
  filteredJobs: state.jobs.filtered,
  fetching: state.jobs.fetchingAll,
  authenticating: state.auth.authenticating
})

export default connect(mapStateToProps)(JobBoard)

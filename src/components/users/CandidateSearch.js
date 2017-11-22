import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { paginateUsers } from '../../reducers/actions/users'
import SearchBar from '../utilities/SearchBar'
import LoadingSpinner from '../utilities/LoadingSpinner'
import CandidateSearchAdvanced from '../utilities/CandidateSearchAdvanced'
import CandidateList from './CandidateList.js'
import axios from 'axios'
import '../home/Home.css'

class CandidateSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      terms: [],
      coords: '',
      pendingTerms: [],
      zip_code: '',
      employment_types: new Set([]),
      distance: '',
      sortBy: '',
      loading: true,
      canSearch: false
    }
  }

  componentWillMount () {
    const {allUsers, fetching, authenticating, getUsers} = this.props
    this.checkForActiveListings()
    if (!authenticating) {
      if (!allUsers && !fetching) {
        getUsers()
      }
      if (allUsers) {
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
    const {getUsers, authenticating} = this.props
    if (!authenticating) {
      if (!nextProps.allUsers && !nextProps.fetching) {
        getUsers()
      }
      if (nextProps.allUsers || nextProps.filteredUsers) {
        this.setState({loading: false})
      }
    }
  }

  checkForActiveListings = () => {
    let canSearch = false
    const {employer: {listings}} = this.props.user
    listings.forEach((l) => {
      if (l.status === 'open') canSearch = true
      return
    })
    if (canSearch) {
      this.setState({canSearch})
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
    const {zip_code, distance, sortBy} = this.state
    if (sortBy === 'distance' && (!zip_code || !distance)) return 'error'
    else if (type === 'zip_code') {
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

  isChecked = (type, sortBy) => {
    const {filter} = this.props
    if (sortBy) {
      return sortBy === this.state.sortBy
    } else {
      if (!filter && this.state.employment_types.length === 0) {
        return false
      } else if (filter && filter.employment_types) {
        return new Set(filter.employment_types).has(type)
      } else {
        return this.state.employment_types.has(type)
      }
    }
  }

  clearFilter = filter => event => {
    if (filter) {
      // if this method is invoked with a filter param,
      // we reset all search interface elements by:
      // clearing the search bar, showing all job listings, and hiding search-header
      // see SearchAdvanced.js line 21 (the Clear Filter button onClick)
      this.setState({
        query: '',
        terms: [],
        coords: '',
        pendingTerms: [],
        zip_code: '',
        employment_types: new Set([]),
        distance: '',
        sortBy: '',
        loading: false
      })
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  clearChip = event => {
    event.preventDefault()
    const chipToClear = event.currentTarget.value
    let terms = this.state.terms.filter(term => {
      return term !== chipToClear && term !== ''
    })
    const {getUsers, filter} = this.props
    const query = terms.length > 0 ? terms.join(' ') : ''
    this.setState(
      {query, terms, loading: true},
      () => {
        if (filter.advanced) this.advancedFilterUsers()
        else if (query) this.filterUsers()
        else getUsers()
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
        sortBy: '',
        zip_code: '',
        coords: '',
        employment_types: new Set([]),
        loading: false
      }, this.props.getUsers)
    } else {
      // just clear the search bar, nbd
      this.setState({query: '', pendingTerms: []})
    }
  }

  toNearestTen = num => {
    return Math.ceil((num + 1) / 10) * 10
  }

  handlePagination = action => event => {
    event.preventDefault()
    const {allUsers, filteredUsers, filtered, savePagination, pageNum, offset} = this.props
    const total = filtered ? filteredUsers.length : allUsers.length
    const maxPageNum = this.toNearestTen(total) / 10
    if (action === 'next' && (pageNum + 1 <= maxPageNum)) {
      return savePagination(offset + 10, pageNum + 1)
    } else if (action === 'back' && (pageNum - 1 > 0)) {
      return savePagination(offset - 10, pageNum - 1)
    }
  }

  filterUsers = event => {
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    const {query} = this.state
    // ^ when query === '', we don't filter so all job listings continue to be shown
    if (query) {
      this.setState({
        terms: [...this.state.pendingTerms],
        loading: true
      }, this.props.filterUsers({
        query,
        advanced: this.props.filter
          ? this.props.filter.advanced
          : false
      }))
    }
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()()
  }

  advancedFilterUsers = event => {
    if (event) event.preventDefault()
    const {advancedFilterUsers} = this.props
    const {terms, distance, employment_types, coords, zip_code, sortBy} = this.state
    const body = {
      terms,
      coords,
      zip_code,
      distance,
      advanced: true,
      employment_types: [...employment_types],
      sortBy
    }
    this.setState({loading: true}, advancedFilterUsers(body))
  }

  render () {
    const {allUsers, filteredUsers, filtered, fetching, offset, pageNum} = this.props
    const {loading} = this.state
    const userList = !filteredUsers || !filtered ? allUsers : filteredUsers
    const lastIndex = userList ? userList.length - 1 : 0
    const limit = 10
    let users = userList ? userList.slice(offset, (offset + limit)) : userList
    return (
      <Row className='CandidateSearch'>
        <SearchBar
          type='project'
          inline
          id='search-talent'
          query={this.state.query}
          handleSubmit={this.filterUsers}
          handleChange={this.handleChange('query')}
          labelText='Filter users by skills'
          submitButtonText='Search'
        />
        <div className='container__flex'>
          <Col className='SearchAdvanced__container' xs={12} sm={3} md={3} lg={3}>
            <CandidateSearchAdvanced
              filterUsers={this.advancedFilterUsers}
              toggleCheckbox={this.toggleJobTypes}
              validate={this.getValidationState}
              isChecked={this.isChecked}
              handleChange={this.handleChange}
              clearFilter={this.clearFilter}
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
                  disabled={offset === 0}
                  onClick={this.handlePagination('back')}
                >
                  Back
                </Button>
                <span>
                  {pageNum}
                </span>
                <Button
                  className='btn-paginate'
                  disabled={(offset + limit) > lastIndex}
                  onClick={this.handlePagination('next')}
                >
                  Next
                </Button>
              </Col>
            </Row>
            {
              loading || fetching
                ? <LoadingSpinner top={'20vh'} />
                : (
                  <CandidateList
                    filtered={this.props.filtered}
                    users={users || []}
                    total={userList ? userList.length : 0}
                    canSearch={this.state.canSearch}
                  />
                )
            }
          </Col>
        </div>
      </Row>
    )
  }
}

CandidateSearch.propTypes = {
  allUsers: PropTypes.arrayOf(PropTypes.object),
  filteredUsers: PropTypes.arrayOf(PropTypes.object),
  filtered: PropTypes.bool,
  coords: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // either '' (for falsey-ness) or an object
  getUsers: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func,
  fetching: PropTypes.bool,
  authenticating: PropTypes.bool,
  filter: PropTypes.object,
  offset: PropTypes.number,
  pageNum: PropTypes.number,
  savePagination: PropTypes.func,
  user: PropTypes.any
}

const mapStateToProps = state => ({
  allUsers: state.users.all,
  filteredUsers: state.users.filteredUsers,
  filtered: state.users.filtered,
  authenticating: state.auth.authenticating,
  fetching: state.users.fetchingAll,
  filter: state.users.filter,
  offset: state.users.offset,
  pageNum: state.users.pageNum,
  user: state.auth.currentUser
})

const mapDispatchToProps = dispatch => ({
  savePagination: (offset, pageNum) => dispatch(paginateUsers(offset, pageNum))
})

export default connect(mapStateToProps, mapDispatchToProps)(CandidateSearch)
